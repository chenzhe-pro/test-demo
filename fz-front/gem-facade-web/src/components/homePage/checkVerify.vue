<!— ***模板  Created by limin on 2017/9/18—>
<template>
    <div class="stationSet childTable examine verify">
      <div class="left_content" style="padding:0;width: 300px;border: 0;border-right:1px solid #D9D9D9;height: 100%;margin-bottom: 0;background-color: #fff;">
      <p style="color:#4C5C6F;font-weight: bold;" class="f16 mb10 mt20 ml20">待审批详情</p>
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
              <div class="kpi_left" style="">
                <div class="table_title">
                  <div class="fl" style="color: #999;">考核目标</div>
                  <div class="fl" style="color: #999;">权重</div>
                </div>
                <div class="table_title kpi_weight">
                  <div class="fl">
                    KPI
                  </div>
                  <div class="fl">60%</div>
                </div>
              </div>
              <div style="padding-left: 219px">
                <el-table class="fl" height="100%" :data="tableKPI" border >
                  <el-table-column prop="name" align="center" label="指标名称" width="250"></el-table-column>
                  <el-table-column prop="weight" align="center" label="权重" width="100"></el-table-column>
                  <el-table-column prop="targetValue" align="center" label="目标值" width="100"></el-table-column>
                  <el-table-column prop="challengeValue" align="center" label="挑战值" width="100"></el-table-column>
                  <el-table-column prop="scoreType" align="center" label="评分标准" min-width="300"></el-table-column>
                </el-table>
              </div>

            </div>
            <div class="kpi_box clearfix " style="position: relative;">
              <div class="kpi_left" style="">
                <div class="table_title kpi_weight">
                  <div class="fl">GS</div>
                  <div class="fl">40%</div>
                </div>
              </div>
              <div style="padding-left: 219px">
                <el-table class=" fl" height="100%" :data="tableGS" border>
                  <el-table-column prop="name" align="center" label="指标名称" width="250"></el-table-column>
                  <el-table-column prop="weight" align="center" label="权重" width="100"></el-table-column>
                  <el-table-column prop="finishTime" align="center" label="完成时间" width="200"></el-table-column>
                  <el-table-column prop="target" align="center" label="考核目标" min-width="300"></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <p style="color:#4C5C6F;font-weight: bold;" class="f16 mb20 mt30">审批进展情况</p>
          <div class="process clearfix">
            <div class="mr20">
              <img src="../../assets/img/avatar.png"  style="display: inline-block;width: 40px; height: 40px;position: absolute;border-radius:50%; "/>
              <div class="pl50 mb15">
                <p>周峰 <span class="fr blue_text">发起申请</span></p>
                <p>总经理</p>
              </div>
              <p class="gray-text mb10">申请留言：暂无</p>
              <p class="gray-text">申请时间：2017-06-25 17：44</p>
            </div>
            <p style="display: inline-block;position: absolute;top:70px;"><i class="fa fa-lg fa-arrow-right" aria-hidden="true"></i></p>
            <div class="ml40">
              <img src="../../assets/img/avatar.png"  style="display: inline-block;width: 40px; height: 40px;position: absolute;border-radius:50%; "/>
              <div class="pl50 mb5">
                <p>周峰 <span class="fr blue_text">审批中</span></p>
                <p>总经理</p>
              </div>
              <el-input type="textarea" v-model="input" placeholder=""></el-input>
              <div class="btns clearfix" style="width: 180px;margin:10px auto 0">
                <div class="btn btn-light fl" style="width: 82px;height: 28px;line-height: 28px;" @click="">不同意</div>
                <div class="btn btn-primary fr" style="width: 82px;height: 28px;line-height: 28px;" @click="">同意</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
    module.exports = {
      data: function () {
        return {
          tableKPI: [],//表格
          tableGS: [],//表格
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
