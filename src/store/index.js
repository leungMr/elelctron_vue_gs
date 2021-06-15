import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dataFileStatus: false,
    dataTrainStatus: false,
    voiceControlShow: {
      isShow: false,
      type: "语音控制"
    },
  },
  getters: {
    dataFileStatus: state => state.dataFileStatus,
    dataTrainStatus: state => state.dataTrainStatus,
    voiceControlShow: state => state.voiceControlShow
  },
  mutations: {
    SET_DATAFILESTATUS(state, value) {
      state.dataFileStatus = value
      // console.log(state.dataFileStatus)
    },
    SET_DATATRAINSTATUS(state, value) {
      state.dataTrainStatus = value
      // console.log(state.dataFileStatus)
    },
    SET_VOIVECONTROLSHOW(state, value) {
      state.voiceControlShow = value
      // console.log(state.dataFileStatus)
    }
  },
  actions: {},
  modules: {}
})
