module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'nuxtapp',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '//cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css' }
    ],
    // link: [
    //   { rel: 'stylesheet', href: '//cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css' }
    // ],
    script:[
      {src:"http://static.fz-ark.com/resource-common/jquery-1.11.1.min.js"},
      {src:'//cdn.hcharts.cn/highmaps/highcharts.js'}
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  router: {
    middleware: 'getData'//路由每次切换时调用中间件,中间件运行在一个页面或一组页面渲染之前
  },
  /*
  ** 添加css资源
   */
  css: [
    // 项目中的 CSS 文件
    'element-ui/lib/theme-default/index.css',
    // 项目中的 Sass 文件
    { src: '~assets/scss/index.scss', lang: 'scss' } // 指定 scss 而非 sass
  ],
  plugins: [{src:'~plugins/element-ui'}],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLINT on save
    */
    // extend (config, ctx) {
    //   if (ctx.dev && ctx.isClient) {
    //     config.module.rules.push({
    //       enforce: 'pre',
    //       test: /\.(js|vue)$/,
    //       loader: 'eslint-loader',
    //       exclude: /(node_modules)/
    //     })
    //   }
    // }
    extend (config, ctx) {
      // console.log(config);
      // config.externals = {
      //   jquery: 'jQuery'
      // };
      // console.log(config);
    },
    vendor: ['axios'],
    publicPath:'/',
    extractCSS:true
  },
  babel: {
    plugins: [['component', [{
      libraryName: 'element-ui',
      styleLibraryName: 'theme-default'
    }]]]
  }
}
