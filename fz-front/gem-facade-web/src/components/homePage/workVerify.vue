<!— ***模板  Created by limin on 2017/9/18—>
<template>
    <div class="stationSet childTable verify">
      <div class="left_content" style="padding:0;width: 300px;border: 0;border-right:1px solid #D9D9D9;height: 100%;margin-bottom: 0;background-color: #fff;">
      <p style="color:#4C5C6F;font-weight: bold;" class="f16 mb10 mt20 ml20">待审批详情</p>
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <el-menu-item index="1">
            <img src="../../assets/img/avatar.png"  style="display: inline-block;width: 40px; height: 40px;position: absolute;border-radius:50%; "/>
            <div class="pl50">
              <p class="active_text">2017年01月周峰工作计划表</p>
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
              <p class="active_text">2017年01月周峰工作计划表</p>
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
              <p class="active_text">2017年01月周峰工作计划表</p>
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
          <span style="color:#4C5C6F;font-weight: bold;" class="f16 mb20">2017年01月周峰工作计划表</span>
          <span class="return_btn mr40" @click="return_last"><i class="fa fa-arrow-circle-left fa-lg "></i> 返回上一级</span>
          <el-table class="plan_map mt20" height="100%" :data="tableData" border style="width: 100%;">
            <el-table-column prop="typeText" align="center" label="事项类型" width="140"></el-table-column>
            <el-table-column prop="objectiveFormDetailValueText" align="center" label="目标" width="150">
              <template scope="scope">
                <div class="ml10 mr10" v-text="scope.row.objectiveFormDetailValueText"></div>
              </template>
            </el-table-column>
            <el-table-column prop="indicatorMethodSelectedName" align="center" label="策略" width="200">
              <template scope="scope">
                <div class="ml10 mr10" v-text="scope.row.indicatorMethodSelectedName"></div>
              </template>
            </el-table-column>
            <el-table-column prop="name" align="center" label="计划事项" width="200">
              <template scope="scope">
                <div class="ml10 mr10" v-text="scope.row.name"></div>
              </template>
            </el-table-column>
            <el-table-column prop="target" align="center" label="工作目标" width="240">
              <template scope="scope">
                <div class="ml10 mr10" v-text="scope.row.target"></div>
              </template>
            </el-table-column>
            <el-table-column prop="GS" align="center" label="是否列入GS" width="120">
              <template scope="scope">
                <div v-html="scope.row.GS"></div>
              </template>
            </el-table-column>
            <el-table-column prop="planSteps" align="center" label="计划内容" width="300">
              <template scope="scope">
                <div class="p10 borderDiv" style="text-align: left;" v-for="(item ,index) in scope.row.planSteps" v-text="index+1+'、'+item.content"></div>
              </template>
            </el-table-column>
            <el-table-column prop="planSteps" align="center" label="完成时间节点" width="150">
              <template scope="scope">
                <div class="p10 borderDiv" v-for="(item ,index) in scope.row.planSteps">{{item.endTime | short_time}}</div>
              </template>
            </el-table-column>
          </el-table>
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
                <p>周峰 <span class="fr blue_text">审核中</span></p>
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
          tableData: [],//表格
        }
      },
      methods: {
        return_last: function () {
          this.$emit('getstep', 1)
        },
      },
    }
</script>
<style lang='scss'>

</style>
