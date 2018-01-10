const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'eval-source-map',
  devServer: {
    publicPath: '/assets/',
    host: 'localhost',
    port: 3000,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  output: {
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
});
