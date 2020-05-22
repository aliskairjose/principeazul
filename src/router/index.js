import Vue from 'vue'
import VueRouter from 'vue-router'
/* Layouts */
import Layout1 from '../layouts/Layout1'
import Layout2 from '../layouts/Layout2'
/* Dashboards View */
import Dashboard2 from '../views/Dashboards/Dashboard2.vue'
import Dashboard1 from '../views/Dashboards/Dashboard1.vue'
import Clients from '../views/Clients/Clients.vue'
import Inventory from '../views/Inventory/Inventory.vue'
import Callback from '../views/AuthPages/Default/Callback'

Vue.use(VueRouter)

// Set View in this function
const miniChildRoutes = (prop, mode = false) => [
  {
    path: 'home-1',
    name: prop + '.home-1',
    meta: { dark: mode, auth: true, name: 'Home 1' },
    component: Dashboard1
  }
]
// Set View in this function
const childRoutes = (prop, mode) => [
  {
    path: 'home',
    name: prop + '.home',
    meta: { dark: mode, auth: true, name: 'Home' },
    component: Dashboard2
  }
]
const clientRoutes = (prop, mode) => [
  {
    path: 'clients',
    name: prop + '.client',
    meta: { dark: mode, auth: true, name: 'Clients' },
    component: Clients
  }
]
const inventoryRoutes = (prop, mode) => [
  {
    path: 'inventory',
    name: prop + '.inventory',
    meta: { dark: mode, auth: true, name: 'Inventory' },
    component: Inventory
  }
]

// Set Layout in this route
const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Layout1,
    meta: { auth: true },
    children: childRoutes('dashboard')
  },
  {
    path: '/',
    name: 'mini.dashboard',
    component: Layout2,
    meta: { auth: true },
    children: miniChildRoutes('mini.dashboard')
  },
  {
    path: '/',
    name: 'clients',
    component: Layout1,
    meta: { auth: true },
    children: clientRoutes('clients')
  },
  {
    path: '/',
    name: 'inventory',
    component: Layout1,
    meta: { auth: true },
    children: inventoryRoutes('inventory')
  },
  {
    path: '/callback',
    name: 'callback',
    meta: { auth: false },
    component: Callback
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  const publicPages = ['/auth/sign-in1', '/auth/sign-up1', '/dark/auth/sign-in1', '/dark/auth/sign-up1']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')
  if (to.meta.auth) {
    if (authRequired && loggedIn === null) {
      return next('/auth/sign-in1')
    } else if (to.name === 'dashboard' || to.name === 'mini.dashboard') {
      return next('/home')
    } else if (to.name === 'dark.dashboard' || to.name === 'dark.mini.dashboard') {
      return next('/dark/home-1')
    }
  }
  next()
})

export default router
