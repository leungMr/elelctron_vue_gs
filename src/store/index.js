import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dataFileStatus:false,
  },
  getters:{
    dataFileStatus: state => state.dataFileStatus
  },
  mutations: {
    SET_DATAFILESTATUS(state,value){
      state.dataFileStatus = value
      // console.log(state.dataFileStatus)
    }
  },
  actions: {
  },
  modules: {
  }
})
