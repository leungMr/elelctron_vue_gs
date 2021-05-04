<template>
  <div class="width-100-per border progress-parent">
    <div class="width-100-per layout-center" style="height: 25px">
      <div class="height-100-per layout-center" style="width: 70px">{{getTime(currentProgress)}}</div>
      <div class="height-100-per progress"
           style="width: calc(100% - 140px)"
           @mouseenter="progressFocus(true)"
           @mouseleave="progressFocus(false)">
        <a-slider class="height-100-per width-100-per layout-center"
                  :tip-formatter="formatter"
                  :disabled="dotDisabled"
                  v-model="currentProgress"
                  :min="1"
                  :max="durationVal"></a-slider>
      </div>
      <div class="height-100-per layout-center" style="width: 70px">{{getTime(durationVal)}}</div>
    </div>
    <div class="width-100-per layout-left-center" style="height: 33px;font-size: 30px;padding: 0 10px">
      <div @click="fastProgress(true)" class="cursor-pointer margin-right-5-px layout-center-top">
        <!--<icon name="fast-left" :scale="2"/>-->
        <a-icon type="fast-backward" style="font-size: 24px;"></a-icon>
      </div>
      <template v-for="(icon,index) of icons">
        <a-icon class="cursor-pointer margin-right-5-px"
                :key="'icon-'+index"
                @click="progressHandle(icon.type)"
                :type="icon.icon"
                v-if="icon.status"/>
      </template>

      <div @click="fastProgress(false)" class="cursor-pointer margin-right-5-px layout-center-top">
        <!--<icon name="fast-right" :scale="2"/>-->
        <a-icon type="fast-forward" style="font-size: 24px;"></a-icon>
      </div>
      <div style="height: 24px" class="layout-left-center margin-left-10-px">
        <a-icon @click="speedProgress(true)" class="cursor-pointer" type="fast-backward" style="font-size: 24px"/>
        <div class="height-100-per layout-center text-size-13px" style="width: 80px" onselectstart="return false">
          {{rateVal}}/速率
        </div>
        <a-icon @click="speedProgress(false)" class="cursor-pointer" type="fast-forward" style="font-size: 24px"/>
      </div>
    </div>
  </div>
</template>

<script>
  import {Icon, Slider} from 'ant-design-vue'

  export default {
    components: {
      AIcon: Icon,
      ASlider: Slider
    },
    props: {
      duration: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    data() {
      return {
        dotDisabled: false,
        icons: [
          {
            icon: "caret-right",
            status: true,
            type: 0,
          },
          {
            icon: "pause",
            status: false,
            type: 1,
          }
        ],
        currentProgress: 0, // 当前时长，秒
        durationVal: this.duration, // 总时长，秒
        rate: 1,// 速率，大于等于1小于等于10
        rateVal: 1,
        timer: null, // 计时器
        codeConstants: {
          start: {
            code: 0,
            explain: "开始"
          },
          pause: {
            code: 1,
            explain: "暂停"
          },
          continue: {
            code: 2,
            explain: "继续"
          },
          finish: {
            code: 3,
            explain: "结束"
          }
        },
        dot: null,
      }
    },
    watch: {
      duration(val) {
        this.durationVal = val
      }
    },
    mounted() {
      this.dot = document.querySelectorAll("div.ant-slider-handle")[0];
      let bar = document.querySelectorAll("div.ant-slider-track")[0];
      bar.style.background = "#0077aa";
      this.dot.style.display = "none";
      this.dot.style.borderColor = "#0077aa";
      this.dot.style.background = "#0077aa";
    },
    methods: {
      setUp(data) {
        this.currentProgress = data
      },
      speedProgress(e) {
        if (e) {
          if (this.rate < 1.75) {
            this.rate = this.rate + 0.25;
            this.rateVal = this.rateVal - 0.25;
          }
        } else {
          if (this.rate > 0.25) {
            this.rate = this.rate - 0.25;
            this.rateVal = this.rateVal + 0.25;
          }
        }
        if (this.timer !== null) {
          clearInterval(this.timer);
          this.fn();
        }
      },
      fastProgress(e) {
        if (e) {
          if (this.currentProgress - 15 <= 0) {
            this.currentProgress = 0
          } else {
            this.currentProgress = this.currentProgress - 15;
          }
        } else {
          if (this.currentProgress + 15 >= this.durationVal) {
            this.currentProgress = this.durationVal;
          } else {
            this.currentProgress = this.currentProgress + 15;
          }
        }
      },

      formatter(value) {
        return this.getTime(value);
      },
      progressFocus(e) {
        this.dot.style.display = e ? "block" : "none";
      },
      progressHandle(type) {
        // console.log(type)
        const that = this;
        if (type === 0 && that.currentProgress < that.durationVal) {
          if (that.currentProgress < that.durationVal) {
            that.$emit('progressNotification', that.currentProgress === 0 ? that.codeConstants.start : that.codeConstants.continue);
            that.icons[0].status = false;
            that.icons[1].status = true;
            that.fn();
          }
        } else if (type === 1) {
          this.$emit('progressNotification', that.codeConstants.pause);
          that.icons[0].status = true;
          that.icons[1].status = false;
          clearInterval(this.timer);
          that.timer = null;
        }

      },
      fn() {
        const that = this;
        let flag = 0;
        that.timer = setInterval(() => {
          flag = flag + 200;
          if (flag >= that.rate * 1000) {
            flag = 0;
            that.currentProgress = that.currentProgress + 1;
            that.$emit('timeEcho', that.currentProgress);
            if (that.currentProgress >= that.durationVal) {
              clearInterval(that.timer);
              that.timer = null;
              that.$emit('progressNotification', that.codeConstants.finish);
              that.icons[0].status = true;
              that.icons[1].status = false;
            }
          }
        }, 200)
      },
      getTime(value) {
        if (value !== 0) {
          let secondTime = parseInt(value); // 秒
          let minuteTime = 0; // 分
          let hourTime = 0; // 小时
          if (secondTime > 60) {
            minuteTime = parseInt(secondTime / 60);
            secondTime = parseInt(secondTime % 60);
            if (minuteTime > 60) {
              hourTime = parseInt(minuteTime / 60);
              minuteTime = parseInt(minuteTime % 60);
            }
          }
          return ((hourTime > 0 ? hourTime < 10 ? "0" + hourTime : hourTime : "00") + ":") +
            ((minuteTime > 0 ? minuteTime < 10 ? "0" + minuteTime : minuteTime : "00") + ":") +
            (secondTime > 0 ? secondTime < 10 ? "0" + secondTime : secondTime : "00")
        } else {
          return '00:00:00'
        }
      },
    }
  }
</script>

<style>
  .progress > .ant-slider {
    margin: 0;
  }

  .progress > .ant-slider > .ant-slider-handle {
    top: 11px;
  }

  .progress-parent {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }
</style>
