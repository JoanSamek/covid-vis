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

new Vue({
  store,
  render: h => h(App),
  components: { App }
}).$mount('#app')
