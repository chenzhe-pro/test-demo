<!— ***模板  Created by limin on 2017/7/14—>
<template>
    <div class="ranking">
      <el-table border :data="rankTable" style="width: 100%">
        <el-table-column prop="number" align="center" label="序号" >
        </el-table-column>
        <el-table-column prop="realName" align="center" label="员工姓名">
        </el-table-column>
        <el-table-column prop="jobNumber" align="center" label="工号">
        </el-table-column>
        <el-table-column prop="departmentName" align="center" label="部门">
        </el-table-column>
        <el-table-column prop="positionName" align="center" label="岗位">
        </el-table-column>
        <el-table-column prop="score" align="center" label="得分">
        </el-table-column>
      </el-table>
    </div>
</template>
<script>
    module.exports = {
      data: function () {
        return {
        }
      },
      props: ['rankTable'],
      methods:{
//        init:function () {
//          console.log(43523)
//          this.$nextTick(function () {
//            var RL=$('.right_line')[0].clientHeight;
//            var H=$('.right_table')[0].clientHeight;
//            H=H>RL?H:RL;
//            $('.right_table').css('height',H);
//          })
//
//        }
      },
      mounted:function () {
//        this.init();
        this.$nextTick(function () {
          quicker.returnTop();
        })
      }
    }
</script>
<style lang='scss'>

</style>
