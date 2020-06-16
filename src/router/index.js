import Vue from 'vue'
import VueRouter from 'vue-router'
/* Layouts */
import Layout1 from '../layouts/Layout1'
import AuthLayout1 from '../layouts/AuthLayouts/AuthLayout1'
import Default from '../layouts/BlankLayout'

/* Dashboards View */
import Dashboard1 from '@/views/Dashboards/Dashboard1.vue'
import Client from '@/views/Clients/Client.vue'
import ClientList from '@/views/Clients/ClientList.vue'
import Product from '@/views/Product/Product.vue'
import ProductList from '@/views/Product/ProductList.vue'
import Order from '@/views/Orders/Order.vue'
import OrderList from '@/views/Orders/OrderList.vue'
import User from '@/views/Users/User.vue'
import UserList from '@/views/Users/UserList.vue'
import Callback from '@/views/AuthPages/Default/Callback'

/* Reports */
/* Products movements */
import ProductsMovements from '@/views/Reports/ProductsMovements.vue'
/* End Reports */

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
    name: prop + '.add',
    meta: { dark: mode, auth: true, name: 'Crear orden' },
    component: Order
  },
  {
    path: 'list',
    name: prop + '.list',
    meta: { dark: mode, auth: true, name: 'Lista de ordenes' },
    component: OrderList
  },
  {
    path: 'edit/:id',
    name: prop + '.edit',
    meta: { dark: mode, auth: true, name: 'Editar orden' },
    component: Order
  }
]

const userRoutes = (prop, mode = false) => [
  {
    path: 'add',
    name: prop + '.add',
    meta: { dark: mode, auth: true, name: 'Crear usuario' },
    component: User
  },
  {
    path: 'list',
    name: prop + '.list',
    meta: { dark: mode, auth: true, name: 'Lista de usuarios' },
    component: UserList
  },
  {
    path: 'edit/:id',
    name: prop + '.edit',
    meta: { dark: mode, auth: true, name: 'Editar usuario' },
    component: User
  }
]

const reportRoutes = (prop, mode = false) => [
  {
    path: 'products-movements',
    name: prop + '.productsMovements',
    meta: { dark: mode, auth: true, name: 'Movimientos de productos' },
    component: ProductsMovements
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
    component: Client
  },
  {
    path: 'edit/:id',
    name: prop + '.edit',
    meta: { dark: mode, auth: true, name: 'Editar cliente' },
    component: Client
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
    component: Product
  },
  {
    path: 'edit/:id',
    name: prop + '.edit',
    meta: { dark: mode, auth: true, name: 'Editar producto' },
    component: Product
  }
]

const authChildRoutes = (prop, mode = false) => [
  {
    path: 'sign-in',
    name: prop + '.sign-in',
    meta: { dark: mode, auth: true },
    component: SignIn1
  },
  {
    path: 'sign-up',
    name: prop + '.sign-up',
    meta: { dark: mode, auth: true },
    component: SignUp1
  },
  {
    path: 'password-reset',
    name: prop + '.password-reset',
    meta: { dark: mode, auth: true },
    component: RecoverPassword1
  },
  {
    path: 'lock-screen',
    name: prop + '.lock-screen',
    meta: { dark: mode, auth: true },
    component: LockScreen1
  },
  {
    path: 'confirm-mail',
    name: prop + '.confirm-mail',
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
    path: '/user',
    name: 'user',
    component: Layout1,
    meta: { auth: true },
    children: userRoutes('user')
  },
  {
    path: '/reports',
    name: 'reports',
    component: Layout1,
    meta: { auth: true },
    children: reportRoutes('reports')
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
  const publicPages = ['/auth/sign-in', '/auth/sign-up']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')
  if (to.meta.auth) {
    if (authRequired && loggedIn === null) {
      return next('/auth/sign-in')
    } else if (to.name === 'dashboard') {
      return next('/home')
    }
  }
  next()
})

export default router
