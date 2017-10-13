/**
 * Created by chenzhe on 17/9/22.
 */
module.exports = app => {
    class listController extends app.Controller {
        * index() {
            const result = yield this.ctx.curl(this.app.config.http.baseUrl+'/course/list-complex?timeseq=1503652514007&csrfKey=undefined', {
                // 必须指定 method
                method: 'GET',
                // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
                data: {
                    tag: '1001',
                    now: Date.now(),
                    name:'',
                    'pagination.currentPage':1,
                    'pagination.pageSize':10
                },
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
            });
            // 转发后台接口返回值
            // this.ctx.body = {
            //     status: result.status,
            //     headers: result.headers,
            //     data: result.data,
            // };
            // 服务器端渲染
            yield this.ctx.render('list',{asset_config:this.app.config.asset,list:result.data.obj.datas,userInfo:this.ctx.session.userId});
        }
    }
    return listController;
};