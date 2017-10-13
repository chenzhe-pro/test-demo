<!-- ***模板  Created by chenzhe on 17/8/25-->
<template>
    <div class="list">
      <div id="container" style="min-width:400px;height:400px"></div>
      <p>商品列表{{age}}</p>
      <ul>
        <li v-for="x in proList" class=""><nuxt-link :to="'/product/'+x.course.id">{{x.course.name}}</nuxt-link></li>
      </ul>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
      </el-table>
      <el-input v-model="name" placeholder="请输入内容"></el-input>
      <el-dialog title="收货地址" :visible.sync="dialogTableVisible">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址">
          </el-table-column>
        </el-table>
      </el-dialog>
      <div class="img"></div>
    </div>
</template>
<script>
  import common from '../../plugins/common'

  export default {
    data:function () {
      return{
//        proList:[]
        name:'1',
        dialogTableVisible:true,
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    asyncData:function () {
      console.log(2);
      return common.axios.get('/course/list-complex?timeseq=1503652514007&csrfKey=undefined&tag=1001&name=&pagination.currentPage=1&pagination.pageSize=10')
        .then(function(data) {
//          data=data.data;
          console.log(2.1);
          return { proList: data.obj.datas ,age:11};
        });
    },
    head :function() {
      return {
        title: '商品列表',
        meta: [
          { hid: 'description', name: 'description', content: 'My custom description' },
          { hid: 'description', name: 'keyword', content: 'My custom description说的是' }
        ],
        script :[
//          {src:'//cdn.hcharts.cn/highmaps/highcharts.js'}
        ]
      }
    },
    methods:{
      click:function (name) {
        alert(name);
        window.location.href=''
      }
    },
    //
    mounted:function () {
      this.$nextTick(function () {
        console.log(1123);
        $('ul li').addClass('a').append('<p>ceshi</p>');
        var chart = new Highcharts.Chart('container', {
          title: {
            text: '不同城市的月平均气温',
            x: -20
          },
          subtitle: {
            text: '数据来源: WorldClimate.com',
            x: -20
          },
          xAxis: {
            categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
          },
          yAxis: {
            title: {
              text: '温度 (°C)'
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }]
          },
          tooltip: {
            valueSuffix: '°C'
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
          },
          series: [{
            name: '东京',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
          }, {
            name: '纽约',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
          }, {
            name: '柏林',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
          }, {
            name: '伦敦',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
          }]
        });
      })
    }
  }
</script>
<style >

</style>
