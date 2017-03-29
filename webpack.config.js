const path = require( 'path' );
const webpack = require( 'webpack' );
const createBabelConfig = require( './babelrc' );
const nodeExternals = require( 'webpack-node-externals' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const PRODUCTION = process.env.NODE_ENV === 'production';
const MinifierPlugin = webpack.optimize.UglifyJsPlugin;

const clientConfig = {
	entry: {
		bundle: path.resolve( './src/client/index.js' )
	},
	output: {
		path: path.resolve( './dist' ),
		publicPath: '/dist/',
		filename: '[name].[chunkhash].js'
	},
	// filename: '[name].[chunkhash].js',
 //            path: path.resolve(__dirname, 'dist')

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
               // this assumes your vendor imports exist in the node_modules directory
               return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),
		PRODUCTION && new MinifierPlugin(),
		new webpack.DefinePlugin( {
			'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV )
		} ),
		new HtmlWebpackPlugin( {
			template: "src/index.html"
		} )
	].filter( e => e ),

	module: {
		rules: [ {
			test: /\.js$/,
			include: path.resolve( './src' ),
			loader: 'babel-loader',
			options: createBabelConfig(),
		} ],
	},
	devtool: PRODUCTION ? 'source-map' : 'cheap-module-eval-source-map',
};

const serverConfig = {
	target: 'node',
	externals: [ nodeExternals( {
		whitelist: PRODUCTION ? [ 'react', 'react-dom/server' ] : []
	} ) ],
	node: {
		__dirname: true
	},

	entry: path.resolve( './src/server/index.js' ),
	output: {
		path: path.resolve( './dist' ),
		filename: 'server.js',
	},

	// resolve: {
	// 	alias: PRODUCTION ? {
	// 		'react': 'react/dist/react.min.js',
	// 		'react-dom/server': 'react-dom/dist/react-dom-server.min.js',
	// 	} : {},
	// },

	plugins: [
		PRODUCTION && new MinifierPlugin(),
		new webpack.BannerPlugin( {
			banner: 'require("source-map-support").install();',
			raw: true,
			entryOnly: false,
		} ),
		new webpack.DefinePlugin( {
			'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV )
		} )
	].filter( e => e ),

	module: {
		rules: [ {
			test: /\.js$/,
			include: path.resolve( './src' ),
			loader: 'babel-loader',
			query: createBabelConfig( {
				server: true
			} ),
		} ],
	},

};

// Notice that both configurations are exported
module.exports = [ clientConfig, serverConfig ];