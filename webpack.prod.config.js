const webpack = require('webpack')
const path = require('path')
const extractorPlugin = require('extract-text-webpack-plugin')
const cleanPlugin = require('clean-webpack-plugin')
const AssetsWebpackPlugin = require('assets-webpack-plugin')
const autoprefixer = require('autoprefixer')

module.exports = {
  devtool: false,
  debug: false,
  target: "web",
  entry: './common/index.js',
  output: {
    path: path.join(__dirname, 'build'),
    // we use hash and name so that the client can cash the different versions..
    filename: '[hash]-[name].js',
    publicPath: '/public/'
  },
  node: {
    // Prevents the `process.env` defined in server response
    // from being re-defined inside modules
    // see https://github.com/webpack/node-libs-browser
    process: false
  },
  plugins: [

    // Delete build folder before doing anything else
    new cleanPlugin(path.join(__dirname, 'build')),

    new AssetsWebpackPlugin({
      filename: "assets.json",
      path: path.join(__dirname, 'build'),
      prettyPrint: true
    }),

    // This plugin extract css to a different bundle file.
    // available options : [name], [hash]
    new extractorPlugin('[hash]-[name].css'),

    // This plugin looks for similar chunks and files
    // and merges them for better caching by the user
    new webpack.optimize.DedupePlugin(),

    // This plugin optimizes chunks and modules by
    // how much they are used in the app
    new webpack.optimize.OccurenceOrderPlugin(),

    // This plugin optimizes chunks and modules by
    // how much they are used in the app
    new webpack.optimize.CommonsChunkPlugin({
      name: 'main', // Move dependencies to our main file
      children: true, // Look for common dependencies in all children,
      minChunks: 2, // How many times a dependency must come up before being extracted
    }),

    // This plugin prevents Webpack from creating chunks
    // that would be too small to be worth loading separately
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 51200, // ~50kb
    }),

    // uglify everything (also does minifying out of the box)
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),

    // define custom env variable throught webpack
    new webpack.DefinePlugin({
      "process.env": {
        // without this react will not be optimized for production
        NODE_ENV: '"production"',
        BROWSER: "true",
      },
    }),
  ],
  resolve: {
    // extensions not need while importing js files. webpack will
    // try those ones automatically !
    extensions: ['', '.js'],
    alias: {
      request: 'browser-request'
    }
  },
  module: {
    preLoaders: [
      {
        // baggage preLoader tries automatically import css or scss files
        // which have the same name as the js file
        test: /\.js/,
        loader: 'baggage?[file].scss&[file].css',
      }
    ],
    loaders: [
      { test: /\.js$/, include: `${__dirname}/common`, loaders: ['babel'] },
      { test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
      { test: /\.(jpe?g|png|gif)$/i, loaders: ['file'] },
      { test: /\.ico$/, loader: 'file?name=[name].[ext]' },
      {
        test: /(\.css|\.scss)$/,
        loader: extractorPlugin.extract('css?sourceMap!postcss!sass?sourceMap')
      }
    ]
  },
  postcss: () => [autoprefixer({ browsers: ['last 3 versions'] })],
}
