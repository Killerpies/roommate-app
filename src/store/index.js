import { createStore } from 'vuex'
import userModule from './modules/user'
import groupModule from './modules/group'

export default createStore({
  state: {
  },
  getters: {

  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user: userModule,
    group: groupModule
  }
})
