'use strict';

module.exports = app => {
  app.get('/', 'home.index');
  app.post('/upload', 'home.upload');
  // app.get('/list', 'list.index');
  // app.get('/node_api/login', 'login.index');
  // app.get('/node_api/loginOut', 'loginOut.index');
};
