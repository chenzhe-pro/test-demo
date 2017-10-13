var path = require('path')
var config = require('../config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')

module.exports = {
  entry: {
    index: './src/index.js',
    login:'./src/login.js',
    vendor:['vue']
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'vue$': 'vue/dist/vue',
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components'),

      // 'jquery': path.resolve(__dirname, '../plugins/jQuery/jquery-2.2.3.min.js')
    }
  },
  externals:{
    'jquery':'window.$',
    // 'vue':'window.Vue'
    // 'lrz':'lrz',
    // 'laypage':'laypage',
    // 'quicker':'quicker',
    // 'WebUploader':'WebUploader'
  },//chenzhe_ps:配置 externals 来将依赖的库指向全局变量，从而不再打包这个库;这种方式适用所有插件和库,但对于未做amd兼容的插件和库或者没有module.exports导出的代码,只能使用这只方式。
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 1000,
          name:  utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      // {
      //   test: path.resolve(__dirname, '../plugins/jQuery/jquery-2.2.3.min.js'),
      //   loader: 'expose?jQuery!expose?$' // 将jquery绑定为window.jQuery 和 window.$
      // }
    ]
  },
  vue: {
    loaders: utils.cssLoaders(),
    postcss: [//自动补全vue文件中的样式
      require('autoprefixer')({
        browsers: ['last 15 versions']
      })
    ]
  },
  postcss: function () {
    return [require('autoprefixer')({
      browsers: ['last 15 versions']
    })];
  }
  // ,
  // postcss: [//chenzhe_ps:
  //   require('autoprefixer')({
  //     browsers: ['last 15 versions']
  //   })
  // ]
}
