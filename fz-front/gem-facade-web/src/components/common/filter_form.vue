<template>
  <div class="filter_form">
    <div class="filter_title clearfix">
      <span class="filter_header">筛选器</span>
      <span class="return_right" @click="close_slide()">
        <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
      </span>
    </div>
    <el-form ref="filter_form" label-width="80px" :model="filterForm">
      <el-form-item v-for="(value, key) in filterForm" :label="value.fieldText" >
        <el-input v-model="filter[key]" v-if="value.type==='String'"></el-input>
        <el-input v-model.number="filter[key]" v-if="value.type==='Integer'"></el-input>
        <el-date-picker  v-model="filter[key]" placeholder="选择日期" v-if="value.type==='date'" style="width: 100%;"></el-date-picker>
        <el-select v-model="filter[key]" :placeholder="'选择'+value.fieldText" v-if="value.type==='Enum'">
          <el-option v-for="(value_,key_) in value.value" :label="value_" :value="key_"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="clearForm">
          清 空
        </el-button>
        <el-button size="small" @click="filterFunction(filter)">
          确 定
        </el-button>
      </el-form-item>
    </el-form>
    <!--<slot name="filter_box"></slot>-->
  </div>

</template>
<script>
    module.exports = {
      data:function () {
        return {
          filterForm:{//模型里的value不是请求的值
          },
          filter:{}//根据表单模型生成的过滤器模型
        }
      },
      methods:{
        close_slide:function () {
          common.closeFilter();
        },
        clearForm:function () {
          for(var key in this.filter){
            this.filter[key]=null;
          }
          this.filterFunction(this.filter);
        },
        changeValue:function () {
//          this.$emit('changeVal');
        },
        getFormModel:function () {
          var _com=this;
          this.$http.get(this.modelUrl, {})
            .then(function (data) {
              data = data.body;
              if (data.code=='SUCCESS') {
                _com.filterForm=data.data;
                for(var key in _com.filterForm)
                {
                  _com.$set(_com.filter,key,null);
                }
              } else {
                _com.$message.error(data.message);
              }

            })
        }
      },
      props: ['modelUrl','filterFunction'],
      mounted:function () {
        this.getFormModel();
      }
    }
</script>
