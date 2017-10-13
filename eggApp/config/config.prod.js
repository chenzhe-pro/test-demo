'use strict';
// 生产环境配置文件
module.exports = appInfo => {
  const config = exports = {};

  config.asset={
    path:'dist'
  };
  return config;
};
