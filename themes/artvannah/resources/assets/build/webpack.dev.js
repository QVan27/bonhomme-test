const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const config = require('./config')
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  watchOptions: {
    aggregateTimeout: 600,
    ignored: /node_modules/
  },
  devServer: {
    static: path.join(__dirname, '../../assets/'),
    port: 3030,
    hot: true,
    liveReload: false,
    devMiddleware: {
      writeToDisk: true
    },
    client: {
      logging: 'error',
      overlay: {
        errors: true,
        warnings: false
      }
    },
    proxy: {
      '!**/dist/**': {
        // set the URL of the wordpress site
        target: config.devUrl,
        changeOrigin: true
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                parser: 'postcss-safe-parser',
                plugins: [
                  ['autoprefixer']
                ]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require.resolve('sass'),
              sourceMap: true,
              sassOptions: {
                outputStyle: 'compressed'
              }
            }
          }
        ]
      }
    ]
  }
})
