<template>
  <div style="width: 100%;height: 100%;">
    <template class="layout-left-bottom" style="display: flex;">
      <div class="overflow-auto"
           style="min-height: calc(100% - 0px);background-color: rgba(255, 255, 255, 0);border-top: 0px">
        <!--展开状态S-->
        <div v-if="leftState" class="width-100-per padding-5-px">
          <!--框和组的循环S-->
          <div v-for="(opk,sy) in assessmentData" :key="sy"
               class="margin-bottom-5-px hoverable animated fadeInLeft">
            <div class="margin-bottom-5-px"
                 style="text-align: left;background-color: #235C46;padding: 3px;border-top-left-radius: 5px;border-top-right-radius: 5px;">
              <span style="color: white;margin-left: 10px;">{{opk.netName}}</span>
            </div>
            <!--一个框的循环S-->
            <div v-for="(items,index) in opk.netList"
                 class=" border-left border-right border-bottom margin-bottom-5-px hoverable animated fadeInLeft layout-side"
                 :style="items.userState === '1' ? 'border-top: 5px solid #d9d9d9;' : items.userState === '2' ? 'border-top: 5px solid #52c41a;' : items.userState === '3' ? 'border-top: 5px solid #1890ff;' :'border-top: 5px solid #faad14;'"
                 style="border-radius: 5px; padding: 5px; margin: 0 5px"
                 :key="index" @click="selectCard(items,sy,index)"
                 :class="{activeSelectCard:selectCardKey===(sy+'+'+index)}">
              <!--框内信息S-->
              <div class="height-100-per" style="width: calc(100% - 15px)">
                <!--人的头像,状态,名字,编号S-->
                <div class="layout-left-center relative margin-bottom-5-px">
                  <!--<img :src="items.userImg" style="width: 42px;height: 42px;"/>-->
                  <img src='../../../src/assets/img/user.png' style="width: 42px;height: 42px;"/>
                  <div style="width: calc(100% - 42px);text-align: left;padding-left: 10px">
                    <span :class="{'examUserName' : examUserName}"
                          :title="'学生姓名: '+items.username">{{items.username}}
                    </span>
                    <span :class="{'deviceCodeLim' : deviceCodeLim}" :title="'证件号: '+ items.militaryId">{{items.militaryId}}</span>
                  </div>
                  <!--<div class="absolute" style="top: -10px;left: 36px">-->
                  <!--  &lt;!&ndash; 上线 &ndash;&gt;-->
                  <!--  <div v-if="items.userState === '2'" title="上线">-->
                  <!--    <div class="nip-badge nip-badge-success"></div>-->
                  <!--  </div>-->
                  <!--  &lt;!&ndash; 考核中 &ndash;&gt;-->
                  <!--  <div v-if="items.userState === '3'" title="考核中">-->
                  <!--    <div class="nip-badge nip-badge-processing"></div>-->
                  <!--  </div>-->
                  <!--  &lt;!&ndash; 已交卷 &ndash;&gt;-->
                  <!--  <div v-else-if="items.userState === '4'" title="已交卷">-->
                  <!--    <div class="nip-badge nip-badge-warning"></div>-->
                  <!--  </div>-->
                  <!--  &lt;!&ndash; 离线 &ndash;&gt;-->
                  <!--  <div v-else-if="items.userState === '1'" title="离线">-->
                  <!--    <div class="nip-badge nip-badge-default"></div>-->
                  <!--  </div>-->
                  <!--</div>-->
                </div>
                <!--人的头像,状态,名字,编号E-->
                <!--设备,状态,设备编号S-->
                <div class="layout-left-center text-align-left relative">
                  <!--<img :src="items.deviceImg" style="width: 42px"/>-->
                  <img src='../../../src/assets/img/TCR173 高速数据电台模拟器.png' style="width: 42px"/>
                  <div style="width: calc(100% - 42px);text-align: left;padding-left: 10px">
                    {{items.equiTitle}}
                  </div>
                  <div class="absolute" style="top: -10px;left: 36px">
                    <!-- 上线 -->
                    <div v-if="items.deviceState === '5'" title="上线">
                      <div class="nip-badge nip-badge-success"></div>
                    </div>
                    <!-- 离线 -->
                    <div v-else title="离线">
                      <div class="nip-badge nip-badge-default"></div>
                    </div>
                  </div>
                </div>
                <!--设备,状态,设备编号E-->
              </div>
              <!--框内信息E-->
              <!--点击右边滑出S-->
              <a-tooltip placement="right">
                <template slot="title">
                  <p>
                    <span>设备编号 : {{items.devicename}} </span>
                  </p>
                  <p>
                    <a-tooltip>
                      <template slot="title">
                        {{items.subject.subjectName}}
                      </template>
                      <div style="display: flex;align-items: center;">
                        <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;margin-right: 10px;">
                          课目信息 : {{items.subject.subjectName}}
                        </div>
                        <a-icon type="eye" @click="viewSubDetailTem(items.subject.id,items.userId)"/>
                      </div>
                    </a-tooltip>
                  </p>
                </template>
                <a-icon type="right" class="cursor-pointer"/>
              </a-tooltip>
              <!--点击右边滑出E-->
            </div>
            <!--一个框的循环E-->
          </div>
          <!--框和组的循环E-->
        </div>
        <!--展开状态E-->
        <!--这是右边收拢的一种状态S-->
        <div v-else class="overflow-auto width-100-per animated fadeInRight">
          <div v-for="(ky,sy) in assessmentData" :key="sy">
            <div v-for="(items,index) in ky.netList"
                 class="layout-side border-bottom width-100-per height-56-px" :key="index">
              <div class="layout-center-top">
                <span disabled="false">{{items.username}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--这是右边收拢的一种状态E-->
      </div>
    </template>
    <a-modal
      :title="modalTitle"
      :visible="modalVisible"
      :confirmLoading="modalConfirmLoading"
      @cancel="handleCancel"
      :footer="null"
      :width="modalWidth+'px'"
      style="top: 20px;"
    >
      <!--<Template ref="liaison" @getWidth="getTableWidth" v-on:onCloseModal="handleCancel"></Template>-->
    </a-modal>
  </div>
</template>

<script>
  import {Modal, Icon, Tooltip, Button} from 'ant-design-vue';
  // import Template from "_components/service/template/Template";


  export default {
    data() {
      return {
        leftWidth: '220',
        leftState: true,
        leftIcon: 'left',
        assessmentData: [],
        deviceCodeLim: true,
        examUserName: true,
        selectCardKey: "",
        modalWidth: 520,
        modalVisible: false,
        modalConfirmLoading: false,
        modalTitle: "",
        template: [],
        subjectContentForm: [],
      }
    },
    props: [],
    components: {
      AIcon: Icon,
      ATooltip: Tooltip,
      AButton: Button,
      AModal: Modal,
      // Template,
    },
    methods: {
      // 控制设备音量0或者100
      controlVoice(id) {
        this.$emit('controlVoiceToSon2', id)
      },
      // 取消按钮
      handleCancel(e) {
        this.modalVisible = false;
      },
      // 获取组件modal的宽度
      getTableWidth(data) {
        this.modalWidth = data + 50;
      },
      // 点击卡片
      selectCard(e, sy, index) {
        console.log("点击了卡片")
      },
      // 获取左边人员列表数据
      resolveData(e) {
        // 这个数据不是直接获取的需要处理
        // 有些参数可变的 人员状态 设备状态 整场考试状态
        this.assessmentData = JSON.parse(JSON.stringify(e))
      },
      // 点击眼睛查看科目信息
      viewSubDetailTem(subId, userId) {
        console.log("你点击了眼睛")
      },
      // 左边收缩展开变化
      contractionExpansion(e1, e2, e3) {
        this.leftIcon = e1;
        this.leftWidth = e2;
        this.leftState = e3;
      },
    }
  }
</script>

<style scoped>
  .deviceCodeLim, .examUserName {
    text-overflow: ellipsis;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    float: left;
  }

  .activeSelectCard {
    border-bottom: 1px solid #235C46;
    border-left: 1px solid #235C46;
    border-right: 1px solid #235C46;
  }
</style>
