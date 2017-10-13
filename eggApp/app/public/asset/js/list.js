/**
 * Created by chenzhe on 17/9/25.
 */
// window.onload=function () {
//     alert(1111)
// };
var vm=new Vue({
    el: '#app',
    data:{
        name:'萨达萨达萨达撒',
        a:1231231
    },
    methods:{
        click:function (name) {
            alert(name)
        }
    }
});