<!— ***模板  Created by limin on 2017/9/18—>
<template>
    <div class="stationSet childTable examine verify">
      <div class="left_content" style="padding:0;width: 300px;border: 0;border-right:1px solid #D9D9D9;height: 100%;margin-bottom: 0;background-color: #fff;">
      <p style="color:#4C5C6F;font-weight: bold;" class="f16 mb10 mt20 ml20">待评分详情</p>
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <el-menu-item index="1">
            <img src="../../assets/img/avatar.png"  style="display: inline-block;width: 40px; height: 40px;position: absolute;border-radius:50%; "/>
            <div class="pl50">
              <p class="active_text">2017年01月周峰考核表</p>
              <div class="mt10 mb10">
                <span class="gray-text">提交人：</span>
                <span class="active_text">周峰</span>
              </div>
              <div class="mt10">
                <span class="gray-text">提交时间：</span>
                <span class="active_text">2017-07-08</span>
              </div>
            </div>
          </el-menu-item>
          <el-menu-item index="2">
            <img src="../../assets/img/avatar.png"  style="display: inline-block;width: 40px; height: 40px;position: absolute;border-radius:50%; "/>
            <div class="pl50">
              <p class="active_text">2017年01月周峰考核表</p>
              <div class="mt10 mb10">
                <span class="gray-text">提交人：</span>
                <span class="active_text">周峰</span>
              </div>
              <div class="mt10">
                <span class="gray-text">提交时间：</span>
                <span class="active_text">2017-07-08</span>
              </div>
            </div>
          </el-menu-item>
          <el-menu-item index="3">
            <img src="../../assets/img/avatar.png"  style="display: inline-block;width: 40px; height: 40px;position: absolute;border-radius:50%; "/>
            <div class="pl50">
              <p class="active_text">2017年01月周峰考核表</p>
              <div class="mt10 mb10">
                <span class="gray-text">提交人：</span>
                <span class="active_text">周峰</span>
              </div>
              <div class="mt10">
                <span class="gray-text">提交时间：</span>
                <span class="active_text">2017-07-08</span>
              </div>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="right_side">
        <div class="right_inside">
          <span style="color:#4C5C6F;font-weight: bold;" class="f16 mb20">2017年01月周峰考核表</span>
          <span class="return_btn mr40" @click="return_last"><i class="fa fa-arrow-circle-left fa-lg "></i> 返回上一级</span>
          <div class="plan_map examine_map mt20" style="width: 100%">
            <div class="kpi_box clearfix " style="position: relative;">
              <div style="">
                <el-table class=" fl" height="100%" :data="tableGS" border>
                  <el-table-column prop="name" align="center" label="工作目标" width="250"></el-table-column>
                  <el-table-column prop="weight" align="center" label="权重" width="100"></el-table-column>
                  <el-table-column prop="finishTime" align="center" label="完成日期" width="200"></el-table-column>
                  <el-table-column prop="scoreStandard" align="center" label="评分标准" min-width="300"></el-table-column>
                  <el-table-column prop="finishState" align="center" label="完成情况" min-width="300"></el-table-column>
                  <el-table-column prop="scorePerson" align="center" label="评分人" min-width="120"></el-table-column>
                  <el-table-column prop="score" align="center" label="评分" min-width="120">
                    <template scope="scope">
                      <!--<el-button type="text" style="color: #999;">查看附件</el-button>-->
                      <span @click="show_modal=true" class="blue_btn">评分</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-dialog v-model="show_modal" size="tiny">
        <span slot="title">
          <span style="font-weight: bold">填报实际值</span>
        </span>
        <div class="dialog_title_line"></div>
        <div class="mt10 mb10">
          <span class="gray-text">工作目标：</span>
          <span class="">确定5家新的合格供应商</span>
        </div>
        <div class="mt10 mb10">
          <span class="gray-text">权&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;重：</span>
          <span class="">50%</span>
        </div>
        <div class="mt10 mb10">
          <span class="gray-text">完成日期：</span>
          <span class="">2017-09-08</span>
        </div>
        <div class="mt10 mb10">
          <span class="gray-text">评分标准：</span>
          <span class="">2017-09-08</span>
        </div>
        <div class="mt10 mb10">
          <span class="gray-text">完成描述：</span>
          <span class="">2017-09-08</span>
        </div>
        <div class="mt10 mb20 pb20" style="border-bottom: 1px solid #D9D9D9">
          <span class="gray-text">证明材料：</span>
          <span class="">产品合格数/产品总数*100%</span>
        </div>
        <el-form ref="form" :model="form" :rules="rules"  label-width="76px" label-position="right">
          <el-form-item label="评分：" prop="score">
            <el-input v-model="form.score"  placeholder="请输入评分"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <div class="btns clearfix" style="width: 260px;margin:0 auto 20px">
            <div class="btn btn-light fl" @click="show_modal=false">取消</div>
            <div class="btn btn-primary fr" @click="">确定</div>
          </div>
        </div>
      </el-dialog>
    </div>
</template>
<script>
    module.exports = {
      data: function () {
        return {
          form:{
            score:''
          },
          show_modal:false,
          tableGS: [
            {
              name:'111',
              weight:'78',
              finishTime:'2017-09-07',

            }
          ],//表格
        }
      },
      methods: {
        init: function () {
          var _com = this;
          var h = $('.kpi_box').height();
          var s = h - 40;
          $('.kpi_weight').eq(0).find('div').css('height', s + 'px');
          $('.kpi_weight').eq(0).find('div').css('line-height', s + 'px');
          $('.kpi_weight').eq(1).find('div').css('height', h + 'px');
          $('.kpi_weight').eq(1).find('div').css('line-height', h + 'px');
        },
        return_last: function () {
          this.$emit('getstep', 1)
        },
      },
      mounted: function () {
        this.$nextTick(function () {
          quicker.returnTop();
          this.init();
        })
      }
    }
</script>
<style lang='scss'>

</style>
