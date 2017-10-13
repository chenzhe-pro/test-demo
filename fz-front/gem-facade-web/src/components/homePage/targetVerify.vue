<!— ***模板  Created by limin on 2017/9/18—>
<template>
    <div class="stationSet childTable verify">
      <div class="left_content" style="padding:0;width: 300px;border: 0;border-right:1px solid #D9D9D9;height: 100%;margin-bottom: 0;background-color: #fff;">
        <p style="color:#4C5C6F;font-weight: bold;" class="f16 mb10 mt20 ml20">待审批详情</p>
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <el-menu-item index="1">
            <img src="../../assets/img/avatar.png"  style="display: inline-block;width: 40px; height: 40px;position: absolute;border-radius:50%; "/>
            <div class="pl50">
              <p class="active_text">2017年01月周峰工作目标</p>
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
              <p class="active_text">2017年01月周峰工作目标</p>
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
              <p class="active_text">2017年01月周峰工作目标</p>
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
          <p class="mb20">
            <span style="color:#4C5C6F;font-weight: bold;" class="f16 mb20">2017年01月周峰工作目标</span>
            <span class="return_btn mr40" @click="return_last"><i class="fa fa-arrow-circle-left fa-lg "></i> 返回上一级</span>
          </p>
          <indicator_box v-for="item in indicatorCheckedList" :btn-show="false" :item="item"></indicator_box>
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
  import indicator_box from  '../target/indicator.vue'
    module.exports = {
      data: function () {
        return {
          indicatorCheckedList: [
            {
              id: 'sjfmvka94iriuudsshs',
              name: '已选指标1',
              label: '财务',
              miaoshu: '这里是场景描述',
              area: '利润增长',
              description: '指在利润总额中按规定缴纳了所得税后公司的利润留成',
              expression: '总利润 - 所得税',
              spread: false,
              isShangji: true,
              goal: '56.00%',
              challenge: '88.00%',
            },
            {
              id: 'syatxkv94iriusdsshs',
              name: '已选指标2',
              label: '财务',
              miaoshu: '这里是场景描述',
              area: '利润增长',
              description: '指在利润总额中按规定缴纳了所得税后公司的利润留成;指在利润总额中按规定缴纳了所得税后公司的利润留成指在利润总额中按规定缴纳了所得税后公司的利润留成指在利润总额中按规定缴纳了所得税后公司的利润留成指在利润总额中按规定缴纳了所得税后公司的利润留成指在利润总额中按规定缴纳了所得税后公司的利润留成',
              expression: '总利润 - 所得税',
              spread: false,
              isShangji: true,
              goal: '46.00%',
              challenge: '58.00%',
            },
          ],//已选择指标
        }
      },
      methods: {
        return_last: function () {
          this.$emit('getstep', 1)
        },
      },
      components: {
        'indicator_box': indicator_box,
      }
    }
</script>
<style lang='scss'>

</style>
