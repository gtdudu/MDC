import webpack from 'webpack';
import path from 'path';
import autoprefixer from 'autoprefixer'

export default {
	devtool: "#eval-source-map",
	debug: false,
	target: "web",
	entry: [
		'webpack-hot-middleware/client',
		'./common/index.js'
	],
	output: {
		path: __dirname,
		filename: '[hash]-[name].js',
		publicPath: '/'
	},
	node: {
		// Prevents the `process.env` defined in server response
		// from being re-defined inside modules
		// see https://github.com/webpack/node-libs-browser
		process: false
	},
	plugins: [

		// This plugin looks for similar chunks and files
		// and merges them for better caching by the user
		new webpack.optimize.DedupePlugin(),

		// This plugin optimizes chunks and modules by
		// how much they are used in the app
		new webpack.optimize.OccurenceOrderPlugin(),

		// manage hot reloading
		new webpack.HotModuleReplacementPlugin(),

		// need for Hot reload
		new webpack.NoErrorsPlugin(),

		// define custom env variable throught webpack
		new webpack.DefinePlugin({
			"process.env": {
				// without this react will not be optimized for production
				NODE_ENV: 'process.env.NODE_ENV',
				REDUX_LOGGER: `process.env.REDUX_LOGGER`,
        HOST: `process.env.HOST`,
        PORT: `process.env.PORT`,
			},
		}),
	],
	resolve: {
		// extensions not need while importing js files. webpack will
		extensions: ['', '.js'],
		alias: {
			request: 'browser-request'
		}
	},
	module: {
		preLoaders: [
			// baggage preLoader tries automatically import css or scss files
			// which have the same name as the js file
			{
				test: /\.js/,
				loader: 'baggage?[file].scss&[file].css',
			},
			// check the code with eslint before compiling
			{
				test: /\.js/,
				loader: 'eslint',
			}
		],
		loaders: [
			{
				// run all the code through babel (see .babelrc )
				test: /\.js$/,
				loader: 'babel',
				include: path.join(__dirname, 'common'),
				query: {
					env: {
						development: {
							// without this component have a hard finguring out how to re render
							// after a hot update
							presets: ["react-hmre"]
						}
					},
				}
			},
      { test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
      { test: /\.(jpe?g|png|gif)$/i, loaders: ['file'] },
      { test: /\.ico$/, loader: 'file?name=[name].[ext]' },
      {
        test: /(\.css|\.scss)$/,
      	include: path.join(__dirname, 'common'),
        loaders: ['style', 'css?sourceMap', 'postcss', 'sass?sourceMap']
      }

		]
	},
  postcss: () => [autoprefixer({ browsers: ['last 3 versions'] })]

};
