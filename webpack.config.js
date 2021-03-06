const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') //installed via npm
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

let MyPlugin = require('./plugin')

var webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

let devMode = true
let fs = require('fs')
let _config = function() {}
if (fs.existsSync('./config/dev.js')) {
  _config = require('./config/dev')
}

let baseConfig = function() {
  return Object.assign(
    {
      mode: 'none',
      entry: {
        main: './src/index'
      },
      output: {},
      optimization: {
        namedModules: true,
        splitChunks: {
          cacheGroups: {
            webcomponents: {
              test: /[\\/]node_modules[\\/](@webcomponents)/,
              chunks: 'all'
            }
          }
        }
      },
      module: {
        rules: [
          {
            test: /\.(sa|sc|c)ss$/,
            use: [
              devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
              'css-loader',
              'postcss-loader',
              'sass-loader'
            ]
          }
        ]
      },
      resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
          '@': resolve('src')
        }
      },
      plugins: []
    },
    _config().webpack
  )
}

let myplugin =  new MyPlugin({})

let app1config = baseConfig()
app1config.output.filename = 'main.js'
app1config.module.rules.push({
  test: /\.m?js$/,
  exclude: /node_modules\/(?!(@polymer)\/).*/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: 'IE > 10',
            exclude: ['transform-classes']
          }
        ]
      ],
      plugins: []
    }
  }
})
app1config.plugins = app1config.plugins.concat([
  new HtmlWebpackPlugin({
    template: './src/index.ejs',
    inject: false,
    hash: true
  }),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: '[name].css',
    chunkFilename: '[id].css'
  }),
  myplugin
])

let app2config = baseConfig()
app2config.output.filename = 'main.loose.js'
app2config.module.rules.push({
  test: /\.m?js$/,
  exclude: /node_modules\/(?!(@polymer)\/).*/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: 'IE > 10'
          }
        ]
      ],
      plugins: []
    }
  }
})
app2config.plugins = app2config.plugins.concat([
  new HtmlWebpackPlugin({
    template: './src/index.ejs',
    inject: false,
    hash: true
  }),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: '[name].css',
    chunkFilename: '[id].css'
  }),
  myplugin
])

module.exports = [app1config, app2config]
