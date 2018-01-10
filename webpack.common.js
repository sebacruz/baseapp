const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackManifestPlugin = require('webpack-manifest-plugin');

const DIST_PATH = path.resolve(__dirname, 'public/assets');

const extractStyles = new ExtractTextPlugin({
  filename: '[name].[hash].css',
  disable: process.env.NODE_ENV === 'development'
});

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'resources/app')
  },
  output: {
    filename: '[name].[hash].js',
    path: DIST_PATH
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: extractStyles.extract(
          {
            use: [
              {
                loader: 'css-loader'
              },
              {
                loader: 'postcss-loader',
                options: {
                  config: {
                    ctx: {
                      cssnano: {},
                      cssnext: {}
                    }
                  }
                }
              },
              {
                loader: 'sass-loader'
              }
            ],
            // Use style-loader in development
            fallback: 'style-loader'
          })
      },
      {
        test: /\.css$/,
        use: extractStyles.extract({
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            }
          ],
          // Use style-loader in development
          fallback: 'style-loader'
        })
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([DIST_PATH], {
      exclude: ['.gitkeep']
    }),
    new WebpackManifestPlugin(),
    extractStyles
  ],
  resolve: {
    extensions: [
      '.js',
      '.jsx'
    ],
    alias: {
      app: path.resolve(__dirname, 'resources/app')
    }
  }
};
