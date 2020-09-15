const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  target: 'node',

  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  // Stop compilation early in production.
  bail: process.env.NODE_ENV === 'production',

  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'cheap-module-source-map',

  entry: [
    './src/index.js',
  ],

  output: {
    path: path.join(__dirname, '..', 'build'),
    publicPath: '/',
    filename: process.env.NODE_ENV === 'production' ? '[name].prod.js' : '[name].dev.js',
  },

  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [
      // This is only used in production mode.
      new TerserPlugin({
        terserOptions: {
          parse: {
            // We want terser to parse ECMA 8 code. However, we don't want it to apply any
            // minification steps that turns valid ECMA 5 code into invalid ECMA 5 code. This is
            // why the 'compress' and 'output' sections only apply transformations that are ECMA 5
            // safe.
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default.
            ascii_only: true
          }
        },
        sourceMap: true
      }),
    ]
  },

  // Need this to avoid error when working with Express.
  externals: [nodeExternals()],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

  node: {
    // Set __dirname and __filename to false when working with express, otherwise the build fails.
    __dirname: false,
    __filename: false
  }
};
