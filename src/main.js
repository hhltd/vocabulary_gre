import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import cache from './api/cache'
import event from './utils/event'

Vue.prototype.$cache = cache
Vue.prototype.$event = event

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
