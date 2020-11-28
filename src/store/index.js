import Vue from 'vue'
import Vuex from 'vuex'

//安装插件
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //全局参数
    user: JSON.parse(localStorage.getItem('user') || '{}') //读取localstorage来登录
  },

  mutations: {
    //set方法（同步）提交的时候使用commit
    //用户注册
    setUser: (state, user) => {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    //用户登出
    logout: (state) => {
      state.user = {}
      localStorage.removeItem('user')
    }
  },

  getters: {
    //get方法
    user: state => state.user
  },

  actions: {
    //异步方法 在actions中提交mutations 可以理解为通过将mutations里面处里数据的方法变成可异步的处理数据的方法
    //在action中可以执行store.commit(context.commit)   action中可以有任何的异步操作。在页面中如果我们要用这个action，则需要执行store.dispatch
    updateUser: ({ commit, state }, data) => {
      commit('setUser', {
        ...state.user,
        ...data
      })
    }
  },

  modules: {

  }
})