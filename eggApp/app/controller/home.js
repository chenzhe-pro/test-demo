'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    * index() {
      // this.ctx.body = 'hi, egg'+this.ctx.query.id+this.app.config.keys;
      yield this.ctx.render('index', {
        config: this.app.config,
        ctx: this.ctx,
      });
    }
    * upload() {
      // const sendToWormhole = require('stream-wormhole');
      const ctx = this.ctx;
      const parts = ctx.multipart();
      let part,arr=[];
      while ((part = yield parts) != null) {
        if (part.length) {
          // 如果是数组的话是 filed
          console.log('field: ' + part[0]);
          console.log('value: ' + part[1]);
          console.log('valueTruncated: ' + part[2]);
          console.log('fieldnameTruncated: ' + part[3]);
        } else {
          if (!part.filename) {
            // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
            // 需要做出处理，例如给出错误提示消息
            return;
          }
          // part 是上传的文件流
          console.log('field: ' + part.fieldname);
          console.log('filename: ' + part.filename);
          console.log('encoding: ' + part.encoding);
          console.log('mime: ' + part.mime);
          arr.push(part.filename);
        }
      }
      this.ctx.body = {filename: arr};
    }
  }
  return HomeController;
};
