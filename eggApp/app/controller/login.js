/**
 * Created by chenzhe on 17/9/22.
 */
module.exports = app => {
    class listController extends app.Controller {
        * index() {
            if(this.login())
            {
                this.ctx.session.userId=this.ctx.query.id;
                this.ctx.body='登录成功,'+this.ctx.session.userId;
            }
        }
        login() {
             return true
        }
    }
    return listController;
};