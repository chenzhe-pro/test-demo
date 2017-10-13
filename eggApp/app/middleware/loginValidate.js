/**
 * Created by chenzhe on 17/9/24.
 */
module.exports = (options,app) => {
    return function* loginValidate(next) {
        yield next;

        if(!this.session.userId)
        {

            this.body='未登录'
        }
        console.log(this.session.userId);
    };
};
