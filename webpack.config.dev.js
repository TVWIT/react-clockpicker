var webpack = require('webpack');
var path = require('path');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  devtool: 'eval',
  mode: 'development',
  entry: __dirname + '/examples/index.jsx',

  output: {
    pathinfo: false,
    filename: 'ClockPicker.js',
    path: __dirname + '/dist'
  },

  module: {

    rules: [{
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader'
        }]
      }
    ]
  },

  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 7000,
      server: {
        baseDir: ['examples/', 'dist/']
      }
    }, {
      reload: true
    }),

    new MiniCssExtractPlugin({
      filename: 'ClockPicker.css',
      chunkFilename: "[id].css"
    }),

    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map'
    }),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"development"'
      }
    })
  ],

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.join(__dirname, "node_modules")]
  }
};
