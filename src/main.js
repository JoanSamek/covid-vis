import Vue from 'vue'
import App from './App.vue'
import store from './store'
Vue.config.productionTip = false

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// import './app.scss'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

import Vuex from 'vuex'
Vue.use(Vuex)

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
Vue.component('v-select', vSelect)

// import Raphael from 'raphael/raphael'
// global.Raphael = Raphael
// import LineChart from 'vue-morris'
// Vue.component('line-chart', LineChart)

new Vue({
  store,
  render: h => h(App),
  components: { App }
}).$mount('#app')
