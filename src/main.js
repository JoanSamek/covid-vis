import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import Vuex from 'vuex'
Vue.use(Vuex)

new Vue({
  render: h => h(App),
}).$mount('#app')
