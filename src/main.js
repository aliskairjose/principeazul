import Vue from 'vue'
import 'mutationobserver-shim'
import './Utils/fliter'
import './config/firebase'
import App from './App.vue'
import router from './router'
import store from './store'
import Raphael from 'raphael/raphael'
import './plugins'
import './registerServiceWorker'
import AlgoliaComponents from 'vue-instantsearch'
import i18n from './i18n'
import 'element-ui/lib/theme-chalk/index.css'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import money from 'v-money'
import { extend } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import { messages } from 'vee-validate/dist/locale/es.json'
import interceptors from '@/services/interceptors'

Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule], // copies rule configuration
    message: messages[rule] // assign message
  })
})

global.Raphael = Raphael

Vue.use(interceptors)
Vue.use(AlgoliaComponents)
Vue.use(Viewer)
Vue.use(money, {
  decimal: '.',
  thousands: ',',
  precision: 2,
  masked: true
})

Vue.config.productionTip = false

let vm = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

window.vm = vm
