const
  os = require('os'),
  path = require('path'),
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin')


const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: [
    './src/app.js',
    './src/style.less'
  ],

  output: {
    path: path.resolve('dist'),
    filename: 'app.js'
  },

  resolve: {
    alias: {
      '@': path.resolve('.')
    }
  },

  devtool: isProd ? false : 'source-map',

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      PIXI: 'pixi.js',
      Vue: ['vue/dist/vue.esm.js', 'default'],
    }),

    new HtmlWebpackPlugin({
      template: './src/layout.html',
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true
      }
    })
  ],

  mode: isProd ? 'production' : 'development'
}