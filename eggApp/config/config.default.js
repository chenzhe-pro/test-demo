'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1505962172472_9751';
  // 暂时先禁用安全选项
  config.security = {
    csrf: {
      enable: false,
    },
  };
  // add your config here
  config.middleware = ['loginValidate'];
  config.loginValidate={
    ignore (ctx) {
      // 忽略登录登出接口验证
      const reg = /login/i;
      return reg.test(ctx.url);
    },
    enable:false
  };
  config.http={
    baseUrl:'http://www.fz-ark.com/facade-web'
  };
  config.view = {
    mapping: {
      '.ejs': 'ejs',
    },
    defaultExtension:'.ejs'
  };
  config.session = {
    key: 'EGG_CY_SESS',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: true,
  };

  return config;
};
