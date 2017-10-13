var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // eval-source-map is faster for development
  devtool: '#cheap-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // new webpack.ProvidePlugin({
    //   $: "jquery",
    //   lrz:'lrz',
    //   laypage:'laypage',
    //   quicker:'quicker'
    // }),
    // https://github.com/ampedandwired/html-webpack-plugin
    new webpack.optimize.CommonsChunkPlugin({name:'vendor', filename:'vendor.build.js'}),//chenzhe_ps:CommonsChunkPlugin是公共块插件,生成了公共文件
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      chunks:['index','vendor']
    }),
    new HtmlWebpackPlugin({
      filename: 'login.html',
      template: 'login.html',
      inject: true,
      chunks:['login','vendor']
    })
  ]
})
