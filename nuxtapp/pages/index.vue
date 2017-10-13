<template>
  <section class="container index">
    <div>
      <span @click="test">{{title}}</span>
      <logo/>
      <h1 class="title">
        nuxtapp
      </h1>
      <h2 class="subtitle">
        Nuxt.js project
      </h2>
      <div class="links">
        <a href="https://nuxtjs.org/" target="_blank" class="button--green">Documentation</a>
        <a href="https://github.com/nuxt/nuxt.js" target="_blank" class="button--grey">GitHub</a>
      </div>
    </div>
  </section>
</template>

<script>
  import axios from 'axios'
  import Logo from '~/components/Logo.vue'

  export default {
    data :function(){
      return{
        title: '新闻列表'
      }
    },
    head :function() {
      return {
        title: '首页',
        meta: [
          { hid: 'description', name: 'description', content: 'My custom description' },
          { hid: 'description', name: 'keyword', content: 'My custom description' }
        ],
//        link: [
//          { rel: 'stylesheet', href: '//cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css' }
//        ],
//        script:[
//          {src:"http://static.fz-ark.com/resource-common/jquery-1.11.1.min.js"}
//        ]
      }
    },
    components: {
      Logo
    },
    methods:{
      test:function(){
        alert(1);
        axios.get('http://kpid.fz-ark.com/api/sys/help/detail/pageName/ads').then(function (response) {
          console.log(response);
        })
      }
    }
  }
</script>

<style>
.container
{
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.title
{
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
.subtitle
{
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.links
{
  padding-top: 15px;
}
</style>
