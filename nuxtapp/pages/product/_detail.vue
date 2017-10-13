<!-- ***模板  Created by chenzhe on 17/8/28-->
<template>
    <div>
      <p>商品详情:</p>
      <span>商品id:{{course.name}}</span>
      {{course.briefIntroduce}}
      <img src="~assets/img/login_bg.jpg" alt="">
    </div>
</template>
<script>
  import common from '../../plugins/common'
  export default {
    data:function () {
      return{
//        id:args.params.detail
      }
    },
    asyncData:function (args) {
      var detail_id=args.params.detail;
      console.log("id:"+args.params.detail);
//      debugger;
      return common.axios.get('/course/detail/'+detail_id)
        .then(function(data) {
//          data=data.data;
          if(data.obj.course)
            return { course:data.obj.course ,age:11};
            else return { course:{} ,age:11}
        })
    },
    head :function() {
      return {
        title: this.course.name,
        meta: [
          { hid: 'description', name: 'description', content: 'My custom description' },
          { hid: 'description', name: 'keyword', content: 'My custom description说的是' }
        ]
      }
    },
    methods:{
      getDetail:function () {

      }
    }
  }
</script>
<style >

</style>
