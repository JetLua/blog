const
  os = require('os'),
  path = require('path'),
  webpack = require('webpack'),
  {VueLoaderPlugin} = require('vue-loader'),
  HtmlWebpackPlugin = require('html-webpack-plugin')


const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: [
    'bootstrap/dist/css/bootstrap.min.css',
    'prismjs/themes/prism.css',
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

  devServer: {
    hot: true,
    host: '0.0.0.0',
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
        // exclude: /node_modules/,
        use: ['vue-style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'less-loader']
      },
      {
        test: /\.txt$/,
        use: ['raw-loader']
      },
      {
        test: /\.(jpg|png|jpeg|gif|svg)$/,
        use: ['url-loader']
      }
    ]
  },

  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },

  plugins: [
    new VueLoaderPlugin(),

    new webpack.ProvidePlugin({
      Prism: 'prismjs',
      Router: ['vue-router', 'default'],
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