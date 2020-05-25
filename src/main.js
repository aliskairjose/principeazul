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
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import DataTables and DataTablesServer together
import VueDataTables from 'vue-data-tables'
import lang from 'element-ui/lib/locale/lang/es'
import locale from 'element-ui/lib/locale'

locale.use(lang)
global.Raphael = Raphael

Vue.use(AlgoliaComponents)
Vue.use(ElementUI)
Vue.use(VueDataTables)

Vue.config.productionTip = false

let vm = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

window.vm = vm
