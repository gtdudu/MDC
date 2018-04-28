import configDev from '../webpack.config.js'
import cssModulesRequireHook from 'css-modules-require-hook'
import webpack from 'webpack'
import hapi from 'hapi'
import inert from 'inert'
import happyDevPlugin from 'hapi-webpack-plugin'
import path from 'path'

import * as api from './api/'
import serverRender from './ssr/';


if (process.env.NODE_ENV === "development") {
  setImmediate(start);
}

function start() {
    // require hook to compile CSS Modules in runtime
    // https://github.com/css-modules/css-modules-require-hook
    cssModulesRequireHook({generateScopedName: '[path][name]-[local]'});

    // compile front end
    const compiler = webpack(configDev);
    compiler.plugin("compile", () => {
       console.log("webpack build started.");
    });

    // webpack-dev-middleware config
    const assets = {
      noInfo: true,
      publicPath: configDev.output.publicPath,
      serverSideRender: true,
    };

    // webpack-hot-middleware config
    const hot = {};

    const registerHapiWepackPlugin = {
      // Serve hot-reloading bundle to client
      register: happyDevPlugin,
      options: {
        compiler,
        assets,
        hot,
      },
    };

    const hapiPlugins = [
      inert,
      registerHapiWepackPlugin,
    ];

    // create hapi server;
    const server = new hapi.Server();

    // check process and connect server
    const host = process.env.HOST || "127.0.0.1"
    const port = process.env.HOST || 3000
    server.connection({host, port});

    // config server
    server.register(hapiPlugins, err => {
      if (err) { // uncomment this in prod
        console.log(err);
      }

      // serve public/assets folder with 'inert'
      server.route([{
        config: { auth: false },
        method: 'GET',
        path: '/public/{param*}',
        handler: {
          directory: {
            path: path.join(__dirname, '../public/'),
            redirectToSlash: true,
          }
        }
      }]);

      // register apis
      server.route(api.quotes);

      // Anything else gets passed to the client app's server rendering
      // Hapi hooks:
      server.ext('onPreResponse', (request, reply) => {
        // the 'onPreResponse' hook will catch all request therefore we need
        // to prevent it from messing with inert serving static files...
        // should we have one build and one public folders ? or better to have a nested
        // public folder ?
        // this doesn't look really clean : todo find a better way

        if (request.path.length >= 4 && request.path.substr(0, 4) === '/api') {
          return reply.continue();
        }

        if (request.path.length >= 7 && request.path.substr(0, 7) === '/public') {
          return reply.continue();
        }

        if (request.path === '/favicon.ico') {
          reply.continue()
          return
        }

        // get generated assets name(s) and make sure it's an array of strings
        const rawWebpackAssets = request.raw.res.locals.webpackStats.toJson().assetsByChunkName.main;
        const webpackAssets = Array.isArray(rawWebpackAssets) ? rawWebpackAssets : [rawWebpackAssets];

        // generate html depending on route and serve it to the client
        return serverRender(request.path, webpackAssets)
          .then(page => {
            reply(page);
          })
          .catch(err => {
            if (err.err && err.err === "redirect") {
              return reply.redirect(err.args);
            }

            if (err.err === "continue") {
              return reply.continue();
            }

            return reply(err.stack);
          })
        ;
      });
      server.on('response', request => {
        if (request.url.path.lastIndexOf('/api', 0) === 0) {
          console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.path + ' --> ' + request.response.statusCode);
        }
      });

      // start it all
      server.start(() => {
        console.log("Please wait for webpack build, server running at http://localhost:8000")
      });
    });

  // Do "hot-reloading" of react stuff on the server
  // Throw away the cached client modules and let them be re-required next time
  compiler.plugin('done', () => {
    console.log("Clearing /client/ module cache from server");
    Object.keys(require.cache).forEach(id => {
      if (/[\/\\]client[\/\\]/.test(id)) delete require.cache[id];
    });
   console.log(`running at : ${server.info.uri}`);
  });
}
