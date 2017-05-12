import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackManifestPlugin from 'webpack-manifest-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

/**
 * PostCSS configuration
 *
 * See more here: https://github.com/postcss/postcss-loader
 *
 * @type {Object}
 */
const postcssOptions = {
  plugins: (webpack) => {
    let plugins = [
      require('postcss-import')(),
      require('postcss-url')(),
      require('postcss-cssnext')(),
      require('postcss-browser-reporter')(),
      require('postcss-reporter')()
    ];

    if (process.env.NODE_ENV === 'production') {
      plugins.push(require('cssnano')({
        autoprefixer: false,
        reduceIdents: false
      }));
    }

    return plugins;
  }
}

export default {
  entry: {
    front: path.join(__dirname, '/resources/app/front.js')
  },
  output: {
    path: path.join(__dirname, '/public/assets'),
    filename: '[name]-[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader'
              },
              {
                loader: 'postcss-loader',
                options: postcssOptions
              },
              {
                loader: 'resolve-url-loader'
              },
              {
                loader: 'sass-loader'
              }
            ]
          })
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: '[hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              optipng: {
                optimizationLevel: 7
              },
              gifsicle: {
                interlaced: false
              },
              mozjpeg: {
                quality: 75
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name]-[hash].css'),
    new CleanWebpackPlugin([path.join(__dirname, '/public/assets')], {
      exclude: ['.gitkeep']
    }),
    new WebpackManifestPlugin()
  ]
}
