import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dataFileStatus:false,
    dataTrainStatus:false
  },
  getters:{
    dataFileStatus: state => state.dataFileStatus,
    dataTrainStatus: state => state.dataTrainStatus
  },
  mutations: {
    SET_DATAFILESTATUS(state,value){
      state.dataFileStatus = value
      // console.log(state.dataFileStatus)
    },
    SET_DATATRAINSTATUS(state,value){
      state.dataTrainStatus = value
      // console.log(state.dataFileStatus)
    }
  },
  actions: {
  },
  modules: {
  }
})
