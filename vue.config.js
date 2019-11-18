const path = require('path')

module.exports = {
  configureWebpack: {
    mode: 'production',
    devtool: false,

    optimization: {
      minimize: true
    },

    resolve: {
      alias: {
        '@': path.resolve('.')
      }
    },

    module: {
      rules: [
        {
          test: /\.txt$/,
          use: ['raw-loader']
        }
      ]
    }
  }
}