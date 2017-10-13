/**
 * Created by chenzhe on 17/9/22.
 */
module.exports = app => {
    class listController extends app.Controller {
        * index() {
            this.ctx.session=null;
            yield this.ctx.render('list',{name:'退出成功!'});
        }
    }
    return listController;
};