import Vue from 'vue'
import VueRouter from 'vue-router'
/* Layouts */
import Layout1 from '../layouts/Layout1'
import AuthLayout1 from '../layouts/AuthLayouts/AuthLayout1'
import Default from '../layouts/BlankLayout'

/* Dashboards View */
import Dashboard1 from '@/views/Dashboards/Dashboard1.vue'
import ClientList from '@/views/Clients/ClientList.vue'
import ClientEdit from '@/views/Clients/ClientEdit.vue'
import ProductList from '@/views/Product/ProductList.vue'
import ProductEdit from '@/views/Product/ProductEdit.vue'
import Callback from '@/views/AuthPages/Default/Callback'
import Order from '@/views/Orders/Order.vue'

/* Authentic View */
import SignIn1 from '../views/AuthPages/Default/SignIn1'
import SignUp1 from '../views/AuthPages/Default/SignUp1'
import RecoverPassword1 from '../views/AuthPages/Default/RecoverPassword1'
import LockScreen1 from '../views/AuthPages/Default/LockScreen1'
import ConfirmMail1 from '../views/AuthPages/Default/ConfirmMail1'

import ErrorPage from '@/views/Pages/ErrorPage'
import ComingSoon from '@/views/Pages/ComingSoon'
import Maintenance from '@/views/Pages/Maintenance'

Vue.use(VueRouter)

// Set View in this function
const paRoutes = (prop, mode = false) => [
  {
    path: 'home',
    name: prop + '.home',
    meta: { dark: mode, auth: true, name: 'Dashborad' },
    component: Dashboard1
  }
]

const orderRoutes = (prop, mode = false) => [
  {
    path: '',
    name: prop + '.index',
    meta: { dark: mode, auth: true, name: 'Ordenes' },
    component: Order
  },
  {
    path: 'list',
    name: prop + '.list',
    meta: { dark: mode, auth: true, name: 'Lista de ordenes' },
    component: Order
  }
]

const clientRoutes = (prop, mode = false) => [
  {
    path: 'list',
    name: prop + '.list',
    meta: { dark: mode, auth: true, name: 'Clientes' },
    component: ClientList
  },
  {
    path: 'add/',
    name: prop + '.add',
    meta: { dark: mode, auth: true, name: 'Agregar cliente' },
    component: ClientEdit
  },
  {
    path: 'edit/:id',
    name: prop + '.edit',
    meta: { dark: mode, auth: true, name: 'Editar cliente' },
    component: ClientEdit
  }
]

const productRoutes = (prop, mode = false) => [
  {
    path: 'list',
    name: prop + '.list',
    meta: { dark: mode, auth: true, name: 'Inventario' },
    component: ProductList
  },
  {
    path: 'add',
    name: prop + '.add',
    meta: { dark: mode, auth: true, name: 'Agregar producto' },
    component: ProductEdit
  },
  {
    path: 'edit/:id',
    name: prop + '.edit',
    meta: { dark: mode, auth: true, name: 'Editar producto' },
    component: ProductEdit
  }
]

const authChildRoutes = (prop, mode = false) => [
  {
    path: 'sign-in1',
    name: prop + '.sign-in1',
    meta: { dark: mode, auth: true },
    component: SignIn1
  },
  {
    path: 'sign-up1',
    name: prop + '.sign-up1',
    meta: { dark: mode, auth: true },
    component: SignUp1
  },
  {
    path: 'password-reset1',
    name: prop + '.password-reset1',
    meta: { dark: mode, auth: true },
    component: RecoverPassword1
  },
  {
    path: 'lock-screen1',
    name: prop + '.lock-screen1',
    meta: { dark: mode, auth: true },
    component: LockScreen1
  },
  {
    path: 'confirm-mail1',
    name: prop + '.confirm-mail1',
    meta: { dark: mode, auth: true },
    component: ConfirmMail1
  }
]

const pagesChildRoutes = (prop, mode = false) => [
  {
    path: 'error/:code',
    name: prop + '.error',
    meta: { dark: mode, auth: true },
    component: ErrorPage
  },
  {
    path: 'coming-soon',
    name: prop + '.coming-soon',
    meta: { dark: mode, auth: true },
    component: ComingSoon
  },
  {
    path: 'maintenance',
    name: prop + '.maintenance',
    meta: { dark: mode, auth: true },
    component: Maintenance
  }
]

// Set Layout in this route
const routes = [
  {
    path: '*', redirect: '/'
  },
  {
    path: '/auth',
    name: 'auth1',
    component: AuthLayout1,
    meta: { auth: true },
    children: authChildRoutes('auth1')
  },
  {
    path: '/',
    name: 'dashboard',
    component: Layout1,
    meta: { auth: true },
    children: paRoutes('dashboard')
  },
  {
    path: '/orders',
    name: 'orders',
    component: Layout1,
    meta: { auth: true },
    children: orderRoutes('orders')
  },
  {
    path: '/clients',
    name: 'clients',
    component: Layout1,
    meta: { auth: true },
    children: clientRoutes('client')
  },
  {
    path: '/products',
    name: 'product',
    component: Layout1,
    meta: { auth: true },
    children: productRoutes('product')
  },
  {
    path: '/pages',
    name: 'pages',
    component: Default,
    meta: { auth: true },
    children: pagesChildRoutes('default')
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
    }
  }
  next()
})

export default router
