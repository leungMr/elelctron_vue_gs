<template>
  <div>
    <div>
      <div class="time" :class="{marking : active }" v-if="state==='1'||state==='2'">
        <template v-if="h.length === 3">
          <div v-show="minShow" :class="changeNum(converStr(h).split(',')[0])">
            <span :style="{backgroundColor:c,borderColor:c}" v-for="(i,index) in 7" :key="index"
                  :class="'d'+(index+1)"></span>
          </div>
          <div v-show="minShow" :class="changeNum(converStr(h).split(',')[1])">
            <span :style="{backgroundColor:c,borderColor:c}" v-for="(i,index) in 7" :key="index"
                  :class="'d'+(index+1)"></span>
          </div>
          <div v-show="minShow" :class="changeNum(converStr(h).split(',')[2])">
            <span :style="{backgroundColor:c,borderColor:c}" v-for="(i,index) in 7" :key="index"
                  :class="'d'+(index+1)"></span>
          </div>
        </template>
        <template v-else>
          <div v-show="minShow" :class="changeNum(converStr(h).split(',')[0])">
            <span :style="{backgroundColor:c,borderColor:c}" v-for="(i,index) in 7" :key="index"
                  :class="'d'+(index+1)"></span>
          </div>
          <div v-show="minShow" :class="changeNum(converStr(h).split(',')[1])">
            <span :style="{backgroundColor:c,borderColor:c}" v-for="(i,index) in 7" :key="index"
                  :class="'d'+(index+1)"></span>
          </div>
        </template>
        <div v-show="minShow" class="dots">
          <div :style="{backgroundColor:c,borderColor:c}"></div>
          <div :style="{backgroundColor:c,borderColor:c}"></div>
        </div>
        <div :class="changeNum(converStr(m).split(',')[0])">
          <span :style="{backgroundColor:c,borderColor:c}" v-for="(i,index) in 7" :key="index"
                :class="'d'+(index+1)"></span>
        </div>
        <div :class="changeNum(converStr(m).split(',')[1])">
          <span :style="{backgroundColor:c,borderColor:c}" v-for="(i,index) in 7" :key="index"
                :class="'d'+(index+1)"></span>
        </div>
        <div class="dots">
          <div :style="{backgroundColor:c,borderColor:c}"></div>
          <div :style="{backgroundColor:c,borderColor:c}"></div>
        </div>
        <div :class="changeNum(converStr(s).split(',')[0])">
          <span :style="{backgroundColor:c,borderColor:c}" v-for="(i,index) in 7" :key="index"
                :class="'d'+(index+1)"></span>
        </div>
        <div :class="changeNum(converStr(s).split(',')[1])">
          <span :style="{backgroundColor:c,borderColor:c}" v-for="(i,index) in 7" :key="index"
                :class="'d'+(index+1)"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment/moment'

  export default {
    name: "CountDown",
    components: {},
    data() {
      return {
        state: "1",
        h: "00",
        m: "00",
        s: "00",
        c: "#235C46",
        minShow: true
      }
    },
    props: {
      active: {
        type: Boolean,
        default: () => {
          return false
        }
      },
      color: {
        type: String,
        default: () => {
          return "#235C46"
        }
      }
    },
    mounted() {
      this.color !== undefined ? this.c = this.color : "";
    },
    destroyed() {
      this.clearInterval();
    },
    methods: {
      converStr(str) {//给数字字符串添加逗号分隔符
        str = str + "";
        if (/\./.test(str)) {
          return str.replace(/\d(?=(\d{1})+\.)/g, "$&,").split("").reverse().join("").replace(/\d(?=(\d{1})+\.)/g, "$&,").split("").reverse().join("");
        } else {
          return str.replace(/\d(?=(\d{1})+$)/g, "$&,");
        }
      },
      changeNum(num) {
        return num === "1" ? "one" :
          num === "2" ? "two" :
            num === "3" ? "three" :
              num === "4" ? "four" :
                num === "5" ? "five" :
                  num === "6" ? "six" :
                    num === "7" ? "seven" :
                      num === "8" ? "eight" :
                        num === "9" ? "nine" : "zero";
      },
      // startTime = 2020-10-23 10:51:28
      // endTime = 2020-10-24 10:50:20
      // 倒计时
      // endTime - startTime 取得的天数有效
      countDown(startTime, endTime, state, examineDays, symbol) {
        if (symbol === 0) {
          this.$parent.changeStuState();
        }
        setTimeout(() => {
          let that = this;
          let lastTime = Date.parse(new Date(startTime));
          let oldTime = null;
          that.intOne = setInterval(() => {
            if (null === oldTime) {
              oldTime = Date.parse(moment().format());
            } else {
              let nowTime = Date.parse(moment().format());
              if (1000 === nowTime - oldTime) {
                oldTime = nowTime;
                lastTime += 1000;
              }
            }
            //获取当前时间
            const now = lastTime;
            //开始时间
            const start = Date.parse(new Date(endTime));
            //时间差
            const notTime = start - now;
            //倒计时
            if (notTime > 0) {
              let day = 0;
              let hour;
              let mininate;
              let second;
              // 向下取整
              hour = Math.floor(notTime / 1000 / 60 / 60 % 24);
              mininate = Math.floor(notTime / 1000 / 60 % 60);
              second = Math.floor(notTime / 1000 % 60);
              if (state === "1") {
                // 因为上面算出的小时是求余,所以必须要加上天数
                day = Math.floor(notTime / 1000 / 60 / 60 / 24);
                hour = hour + day * 24;
              } else if (state === "2") {
                if (examineDays > 1) {
                  hour = hour + (examineDays - 1) * 24;
                } else if (examineDays <= 1) {
                  day = Math.floor(notTime / 1000 / 60 / 60 / 24);
                  hour = hour + day * 24;
                }
                that.state = state;
              }
              that.h = hour > 9 ? hour + "" : '0' + hour;
              that.m = mininate > 9 ? mininate + "" : '0' + mininate;
              that.s = second > 9 ? second + "" : '0' + second;
            } else {
              // 时间差为0
              if (state === "1") {
                that.h = "00";
                that.m = "00";
                that.s = "00";
                // 倒计时结束,考核正式开始
                that.$parent.handleOk1();
                that.clearInterval();
              } else if (state === "2") {
                that.h = "00";
                that.m = "00";
                that.s = "00";
                that.clearInterval();
                symbol === 0 ? that.$parent.endCountDownStu() : symbol === 1 ? that.$parent.endCountDownAndupdateState() : null;
                // 状态为2的情况下若剩下的时间为0便修改状态
                that.state = "3";
              }
            }
          }, 200);
        }, 100);
      },
      // 清除定时器
      clearInterval() {
        clearInterval(this.intOne);
      },
      changeState() {
        this.state = "3";
      },
      setTime(hour, min, sec, state) {
        this.minShow = state
        if (hour < 10 && hour >= 0) {
          this.h = "0" + hour
        } else {
          this.h = hour
        }
        if (min < 10 && min >= 0) {
          this.m = "0" + min
        } else {
          this.m = min
        }
        if (sec < 10 && sec >= 0) {
          this.s = "0" + sec
        } else {
          this.s = sec
        }
      },
      // 给时间长度(多少秒),自动计算
      autoSetTime(total) {
        this.clearInterval()
        let hour;
        let min;
        let sec;
        let day;
        hour = Math.floor(total / 1000 / 60 / 60 % 24);
        min = Math.floor(total / 1000 / 60 % 60);
        sec = Math.floor(total / 1000 % 60);
        day = Math.floor(total / 1000 / 60 / 60 / 24);
        // 计算总小时数
        hour = hour + day * 24;
        if (hour < 10 && hour >= 0) {
          this.h = "0" + hour
        } else {
          this.h = hour
        }
        if (min < 10 && min >= 0) {
          this.m = "0" + min
        } else {
          this.m = min
        }
        if (sec < 10 && sec >= 0) {
          this.s = "0" + sec
        } else {
          this.s = sec
        }
      }
    },
  }
</script>
<style scoped>
  .marking > .zero > .d1, .marking > .zero > .d2, .marking > .zero > .d3 {
    width: 8px !important;
  }

  .marking > .one > .marking > .d1, .marking > .one > .d2, .marking > .one > .d3 {
    width: 8px !important;
  }

  .marking > .two > .d1, .marking > .two > .d2, .marking > .two > .d3 {
    width: 8px !important;
  }

  .marking > .three > .d1, .marking > .three > .d2, .marking > .three > .d3 {
    width: 8px !important;
  }

  .marking > .four > .d1, .marking > .four > .d2, .marking > .four > .d3 {
    width: 8px !important;
  }

  .marking > .five > .d1, .marking > .five > .d2, .marking > .five > .d3 {
    width: 8px !important;
  }

  .marking > .six > .d1, .marking > .six > .d2, .marking > .six > .d3 {
    width: 8px !important;
  }

  .marking > .eight > .d1, .marking > .eight > .d2, .marking > .eight > .d3 {
    width: 8px !important;
  }

  .marking > .nine > .d1, .marking > .nine > .d2, .marking > .nine > .d3 {
    width: 8px !important;
  }

  .marking > .seven > .d1, .marking > .seven > .d2, .marking > .seven > .d3 {
    width: 8px !important;
  }

  .marking > .zero > .d4, .marking > .zero > .d5, .marking > .zero > .d6, .marking > .zero > .d7 {
    height: 7px !important;
  }

  .marking > .zero > .d6, .marking > .zero > .d7 {
    top: 25px !important;
  }

  .marking > .zero > .d3 {
    top: 34px !important;
  }

  .marking > .zero > .d2 {
    top: 16px !important;
  }

  .marking > .one > .d4, .marking > .one > .d5, .marking > .one > .d6, .marking > .one > .d7 {
    height: 7px !important;
  }

  .marking > .one > .d6, .marking > .one > .d7 {
    top: 25px !important;
  }

  .marking > .one > .d3 {
    top: 34px !important;
  }

  .marking > .one > .d2 {
    top: 16px !important;
  }

  .marking > .two > .d4, .marking > .two > .d5, .marking > .two > .d6, .marking > .two > .d7 {
    height: 7px !important;
  }

  .marking > .two > .d6, .marking > .two > .d7 {
    top: 25px !important;
  }

  .marking > .two > .d3 {
    top: 34px !important;
  }

  .marking > .two > .d2 {
    top: 16px !important;
  }

  .marking > .three > .d4, .marking > .three > .d5, .marking > .three > .d6, .marking > .three > .d7 {
    height: 7px !important;
  }

  .marking > .three > .d6, .marking > .three > .d7 {
    top: 25px !important;
  }

  .marking > .three > .d3 {
    top: 34px !important;
  }

  .marking > .three > .d2 {
    top: 16px !important;
  }

  .marking > .four > .d4, .marking > .four > .d5, .marking > .four > .d6, .marking > .four > .d7 {
    height: 7px !important;
  }

  .marking > .four > .d6, .marking > .four > .d7 {
    top: 25px !important;
  }

  .marking > .four > .d3 {
    top: 34px !important;
  }

  .marking > .four > .d2 {
    top: 16px !important;
  }

  .marking > .five > .d4, .marking > .five > .d5, .marking > .five > .d6, .marking > .five > .d7 {
    height: 7px !important;
  }

  .marking > .five > .d6, .marking > .five > .d7 {
    top: 25px !important;
  }

  .marking > .five > .d3 {
    top: 34px !important;
  }

  .marking > .five > .d2 {
    top: 16px !important;
  }

  .marking > .six > .d4, .marking > .six > .d5, .marking > .six > .d6, .marking > .six > .d7 {
    height: 7px !important;
  }

  .marking > .six > .d6, .marking > .six > .d7 {
    top: 25px !important;
  }

  .marking > .six > .d3 {
    top: 34px !important;
  }

  .marking > .six > .d2 {
    top: 16px !important;
  }

  .marking > .seven > .d4, .marking > .seven > .d5, .marking > .seven > .d6, .marking > .seven > .d7 {
    height: 7px !important;
  }

  .marking > .seven > .d6, .marking > .seven > .d7 {
    top: 25px !important;
  }

  .marking > .seven > .d3 {
    top: 34px !important;
  }

  .marking > .seven > .d2 {
    top: 16px !important;
  }

  .marking > .eight > .d4, .marking > .eight > .d5, .marking > .eight > .d6, .marking > .eight > .d7 {
    height: 7px !important;
  }

  .marking > .eight > .d6, .marking > .eight > .d7 {
    top: 25px !important;
  }

  .marking > .eight > .d3 {
    top: 34px !important;
  }

  .marking > .eight > .d2 {
    top: 16px !important;
  }

  .marking > .nine > .d4, .marking > .nine > .d5, .marking > .nine > .d6, .marking > .nine > .d7 {
    height: 7px !important;
  }

  .marking > .nine > .d6, .marking > .nine > .d7 {
    top: 25px !important;
  }

  .marking > .nine > .d3 {
    top: 34px !important;
  }

  .marking > .nine > .d2 {
    top: 16px !important;
  }


  .marking .dots, .marking .dots div {
    width: 5px !important;
  }

  .marking div {
    width: 20px !important;
  }

  .marking .dots div:first-child {
    top: 7px !important;
  }

  .marking .dots div:last-child {
    top: 27px !important;
  }

  .time div {
    text-align: left;
    position: relative;
    width: 28px;
    height: 50px;
    display: inline-block;
    margin: 0 4px;
  }

  .time{
    /*background-color: rgb(119, 141, 136);*/
    background-color: transparent;
  }

  /*.time div span {*/
  /*background-color: #235C46;*/
  /*border-color: #235C46;*/
  /*}*/

  .time div span {
    opacity: 0;
    position: absolute;
    -webkit-transition: 0.25s;
    -moz-transition: 0.25s;
    transition: 0.25s;
  }

  .time div span:before,
  .time div span:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 5px solid transparent;
  }

  .time .d1 {
    height: 5px;
    width: 16px;
    top: 0;
    left: 6px;
  }

  .time .d1:before {
    border-width: 0 5px 5px 0;
    border-right-color: inherit;
    left: -5px;
  }

  .time .d1:after {
    border-width: 0 0 5px 5px;
    border-left-color: inherit;
    right: -5px;
  }

  .time .d2 {
    height: 5px;
    width: 16px;
    top: 24px;
    left: 6px;
  }

  .time .d2:before {
    border-width: 3px 4px 2px;
    border-right-color: inherit;
    left: -8px;
  }

  .time .d2:after {
    border-width: 3px 4px 2px;
    border-left-color: inherit;
    right: -8px;
  }

  .time .d3 {
    height: 5px;
    width: 16px;
    top: 48px;
    left: 6px;
  }

  .time .d3:before {
    border-width: 5px 5px 0 0;
    border-right-color: inherit;
    left: -5px;
  }

  .time .d3:after {
    border-width: 5px 0 0 5px;
    border-left-color: inherit;
    right: -5px;
  }

  .time .d4 {
    width: 5px;
    height: 14px;
    top: 7px;
    left: 0;
  }

  .time .d4:before {
    border-width: 0 5px 5px 0;
    border-bottom-color: inherit;
    top: -5px;
  }

  .time .d4:after {
    border-width: 0 0 5px 5px;
    border-left-color: inherit;
    bottom: -5px;
  }

  .time .d5 {
    width: 5px;
    height: 14px;
    top: 7px;
    right: 0;
  }

  .time .d5:before {
    border-width: 0 0 5px 5px;
    border-bottom-color: inherit;
    top: -5px;
  }

  .time .d5:after {
    border-width: 5px 0 0 5px;
    border-top-color: inherit;
    bottom: -5px;
  }

  .time .d6 {
    width: 5px;
    height: 14px;
    top: 32px;
    left: 0;
  }

  .time .d6:before {
    border-width: 0 5px 5px 0;
    border-bottom-color: inherit;
    top: -5px;
  }

  .time .d6:after {
    border-width: 0 0 5px 5px;
    border-left-color: inherit;
    bottom: -5px;
  }

  .time .d7 {
    width: 5px;
    height: 14px;
    top: 32px;
    right: 0;
  }

  .time .d7:before {
    border-width: 0 0 5px 5px;
    border-bottom-color: inherit;
    top: -5px;
  }

  .time .d7:after {
    border-width: 5px 0 0 5px;
    border-top-color: inherit;
    bottom: -5px;
  }

  /* 1 */

  .time div.one .d5,
  .time div.one .d7 {
    opacity: 1;
  }

  /* 2 */

  .time div.two .d1,
  .time div.two .d5,
  .time div.two .d2,
  .time div.two .d6,
  .time div.two .d3 {
    opacity: 1;
  }

  /* 3 */

  .time div.three .d1,
  .time div.three .d5,
  .time div.three .d2,
  .time div.three .d7,
  .time div.three .d3 {
    opacity: 1;
  }

  /* 4 */

  .time div.four .d5,
  .time div.four .d2,
  .time div.four .d4,
  .time div.four .d7 {
    opacity: 1;
  }

  /* 5 */

  .time div.five .d1,
  .time div.five .d2,
  .time div.five .d4,
  .time div.five .d3,
  .time div.five .d7 {
    opacity: 1;
  }

  /* 6 */

  .time div.six .d1,
  .time div.six .d2,
  .time div.six .d4,
  .time div.six .d3,
  .time div.six .d6,
  .time div.six .d7 {
    opacity: 1;
  }


  /* 7 */

  .time div.seven .d1,
  .time div.seven .d5,
  .time div.seven .d7 {
    opacity: 1;
  }

  /* 8 */

  .time div.eight .d1,
  .time div.eight .d2,
  .time div.eight .d3,
  .time div.eight .d4,
  .time div.eight .d5,
  .time div.eight .d6,
  .time div.eight .d7 {
    opacity: 1;
  }

  /* 9 */

  .time div.nine .d1,
  .time div.nine .d2,
  .time div.nine .d3,
  .time div.nine .d4,
  .time div.nine .d5,
  .time div.nine .d7 {
    opacity: 1;
  }

  /* 0 */

  .time div.zero .d1,
  .time div.zero .d3,
  .time div.zero .d4,
  .time div.zero .d5,
  .time div.zero .d6,
  .time div.zero .d7 {
    opacity: 1;
  }

  /* The dots */

  .time div.dots {
    width: 5px;
  }

  .time div.dots div {
    width: 5px;
    height: 5px;
    position: absolute;
    left: 0;
    top: 14px;
    margin: 0;
  }

  .time div.dots div:last-child {
    top: 34px;
  }
</style>
