<!--任务管理组件-->
<template>
  <div class="wrapper task" v-loading.fullscreen="pageLoading">
    <page-head></page-head>
    <div class="content_wrapper">
      <content_head show-menu="true"></content_head>
      <div class="content_content">
        <div class="">
          <p class="set_title">任务列表
            <a href="javascript:;" class="fr addTask add_icon" @click="show_add_modal=true;" v-if="!isBottom"><img src="../../assets/img/plus.png" class="" alt="">新增任务</a>
          </p>
          <div class="set_content task_list">
            <ul class="clearfix">
              <li>
                <p class="list_title"><span >任务池</span></p>
                <div class="task_node" v-for="x in taskStore" @click="openTask(x)">
                  <div class="task_type clearfix">
                    <span class="vertical_bar animated" :class="[x.important]"></span><span v-text="x.typeText">日清表</span>
                  </div>
                  <div class="task_content">
                    <div class="task_des" v-text="x.description">日清表adsas</div>
                    <div class="task_man clearfix">
                      <p class="fl">发布人：<span>{{x.releaseMan.realName|null_to_text('暂无')}}</span></p>
                      <p class="fr" >责任人：<span>{{x.liabilityManView.realName|null_to_text('暂无')}}</span></p>
                      <!--任务类型为事项或者填报则显示转发人-->
                      <!--<p class="fl" >转发人：<span>{{x.forwardMan|null_to_text('暂无')}}</span></p>-->
                    </div>
                    <div class="task_time">
                      <img src="../../assets/img/time.svg" alt="">
                      <span>{{x.completeTime|null_to_text('暂无完成时间')}}</span>
                      <span class="fr" :class="{task_uncompleted:x.status==='unover',task_completed:x.status==='over',task_delay:x.status==='delay'}">{{x.statusText}}</span>
                    </div>
                  </div>
                </div>
                <p class="no_data_tip" v-if="taskStore.length===0">暂无任务</p>
                <a href="javascript:;" class="load_more" @click="getTaskStore" v-show="taskStoreLoadMore">加载更多任务</a>
              </li>
              <li>
                <p class="list_title clearfix">
                  <span class="fl">我的任务</span>
                  <el-select v-model="myTaskFilter" @change="init" placeholder="全部" size="mini" style="width: 33%;float: right;margin-top: 2px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="已完成" value="over"></el-option>
                    <el-option label="待完成" value="unover"></el-option>
                  </el-select>
                </p>
                <div class="task_node" v-for="x in myTask" @click="openTask(x,1)">
                  <div class="task_type clearfix">
                    <span class="vertical_bar" :class="[x.important]"></span><span v-text="x.typeText">日清表</span>
                  </div>
                  <div class="task_content">
                    <div class="task_des" v-text="x.description">日清表adsas</div>
                    <div class="task_man clearfix">
                      <p class="fl">发布人：<span>{{x.releaseMan.realName|null_to_text('暂无')}}</span></p>
                      <p class="fr" >责任人：<span>{{x.liabilityManView.realName|null_to_text('暂无')}}</span></p>
                      <!--任务类型为事项或者填报则显示转发人-->
                      <!--<p class="fl" >转发人：<span>{{x.forwardMan|null_to_text('暂无')}}</span></p>-->
                    </div>
                    <div class="task_time">
                      <img src="../../assets/img/time.svg" alt="">
                      <span>{{x.completeTime|null_to_text('暂无完成时间')}}</span>
                      <span class="fr" :class="{task_uncompleted:x.status==='unover',task_completed:x.status==='over',task_delay:x.status==='delay'}">{{x.statusText}}</span>
                    </div>
                  </div>
                </div>
                <p class="no_data_tip" v-if="myTask.length===0">暂无任务</p>
                <a href="javascript:;" class="load_more" @click="getMyTask" v-show="myTaskLoadMore">加载更多任务</a>
              </li>
              <li>
                <p class="list_title clearfix">
                  <span class="fl">已分配任务</span>
                  <el-select v-model="assignedTaskFilter" @change="init" placeholder="全部" size="mini" style="width: 33%;float: right;margin-top: 2px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="已完成" value="over"></el-option>
                    <el-option label="待完成" value="unover"></el-option>
                  </el-select>
                </p>
                <div class="task_node" v-for="x in assignedTask" @click="openTask(x)">
                  <div class="task_type clearfix">
                    <span class="vertical_bar" :class="[x.important]"></span><span v-text="x.typeText">日清表</span>
                  </div>
                  <div class="task_content">
                    <div class="task_des" v-text="x.description">日清表adsas</div>
                    <div class="task_man clearfix">
                      <p class="fl">发布人：<span>{{x.releaseMan.realName|null_to_text('暂无')}}</span></p>
                      <p class="fr" >责任人：<span>{{x.liabilityManView.realName|null_to_text('暂无')}}</span></p>
                      <!--任务类型为事项或者填报则显示转发人-->
                      <!--<p class="fl" >转发人：<span>{{x.forwardMan|null_to_text('暂无')}}</span></p>-->
                    </div>
                    <div class="task_time">
                      <img src="../../assets/img/time.svg" alt="">
                      <span>{{x.completeTime|null_to_text('暂无完成时间')}}</span>
                      <span class="fr" :class="{task_uncompleted:x.status==='unover',task_completed:x.status==='over',task_delay:x.status==='delay'}">{{x.statusText}}</span>
                    </div>
                  </div>
                </div>
                <p class="no_data_tip" v-if="assignedTask.length===0">暂无任务</p>
                <a href="javascript:;" class="load_more" @click="getAssignedTask" v-show="assignedTaskLoadMore">加载更多任务</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!--添加任务弹窗-->
      <el-dialog v-model="show_add_modal" title="添加任务" size="small" :before-close="beforeClose_add" :close-on-click-modal="false">
        <div class="dialog_title_line"></div>
        <el-form ref="form_add" :model="form_add" :rules="rule_add"  label-width="95px">
          <el-form-item label="任务类型：" prop="type">
            <el-select v-model="form_add.type" placeholder="请选择任务类型">
              <el-option v-for="(value, key) in typeEnum1" :label="value" :value="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述：" prop="description">
            <el-input v-model="form_add.description" type="textarea" :rows="2" placeholder="请输入任务描述" ></el-input>
          </el-form-item>
          <el-form-item label="责任人：" prop="liabilityMan">
            <el-select v-model="form_add.liabilityMan" :remote-method="remoteMethod_sx" filterable remote placeholder="输入工号或姓名搜索" :loading="man_loading">
              <el-option v-for="m in mans" :label="m.realName" :value="m.id" :key="m.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="重要程度：" prop="important">
            <el-radio-group v-model="form_add.important" size="large  ">
              <el-radio v-for="(value, key) in importantEnum" :label="key" >{{value}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="完成时间：" prop="completeTime">
            <el-date-picker v-model="form_add.completeTime" format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择完成时间" ></el-date-picker>
          </el-form-item>
          <el-form-item label="类型相关：" prop="contentType">
            <el-select v-model="form_add.contentType" placeholder="请选择类型相关">
              <el-option v-for="(value, key) in contentTypeEnum" :label="value" :value="key"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <div class="btns clearfix" style="width: 320px;margin: 0px auto">
            <div class="btn btn-light fl" @click="beforeClose_add();show_add_modal=false;">取消</div>
            <div class="btn btn-primary fr" @click="saveTask">保存</div>
          </div>
        </div>
      </el-dialog>
      <!--事项弹窗-->
      <el-dialog v-model="show_sx_modal" :title="sx_modal_type" size="tiny" :before-close="beforeClose_sx" :close-on-click-modal="false">
        <div class="dialog_title_line"></div>
        <el-form ref="form_sx" :model="form_sx" :rules="rule_sx"  label-width="100px">
          <el-form-item label="任务描述：" class="mb0">
            {{currentTask.description}}
          </el-form-item>
          <el-form-item label="发布人：" class="mb0">
            {{currentTask.releaseMan?currentTask.releaseMan.realName:'暂无'}}
          </el-form-item>
          <el-form-item label="任务到期：" class="mb0">
            {{currentTask.completeTime}}
          </el-form-item>
          <el-form-item label="责任人：" class="mb0">
            {{currentTask.liabilityMan}}
          </el-form-item>
          <el-form-item label="转发人：" class="mb0" v-if="currentTask.forwardMan">
            {{currentTask.forwardMan}}
          </el-form-item>
          <!--待完成显示-->
          <div class="" v-if="sx_edit">
            <el-form-item label="类型相关：" prop="contentType">
              <el-select v-model="form_sx.contentType" placeholder="请选择类型相关">
                <el-option v-for="(value, key) in contentTypeEnum" :label="value" :value="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="操作：" prop="status">
              <el-radio-group v-model="form_sx.status" size="large" @change="change_status('form_sx')" >
                <el-radio  label="over" >完成</el-radio>
                <el-radio  label="unover" v-if="!isBottom">指派</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="完成情况：" prop="content" v-if="form_sx.status=='over'" :rules="{required: true, message: '完成情况', trigger: 'blur'}"
                          >
              <el-input v-model="form_sx.content" type="textarea" :rows="2" placeholder="请输入完成情况" ></el-input>
            </el-form-item>
            <el-form-item label="指派给：" prop="liabilityMan" v-if="form_sx.status=='unover'" :rules="{required: true, message: '请选择指派人', trigger: 'change'}">
              <el-select v-model="form_sx.liabilityMan" :remote-method="remoteMethod_sx" filterable remote placeholder="输入工号或姓名搜索" :loading="man_loading">
                <el-option v-for="m in mans" :label="m.realName" :value="m.id" :key="m.id"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="" v-else>
            <el-form-item label="类型相关：" class="mb0">
              {{currentTask.contentTypeText}}
            </el-form-item>
            <el-form-item label="完成情况：" class="mb0" v-if="currentTask.content">
              {{currentTask.content}}
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer">
          <div class="btns clearfix" v-if="sx_edit" style="width: 320px;margin: 0px auto">
            <div class="btn btn-light fl" @click="beforeClose_sx();show_sx_modal=false">取消</div>
            <div class="btn btn-primary fr" @click="update_sx">保存卡片</div>
          </div>
          <div class="btns clearfix" v-else style="width: 160px;margin: 0px auto">
            <div class="btn btn-light fl" @click="show_sx_modal=false">确定</div>
          </div>
        </div>
      </el-dialog>
      <!--填报(KPI实际值)弹窗-->
      <el-dialog v-model="show_tb_modal" :title="tb_modal_type" size="tiny" :before-close="beforeClose_tb" :close-on-click-modal="false">
        <div class="dialog_title_line"></div>
        <el-form ref="form_tb" :model="form_tb" :rules="rule_tb"  label-width="100px">
          <el-form-item label="任务描述：" class="mb0">
            {{currentTask.description}}
          </el-form-item>
          <el-form-item label="发布人：" class="mb0">
            {{currentTask.releaseMan?currentTask.releaseMan.realName:'暂无'}}
          </el-form-item>
          <el-form-item label="任务到期：" class="mb0">
            {{currentTask.completeTime}}
          </el-form-item>
          <el-form-item label="责任人：" class="mb0">
            {{currentTask.liabilityMan}}
          </el-form-item>
          <el-form-item label="被考核人：" class="mb0">
            {{currentTask.evaluationFormKpi?currentTask.evaluationFormKpi.evaluationForm.employeeName:''}}
          </el-form-item>
          <el-form-item label="考核时间段：" class="mb0">
            <span class="f13">{{currentTask.evaluationFormKpi?currentTask.evaluationFormKpi.evaluationForm.startTime+'—'+currentTask.evaluationFormKpi.evaluationForm.endTime:''}}</span>
          </el-form-item>
          <el-form-item label="转发人：" class="mb0" v-if="currentTask.forwardMan">
            {{currentTask.forwardMan}}
          </el-form-item>
          <!--待完成显示-->
          <div class="" v-if="tb_edit">
            <el-form-item label="类型相关：" prop="contentType">
              <el-select v-model="form_tb.contentType" placeholder="请选择类型相关">
                <el-option v-for="(value, key) in contentTypeEnum" :label="value" :value="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="操作：" prop="status" class="mb0">
              <el-radio-group v-model="form_tb.status" size="large" @change="change_status('form_tb')">
                <el-radio  label="over" >完成</el-radio>
                <el-radio  label="unover" >指派</el-radio>
              </el-radio-group>
            </el-form-item>
            <div v-if="form_tb.status=='over'" >
              <el-form-item label="考核指标：" class="mb0">
                {{currentTask_tb.name|null_to_text('暂无')}}
              </el-form-item>
              <el-form-item label="定义：" class="mb0">
                {{currentTask_tb.description|null_to_text('暂无')}}
              </el-form-item>
              <el-form-item label="公式：" class="mb0">
                {{currentTask_tb.expression|null_to_text('暂无')}}
              </el-form-item>
            </div>
            <div >
              <el-form-item label="实际值：" prop="evaluationFormKpi.actualValue" v-if="form_tb.status=='over'" :rules="{required: true, message: '请输入实际值', trigger: 'blur'}">
                <el-input v-model="form_tb.evaluationFormKpi.actualValue"  placeholder="请输入实际值" ></el-input>
              </el-form-item>
              <!--<el-form-item prop="checked" label-width="10px" v-if="form_tb.status=='over'">-->
                <!--<el-checkbox v-model="form_tb.checked">是否需要复核，复核人为 （直接上级）</el-checkbox>-->
              <!--</el-form-item>-->
            </div>
            <div >
              <el-form-item label="指派给：" prop="liabilityMan" v-if="form_tb.status=='unover'" :rules="{required: true, message: '请选择指派人', trigger: 'change'}">
                <el-select v-model="form_tb.liabilityMan" :remote-method="remoteMethod" filterable remote placeholder="输入工号或姓名搜索" :loading="man_loading">
                  <el-option v-for="m in mans" :label="m.realName" :value="m.id" :key="m.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="" style="background-color: #f5f5f5;" v-else>
            <el-form-item label="类型相关：" class="mb0">
              {{currentTask.contentTypeText}}
            </el-form-item>
            <el-form-item label="考核指标：" class="mb0">
              {{currentTask_tb.name|null_to_text('暂无')}}
            </el-form-item>
            <el-form-item label="定义：" class="mb0">
              {{currentTask_tb.description|null_to_text('暂无')}}
            </el-form-item>
            <el-form-item label="公式：" class="mb0">
              {{currentTask_tb.expression|null_to_text('暂无')}}
            </el-form-item>
            <el-form-item label="实际值：" class="mb0">
              {{currentTask.evaluationFormKpi?currentTask.evaluationFormKpi.actualValue:'暂无'}}
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer">
          <div class="btns clearfix" v-if="tb_edit" style="width: 320px;margin: 0px auto">
            <div class="btn btn-light fl" @click="beforeClose_tb();show_tb_modal=false">取消</div>
            <div class="btn btn-primary fr" @click="update_tb('form_tb',form_tb)">确定</div>
          </div>
          <div class="btns clearfix" v-else style="width: 160px;margin: 0px auto">
            <div class="btn btn-light fl" @click="show_tb_modal=false">确定</div>
          </div>
        </div>
      </el-dialog>
      <!--审批(KPI实际值)弹窗-->
      <el-dialog v-model="show_spKpi_modal" :title="spKpi_modal_type" size="tiny" :before-close="beforeClose_spKpi" :close-on-click-modal="false">
        <div class="dialog_title_line"></div>
        <el-form ref="form_spKpi" :model="form_spKpi" :rules="rule_spKpi"  label-width="100px">
          <el-form-item label="任务描述：" class="mb0">
            {{currentTask.description}}
          </el-form-item>
          <el-form-item label="发布人：" class="mb0">
            {{currentTask.releaseMan?currentTask.releaseMan.realName:'暂无'}}
          </el-form-item>
          <el-form-item label="任务到期：" class="mb0">
            {{currentTask.completeTime}}
          </el-form-item>
          <el-form-item label="责任人：" class="mb0">
            {{currentTask.liabilityMan}}
          </el-form-item>
          <el-form-item label="被考核人：" class="mb0">
            {{currentTask.evaluationFormKpi?currentTask.evaluationFormKpi.evaluationForm.employeeName:''}}
          </el-form-item>
          <el-form-item label="考核时间段：" class="mb0">
            <span class="f13">{{currentTask.evaluationFormKpi?currentTask.evaluationFormKpi.evaluationForm.startTime+'—'+currentTask.evaluationFormKpi.evaluationForm.endTime:''}}</span>
          </el-form-item>
          <!--待完成显示-->
          <el-form-item label="类型相关：" prop="contentType" v-if="spKpi_edit" class="mb10">
            <el-select v-model="form_spKpi.contentType" placeholder="请选择类型相关">
              <el-option v-for="(value, key) in contentTypeEnum" :label="value" :value="key"></el-option>
            </el-select>
          </el-form-item>
          <!--已完成显示-->
          <el-form-item label="类型相关：" class="mb0" v-else>
            {{currentTask.contentTypeText}}
          </el-form-item>
          <div>
            <el-form-item label="考核指标：" class="mb0">
              {{currentTask_tb.name|null_to_text('暂无')}}
            </el-form-item>
            <el-form-item label="定义：" class="mb0">
              {{currentTask_tb.description|null_to_text('暂无')}}
            </el-form-item>
            <el-form-item label="公式：" class="mb0">
              {{currentTask_tb.expression|null_to_text('暂无')}}
            </el-form-item>
            <el-form-item label="实际值：" class="mb0">
              {{currentTask.evaluationFormKpi?currentTask.evaluationFormKpi.actualValue:'暂无'}}
            </el-form-item>
            <el-form-item label="状态：" class="mb0">
              {{revieweStatusEnum[currentTask.revieweStatus]}}
            </el-form-item>
          </div>
          <!--待完成显示-->
          <el-form-item label="审核操作：" prop="status" class="mb5 mt5" v-if="spKpi_edit">
            <el-radio-group v-model="form_spKpi.status" class="block-radio">
              <el-radio label="over">同意</el-radio>
              <el-radio label="reset">拒绝并输入拒绝理由</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="reason" v-if="form_spKpi.status==='reset'" :rules="{required: true, message: '输入拒绝理由', trigger: 'blur'}">
            <el-input v-model="form_spKpi.reason" type="textarea" :rows="2" placeholder="输入拒绝理由" ></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer">
          <div class="btns clearfix" v-if="spKpi_edit" style="width: 320px;margin: 0px auto">
            <div class="btn btn-light fl" @click="beforeClose_spKpi();show_spKpi_modal=false">取消</div>
            <!--<el-popover placement="top" title="" width="200" v-model="form_spKpi_reason.show_popover">-->
              <!--<el-form ref="form_spKpi_reason" :model="form_spKpi_reason"  label-width="0px">-->
                <!--<el-form-item prop="reason" :rules="{required: true, message: '输入拒绝理由', trigger: 'blur'}">-->
                  <!--<el-input v-model="form_spKpi_reason.reason" type="textarea" :rows="2" placeholder="输入拒绝理由" ></el-input>-->
                <!--</el-form-item>-->
              <!--</el-form>-->
              <!--<div style="text-align: right; margin: 10px 0 0">-->
                <!--<el-button size="mini" type="text" @click.stop="cancel_reject_kpi">取消</el-button>-->
                <!--<el-button type="primary" size="mini" @click.stop="update_spKpi(0)">确定</el-button>-->
              <!--</div>-->
              <!--<div class="btn btn-light fl"  slot="reference">拒绝</div>-->
            <!--</el-popover>-->
            <div class="btn btn-primary fr" @click="update_spKpi(1)">确定</div>
          </div>
          <div class="btns clearfix" v-else style="width: 160px;margin: 0px auto">
            <div class="btn btn-light fl" @click="show_spKpi_modal=false">确定</div>
          </div>
        </div>
      </el-dialog>
      <!--审批(新建指标)弹窗-->
      <el-dialog v-model="show_spi_modal" :title="spi_modal_type" size="tiny" :before-close="beforeClose_spi" :close-on-click-modal="false">
        <div class="dialog_title_line"></div>
        <el-form ref="form_spi" :model="form_spi" :rules="rule_spi"  label-width="100px">
          <el-form-item label="任务描述：" class="mb0">
            {{currentTask.description}}
          </el-form-item>
          <el-form-item label="发布人：" class="mb0">
            {{currentTask.releaseMan?currentTask.releaseMan.realName:'暂无'}}
          </el-form-item>
          <el-form-item label="任务到期：" class="mb0">
            {{currentTask.completeTime|null_to_text('暂无')}}
          </el-form-item>
          <el-form-item label="责任人：" class="mb0">
            {{currentTask.liabilityMan}}
          </el-form-item>
          </el-form-item>
          <!--待完成显示-->
          <el-form-item label="类型相关：" prop="contentType" v-if="spi_edit" class="mb15">
            <el-select v-model="form_spi.contentType" placeholder="请选择类型相关">
              <el-option v-for="(value, key) in contentTypeEnum" :label="value" :value="key"></el-option>
            </el-select>
          </el-form-item>
          <!--已完成显示-->
          <el-form-item label="类型相关：" class="mb0" v-else>
            {{currentTask.contentTypeText|null_to_text('暂无')}}
          </el-form-item>
          <div style="background-color: #f5f5f5;margin-bottom: 10px;">
            <el-form-item label="指标名称：" class="mb0">
              {{currentTask_spi.name|null_to_text('暂无')}}
            </el-form-item>
            <el-form-item label="定义：" class="mb0">
              {{currentTask_spi.description|null_to_text('暂无')}}
            </el-form-item>
            <el-form-item label="公式：" class="mb0">
              {{currentTask_spi.expression|null_to_text('暂无')}}
            </el-form-item>
            <el-form-item label="计算因子：" class="mb0">
              <span v-for="x in currentTask_spi.indicatorFactors">{{x.name+';'}}</span>
            </el-form-item>
            <el-form-item label="状态：" class="mb0">
              {{revieweStatusEnum[currentTask.revieweStatus]}}
            </el-form-item>
          </div>
          <!--待完成显示-->
          <el-form-item label="审核操作：" prop="status" class="mb5 mt5" v-if="spi_edit">
            <el-radio-group v-model="form_spi.status" class="block-radio">
              <el-radio label="over" v-if="currentTask.revieweStatus=='to_verify'">同意并抄送给HR</el-radio>
              <el-radio label="over" v-if="currentTask.revieweStatus=='to_approve'">同意</el-radio>
              <el-radio label="unover">拒绝并输入拒绝理由</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="reason" v-if="form_spi.status==='unover'" :rules="{required: true, message: '输入拒绝理由', trigger: 'blur'}">
            <el-input v-model="form_spi.reason" type="textarea" :rows="2" placeholder="输入拒绝理由" ></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer">
          <div class="btns clearfix" v-if="spi_edit" style="width: 320px;margin: 0px auto">
            <div class="btn btn-light fl" @click="beforeClose_spi();show_spi_modal=false">取消</div>
            <div class="btn btn-primary fr" @click="update_spi()">确定</div>
          </div>
          <div class="btns clearfix" v-else style="width: 160px;margin: 0px auto">
            <div class="btn btn-light fl" @click="show_spi_modal=false">确定</div>
          </div>
        </div>
      </el-dialog>
      <!--GS打分弹窗-->
      <el-dialog v-model="show_gs_modal" :title="gs_modal_type" size="tiny" :before-close="beforeClose_gs" :close-on-click-modal="false">
        <div class="dialog_title_line"></div>
        <el-form ref="form_gs" :model="form_gs" :rules="rule_gs"  label-width="100px">
          <el-form-item label="任务描述：" class="mb0">
            {{currentTask.description}}
          </el-form-item>
          <el-form-item label="发布人：" class="mb0">
            {{currentTask.releaseMan?currentTask.releaseMan.realName:'暂无'}}
          </el-form-item>
          <el-form-item label="任务到期：" class="mb0">
            {{currentTask.completeTime}}
          </el-form-item>
          <el-form-item label="责任人：" class="mb0">
            {{currentTask.liabilityMan}}
          </el-form-item>
          <el-form-item label="被考核人：" class="mb0">
            {{currentTask_gs.evaluationForm?currentTask_gs.evaluationForm.employeeName:''}}
          </el-form-item>
          <el-form-item label="考核时间段：" class="mb0">
            <span class="f13">{{currentTask_gs.evaluationForm?currentTask_gs.evaluationForm.startTime+'—'+currentTask_gs.evaluationForm.endTime:''}}</span>
          </el-form-item>
          <!--待完成显示-->
          <el-form-item label="类型相关：" prop="contentType" v-if="gs_edit" class="mb10">
            <el-select v-model="form_gs.contentType" placeholder="请选择类型相关">
              <el-option v-for="(value, key) in contentTypeEnum" :label="value" :value="key"></el-option>
            </el-select>
          </el-form-item>
          <!--已完成显示-->
          <el-form-item label="类型相关：" class="mb0" v-else>
            {{currentTask.contentTypeText}}
          </el-form-item>
          <div>
            <el-form-item label="GS任务：" class="mb0">
              {{currentTask_gs.name|null_to_text('暂无')}}
            </el-form-item>
            <el-form-item label="评分标准：" class="mb0">
              {{currentTask_gs.scoringStandard|null_to_text('暂无')}}
            </el-form-item>
            <el-form-item label="完成描述：" class="mb0">
              {{currentTask_gs.finishState|null_to_text('暂无')}}
            </el-form-item>
            <el-form-item label="比重：" class="mb0">
              {{currentTask_gs.weights|null_to_text('暂无')}}
            </el-form-item>
            <el-form-item label="自评分：" class="mb0">
              {{currentTask_gs.selfScore|null_to_text('暂无')}}
            </el-form-item>
            <el-form-item label="评分：" class="mb0" v-if="currentTask_gs.score">
              {{currentTask_gs.score}}
            </el-form-item>
          </div>
          <!--待完成显示-->
          <el-form-item label="打分：" prop="score" v-if="gs_edit" :rules="{required: true, message: '输入分值', trigger: 'blur'}">
            <el-input v-model="form_gs.score" placeholder="输入分值" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <div class="btns clearfix" v-if="gs_edit" style="width: 320px;margin: 0px auto">
            <div class="btn btn-light fl" @click="beforeClose_gs();show_gs_modal=false">取消</div>
            <div class="btn btn-primary fr" @click="update_gs()">确定</div>
          </div>
          <div class="btns clearfix" v-else style="width: 160px;margin: 0px auto">
            <div class="btn btn-light fl" @click="show_gs_modal=false">确定</div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import head from '../common/head.vue'
  import content_head from '../common/content_head.vue'
  module.exports = {
    data: function () {
      return {
        pageLoading:true,
        isBottom:true,
        taskStore:[],
        taskStorePage:0,
        taskStoreLoadMore:false,
        myTask:[],
        myTaskPage:0,
        myTaskLoadMore:false,
        myTaskFilter:'',
        myTaskLoading:false,
        assignedTask:[],
        assignedTaskPage:0,
        assignedTaskLoadMore:false,
        assignedTaskFilter:'',
        assignedTaskLoading:'',
        typeEnum:{
          one:'事项',
          two:"新建指标审核",
          three:"KPI实际值填报",
//          four:"GS任务填报",
          five:"GS任务打分",
//          six:"考核表计划审核",
//          seven:"考核表完成情况审核",
          eight:"KPI实际值填报审核",
//          night:"考核表计划审批"
        },
        typeEnum1:{ one:'事项'},
        importantEnum:{
          H:'非常重要',
          F:'重要',
          M:'一般',
          L:'不重要'
        },
        contentTypeEnum:{
          kpi:'kpi相关',
          gs:'gs相关',
          other:'其他'
        },
        statusEnum:{
          over:'已完成',
          unover:'待完成',
          withdraw:'撤销',
          reset:'审核被拒'
        },
        revieweStatusEnum:{//审批kpi填报任务的状态
          to_verify:"待审核",
          verified:"审核通过",
          unverified:"审核不通过",
          to_approve:"待复核",
          approved:"复核通过",
          unApproved:"复核不通过",
          fillin:"待填报",
          fillover:"填报完成"
        },

        show_add_modal:false,
        mans:[],//责任人数组
        man_loading: false,
        form_add:{
          type:'',
          description:'',
          liabilityMan:'',
          important:'',
          completeTime:'',
          contentType:''
        },
        rule_add:{
          type: [
            {required: true, message: '请选择任务类型', trigger: 'change'}
          ],
          description: [
            {required: true, message: '请填写描述', trigger: 'blur'}
          ],
          liabilityMan: [
            {required: true, message: '请选择责任人', trigger: 'change'}
          ],
          important: [
            {required: true, message: '请选择重要程度', trigger: 'change'}
          ],
          completeTime: [
            {required: true,type:'date', message: '请选择完成时间', trigger: 'blur'}
          ],
          contentType: [
            {required: true, message: '请选择类型相关', trigger: 'change'}
          ]
        },

        show_sx_modal:false,//事项弹窗
        sx_modal_type:'',//事项弹窗标题
        sx_edit:false,
        form_sx:{
          contentType:'',
          content:'',//完成情况
          liabilityMan:'',//指派的人,就是责任人
          status:'over'
        },
        rule_sx:{//动态规则要写到html中
          contentType: [
            {required: true, message: '请选择类型相关', trigger: 'change'}
          ]
        },
        currentTask:{},//点击的当前任务

        currentTask_tb:{},
        show_tb_modal:false,//填报弹窗
        tb_modal_type:'',//填报弹窗标题
        tb_edit:false,
        form_tb:{
          contentType:'',
          type:'three',
          evaluationFormKpi:{
            "id":"",
            "actualValue":""//实际值
          },
          liabilityMan:'',//指派的人,就是责任人
          status:'over'
        },
        rule_tb:{//动态规则要写到html中
          contentType: [
            {required: true, message: '请选择类型相关', trigger: 'change'}
          ]
        },

        show_spKpi_modal:false,//审批kpi弹窗
        spKpi_modal_type:'',//审批kpi弹窗标题
        spKpi_edit:false,
        form_spKpi:{
          contentType:'',
          liabilityMan:'',//指派的人,就是责任人
          status:'over',
          reason:''
        },
        rule_spKpi:{//动态规则要写到html中
          contentType: [
            {required: true, message: '请选择类型相关', trigger: 'change'}
          ]
        },

        currentTask_spi:{},
        show_spi_modal:false,//审批指标弹窗
        spi_modal_type:'',//审批指标弹窗标题
        spi_edit:false,
        form_spi:{
          contentType:'',
          status:'over',//选中同意为over,拒绝为unover
          reason:''
        },
        rule_spi:{//动态规则要写到html中
          contentType: [
            {required: true, message: '请选择类型相关', trigger: 'change'}
          ]
        },

        currentTask_gs:{},
        show_gs_modal:false,//gs打分弹窗
        gs_modal_type:'',//gs打分弹窗标题
        gs_edit:false,
        form_gs:{
          contentType:'',
          score:'',//实际值
//          status:'over'
        },
        rule_gs:{//动态规则要写到html中
          contentType: [
            {required: true, message: '请选择类型相关', trigger: 'change'}
          ]
        },
      }
    },
    computed:{
      userInfo:function () {
        return this.$store.state.userInfo;
      },
    },
    watch:{
      'userInfo':function () {
        if(this.userInfo.id)
        {
          this.init();
        }
      }

    },
    methods:{
      /**
       * 采用新方式处理模态框,在关闭前清空数据,每个表单对应一个方法
       * @param done
       */
      beforeClose_add:function (done) {
        this.clearForm('form_add');
        if(done)
          done();
      },
      beforeClose_sx:function (done) {
        this.clearForm('form_sx');
        if(done)
          done();
      },
      beforeClose_tb:function (done) {
        this.clearForm('form_tb');
        if(done)
          done();
      },
      beforeClose_spKpi:function (done) {
        this.clearForm('form_spKpi');
        if(done)
          done();
      },
      beforeClose_spi:function (done) {
        this.clearForm('form_spi');
        if(done)
          done();
      },
      beforeClose_gs:function (done) {
        this.clearForm('form_gs');
        if(done)
          done();
      },
      /**
       * 清空对应的表单模型
       * @param formName 表单的模型名字
       */
      clearForm:function (formName) {
        if(this.$refs[formName]){
          this.$refs[formName].resetFields();
        }
      },
      clearAllForm:function () {
        var _com=this;
        try{
          for(var f in _com.$refs)
          {
            _com.$refs[f].resetFields();
          }
        }
        catch (e){
          _com.$message.error('操作过于频繁!请刷新页面重试');
        }
      },
      remoteMethod:function (key) {
        var _com=this;
        _com.man_loading=true;
        _com.$http.post(common.projectPath+'sys/employee/queryEmpByNameOrJob',{term :key},{

        }).then(function (data) {
          data=data.body;
          _com.man_loading=false;
          if(data.code=='SUCCESS'){
            _com.mans=data.data;
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      remoteMethod_sx:function (key) {
        var _com=this;
        _com.man_loading=true;
        _com.$http.post(common.projectPath+'sys/employee/childList',{term :key},{

        }).then(function (data) {
          data=data.body;
          _com.man_loading=false;
          if(data.code=='SUCCESS'){
            _com.mans=data.data;
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 获取任务迟列表
       * departmentExist 数字0或者1,1表示任务池,0表示我的任务;
       * liabilityMan 字符串,当前登录用户id;
       */
      getTaskStore: function () {
        this.taskStorePage++;
        var _com = this,
          data={
            data:{
              departmentExist:1,
              liabilityMan:this.userInfo.id
            },
            page:this.taskStorePage,
            pageSize:6
          };
        _com.$http.post(common.projectPath + 'usr/job/pageList', data, {
          emulateJSON: false
        }).then(function (data) {
          data = data.body;
          if (data.code==='SUCCESS') {
            if(data.data) {
              for(var i=0;i<data.data.length;i++){
                _com.callback(data.data[i]);
              }
              _com.taskStore=_com.taskStore.concat(data.data);
              _com.$nextTick(function () {
                _com.createAnimation();
              })
            }
            else {
              _com.taskStore=_com.taskStore.concat([]);
            }
            if(_com.pagination(data.page,data.pageSize,data.total))
            {
              _com.taskStoreLoadMore=true;
            }
            else _com.taskStoreLoadMore=false;
          } else {
            _com.$message.error(data.message);
          }
        })
      },
      getMyTask: function () {
//        if(!this.pageLoading) this.myTaskLoading=true;
        this.myTaskPage++;
        var _com = this,
          data={
            data:{
              departmentExist:0,
              liabilityMan:this.userInfo.id
            },
            page:this.myTaskPage,
            pageSize:6
          };
        if(this.myTaskFilter) data.data.status=this.myTaskFilter;
        _com.$http.post(common.projectPath + 'usr/job/pageList', data, {
          emulateJSON: false
        }).then(function (data) {
          data = data.body;
          if (data.code==='SUCCESS') {
            if(data.data) {
              for(var i=0;i<data.data.length;i++){
                _com.callback(data.data[i]);
              }
              _com.myTask=_com.myTask.concat(data.data);
              _com.$nextTick(function () {
                _com.createAnimation();
              })
            }
            else {
              _com.myTask=_com.myTask.concat([]);
            }
            if(_com.pagination(data.page,data.pageSize,data.total))
            {
              _com.myTaskLoadMore=true;
            }
            else _com.myTaskLoadMore=false;
//            _com.myTaskLoading=false;
          } else {
            _com.$message.error(data.message);
          }
        })
      },
      getAssignedTask: function () {
//        if(!this.pageLoading) this.assignedTaskLoading=true;
        this.assignedTaskPage++;
        var _com = this,
          data={
            data:{
              releaseMan:this.userInfo
            },
            page:this.assignedTaskPage,
            pageSize:6
          };
        if(this.assignedTaskFilter) data.data.status=this.assignedTaskFilter;
        _com.$http.post(common.projectPath + 'usr/job/pageList', data, {
          emulateJSON: false
        }).then(function (data) {
          data = data.body;
          if (data.code==='SUCCESS') {
            if(data.data) {
              for(var i=0;i<data.data.length;i++){
                _com.callback(data.data[i]);
              }
              _com.assignedTask=_com.assignedTask.concat(data.data);
              _com.$nextTick(function () {
                _com.createAnimation();
              })
            }
            else {
              _com.assignedTask=_com.assignedTask.concat([]);
            }
            if(_com.pagination(data.page,data.pageSize,data.total))
            {
              _com.assignedTaskLoadMore=true;
            }
            else _com.assignedTaskLoadMore=false;
//            _com.assignedTaskLoading=false;
            if(_com.pageLoading)
              setTimeout(function () {
                _com.pageLoading=false;
              },500);
          } else {
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 处理返回的任务列表数据
       * @param data 单个任务数据
       */
      callback:function (data) {
        var _com=this;
          //得到责任人和转发人
          for(var j=0;j<data.jobEmployees.length;j++)
          {
            if(data.jobEmployees[j].status==='current')//责任人
            {
              data.liabilityMan=data.jobEmployees[j].employee.realName;
              data.liabilityManId=data.jobEmployees[j].employee.id;
              data.jobEmployeeId=data.jobEmployees[j].id;
              //只有审批用到
              data.revieweStatus=data.jobEmployees[j].revieweStatus;
            }
            else{ //转发人
              data.forwardMan=data.jobEmployees[j].employee.realName;
              data.forwardManId=data.jobEmployees[j].employee.id;
            }
          }
          //得到任务状态
          data.statusText=_com.statusEnum[data.status];
          if(data.expire==1)//已延期
          {
            data.statusText='已延期';
            data.status='delay'
          }
      },
      /**
       * 加载更多的分页判断
       * @param page
       * @param pageSize
       * @param total
       * @returns {boolean}
       */
      pagination:function (page, pageSize, total) {
        if(Math.ceil(total/pageSize)>page)
        {
          return true;
        }
        else return false;
      },
      saveTask:function () {
        var _com=this,url='usr/job/save';
        console.log(_com.form_add);
        _com.$refs['form_add'].validate(function (valid) {
          if(valid)
          {
            _com.form_add.completeTime=quicker.dateToString(_com.form_add.completeTime,'-');
            _com.$http.post(common.projectPath+url,_com.form_add,{

            }).then(function (data) {
              data=data.body;
              if(data.code=='SUCCESS'){
                _com.$message.success('保存成功!');
                _com.beforeClose_add();
                _com.show_add_modal=false;
                _com.init();
              }else{
                _com.$message.error(data.message);
              }
            })
          }
          else
          {
            _com.$message.error('请填写正确数据!');
          }
        });
      },
      update_sx:function () {
        var url='',form={};
        if(this.form_sx.status=='over')
        {
          url='usr/job/update';
          form.id=this.currentTask.id;
          form.jobEmployeeId=this.currentTask.jobEmployeeId;
          form.content=this.form_sx.content;
          form.contentType=this.form_sx.contentType;
          form.status=this.form_sx.status;
        }
        else {
          url='usr/jobEmployee/save';
          form.contentType=this.form_sx.contentType;
          form.job={id:this.currentTask.id};
          form.employee={id:this.form_sx.liabilityMan};
        }
        this.updateTask('form_sx',form,url);
      },
      update_tb:function () {
        var url='',form={};
        if(this.form_tb.status=='over')
        {
          url='usr/job/update';
//          form.jobEmployeeId=this.currentTask.jobEmployeeId;
          form={
            id:this.currentTask.id,
            evaluationFormKpi:{
              id:this.currentTask.evaluationFormKpi.id,
              actualValue:this.form_tb.evaluationFormKpi.actualValue
            },
            contentType:this.form_tb.contentType,
            type:this.form_tb.type,
            status:this.form_tb.status,
            liabilityMan:this.currentTask.liabilityManId
          };
        }
        else {
          url='usr/jobEmployee/save';
          form={
            contentType:this.form_tb.contentType,
            job:{id:this.currentTask.id},
            employee:{id:this.form_tb.liabilityMan}
          };
        }
        this.updateTask('form_tb',form,url);
      },
      update_spKpi:function (type) {
        var _com=this,url='usr/job/update',form={};
        if(this.form_spKpi.status=='over')//同意
        {
          form={
            "id":this.currentTask.id,
            "status":"over",
            "jobEmployeeId":this.currentTask.jobEmployeeId,
            "revieweStatus":"verified",
            "evaluationFormKpi":{
              "id":this.currentTask.evaluationFormKpi.id
            },
            contentType:this.form_spKpi.contentType,
            type:'eight'
          };

        }
        else{//拒绝
          form={
            "id":_com.currentTask.id,
            "status":"reset",
            "releaseMan":{
              "id":_com.currentTask.releaseMan.id
            },
            "liabilityManView":{
              "id":_com.currentTask.liabilityManId
            },
            "revieweFailReason":_com.form_spKpi.reason,
            "jobEmployeeId":_com.currentTask.jobEmployeeId,
            "revieweStatus":"unverified",
            "evaluationFormKpi":{
              "id":_com.currentTask.evaluationFormKpi.id
            },
            contentType:this.form_spKpi.contentType,
            type:'eight'
          }
        }
        this.updateTask('form_spKpi',form,url);
      },
      update_spi:function () {
        var _com=this,url='usr/job/update',form={};
        if(this.form_spi.status=='over')//同意
        {
          form={
            "id":this.currentTask.id,
//            "status":"over",
            "jobEmployeeId":this.currentTask.jobEmployeeId,
//            "revieweStatus":"verified",
            "departmentIndicator":{
              "id":this.currentTask.departmentIndicator.id
            },
            contentType:this.form_spi.contentType,
            type:'two'
          };
          if(this.currentTask.revieweStatus==='to_verify')//上级待审核
          {
            form.revieweStatus='verified';//上级审核通过
            form.liabilityMan=this.currentTask.departmentIndicator.repeatRevieweMan;
          }
          else if(this.currentTask.revieweStatus==='to_approve'){//hr待审批
            form.revieweStatus='approved';//hr审批通过
            form.status='over';
          }
        }
        else{//拒绝
          form={
            "id":this.currentTask.id,
//            "status":"over",
            "releaseMan":{
              "id":this.currentTask.releaseMan.id
            },
            "liabilityManView":{
              "id":this.currentTask.liabilityManId
            },
            "revieweFailReason":this.form_spi.reason,
            "jobEmployeeId":this.currentTask.jobEmployeeId,
//            "revieweStatus":"unverified",
            "departmentIndicator":{
              "id":this.currentTask.departmentIndicator.id
            },
            contentType:this.form_spi.contentType,
            type:'two'
          };
          if(this.currentTask.revieweStatus==='to_verify')//上级待审核
          {
            form.revieweStatus='unverified';//上级审核不通过
            form.status='over';
          }
          else if(this.currentTask.revieweStatus==='to_approve'){//hr待审批
            form.revieweStatus='unApproved';//hr审批不通过
            form.status='over';
          }
        }
        this.updateTask('form_spi',form,url);
      },
      update_gs:function () {
        var url='',form={};

          url='usr/job/update';
          form={
            "id":this.currentTask.id,
            "contentType":this.form_gs.contentType,
            "status":"over",
            "evaluationFormGs":{
              "id":this.currentTask.evaluationFormGs.id,
              "score":this.form_gs.score
            },
            type:'five'
          };
        this.updateTask('form_gs',form,url);
      },
      updateTask:function (form_name,form,url) {
        var _com=this;
        _com.$refs[form_name].validate(function (valid) {
          if(valid)
          {
            _com.$http.post(common.projectPath+url,form,{

            }).then(function (data) {
              data=data.body;
              if(data.code=='SUCCESS'){
                _com.$message.success('保存成功!');
                if(form_name==='form_sx') {
                  _com.beforeClose_sx();
                  _com.show_sx_modal=false;
                }
                else if(form_name==='form_tb'){
                  _com.beforeClose_tb();
                  _com.show_tb_modal=false;
                }
                else if(form_name==='form_spKpi'){
                  _com.beforeClose_spKpi();
                  _com.show_spKpi_modal=false;
                }
                else if(form_name==='form_spi'){
                  _com.beforeClose_spi();
                  _com.show_spi_modal=false;
                }
                else if(form_name==='form_gs'){
                  _com.beforeClose_gs();
                  _com.show_gs_modal=false;
                }
                _com.init();
              }else{
                _com.$message.error(data.message);
              }
            })
          }
          else
          {
            _com.$message.error('请填写正确数据!');
          }
        });
      },
      /**
       * radio改变时,重新验证整个表单
       */
      change_status:function (form_name) {
        this.$refs[form_name].validate();
      },
      getSubMan:function () {
        var _com=this;
        _com.$http.post(common.projectPath+'sys/employee/childList',{},{
          emulateJSON: false
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if(data.data&&data.data.length>0)
              _com.isBottom=false;
            else
              _com.isBottom=true;
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      init:function () {
        this.pageLoading=true;
        this.getSubMan();
        this.taskStorePage=0;
        this.myTaskPage=0;
        this.assignedTaskPage=0;
        this.taskStore=[];
        this.myTask=[];
        this.assignedTask=[];
        this.getTaskStore();
        this.getMyTask();
        this.getAssignedTask();
      },
      openTask:function (task,edit) {
        var _com=this;
        _com.$http.post(common.projectPath+'usr/job/detail',{id:task.id,type:task.type},{
          emulateJSON: true
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if(!data.data) {
              _com.$message.error('没有数据!');
              return;
            }
            _com.callback(data.data);
            _com.currentTask=data.data;
            switch (_com.currentTask.type)
            {
              case 'one'://事项任务
                if(edit&&(_com.currentTask.status==='unover'||_com.currentTask.status==='delay'))//只有我的任务并且未完成才显示编辑表单,其他都只能查看
                  _com.sx_edit=true;
                else
                  _com.sx_edit=false;
                _com.sx_modal_type=_com.typeEnum[_com.currentTask.type]+"任务（"+_com.currentTask.statusText+"）";
                _com.show_sx_modal=true;
                break;
              case 'two'://新建指标审核
                if(edit&&(_com.currentTask.status==='unover'||_com.currentTask.status==='delay'))//只有我的任务并且未完成才显示编辑表单,其他都只能查看
                  _com.spi_edit=true;
                else
                  _com.spi_edit=false;
                _com.spi_modal_type=_com.typeEnum[_com.currentTask.type]+"任务（"+_com.currentTask.statusText+"）";
                _com.show_spi_modal=true;
                _com.currentTask_spi=_com.currentTask.departmentIndicator;
                break;
              case 'three'://kpi实际值填报
                if(edit&&(_com.currentTask.status==='unover'||_com.currentTask.status==='delay'))//只有我的任务并且未完成才显示编辑表单,其他都只能查看
                  _com.tb_edit=true;
                else
                  _com.tb_edit=false;
                _com.tb_modal_type=_com.typeEnum[_com.currentTask.type]+"任务（"+_com.currentTask.statusText+"）";
                _com.show_tb_modal=true;
                _com.currentTask_tb=_com.currentTask.evaluationFormKpi.departmentIndicator;
                break;
              case 'five'://gs打分
                if(edit&&(_com.currentTask.status==='unover'||_com.currentTask.status==='delay'))//只有我的任务并且未完成才显示编辑表单,其他都只能查看
                  _com.gs_edit=true;
                else
                  _com.gs_edit=false;
                _com.gs_modal_type=_com.typeEnum[_com.currentTask.type]+"任务（"+_com.currentTask.statusText+"）";
                _com.show_gs_modal=true;
                _com.currentTask_gs=_com.currentTask.evaluationFormGs;
                break;
              case 'eight'://kpi实际值填报审核
                if(edit&&(_com.currentTask.status==='unover'||_com.currentTask.status==='delay'))//只有我的任务并且未完成才显示编辑表单,其他都只能查看
                  _com.spKpi_edit=true;
                else
                  _com.spKpi_edit=false;
                _com.spKpi_modal_type=_com.typeEnum[_com.currentTask.type]+"任务（"+_com.currentTask.statusText+"）";
                _com.show_spKpi_modal=true;
                _com.currentTask_tb=_com.currentTask.evaluationFormKpi.departmentIndicator;
                break;
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      createAnimation:function () {
        $('.task_node').hover(function () {
          $(this).addClass('').find('.vertical_bar').addClass('animated wobble');
        },function () {
          $(this).removeClass('').find('.vertical_bar').removeClass('animated wobble');
        })
      }
    },
    components: {
      'page-head': head,
      'content_head':content_head
    },
    mounted:function () {
      if(this.userInfo.id)
      {
        this.init();
      }
      this.$nextTick(function () {
        quicker.returnTop();
      })
    }
  }
</script>

