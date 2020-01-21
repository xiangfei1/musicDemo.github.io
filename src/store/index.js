import Vue from'vue'
import Vuex from 'vuex'
import * as action from './action'
import * as getters from './getters'
import mutations from './mutations'
import state from './state'
Vue.use(Vuex)

export default new Vuex.Store({
    state,  //保存项目的状态
    getters,    //计算属性
    mutations,  //改变状态的方法
    action,    //类似于mutations，但需要提交到mutations，不能直接变更状态
})

