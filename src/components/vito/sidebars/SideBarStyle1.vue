<template>
  <div class="iq-sidebar">
    <div class="iq-sidebar-logo d-flex justify-content-between">
      <router-link :to="homeURL">
        <span>El principe azul</span>
      </router-link>
      <div class="iq-menu-bt-sidebar" v-if="toggleButton">
        <div class="iq-menu-bt align-self-center">
          <div class="wrapper-menu" @click="miniSidebar">
            <div class="main-circle"><i class="ri-arrow-left-s-line"></i></div>
            <div class="hover-circle"><i class="ri-arrow-right-s-line"></i></div>
          </div>
        </div>
      </div>
    </div>
    <div id="sidebar-scrollbar">
      <nav class="iq-sidebar-menu" :class="horizontal ? 'd-xl-none' : ''">
        <List :items="items" :open="true" :horizontal="horizontal"/>
      </nav>
      <div class="d-inline-block w-100 text-center p-3">
        <a class="iq-bg-danger iq-sign-btn" href="javascript:void(0)" @click="logout" role="button">{{ $t('nav.user.signout') }}
          <i class="ri-login-box-line ml-2"></i>
        </a>
      </div>
      <div class="p-3"></div>
    </div>
  </div>
  <!-- TOP Nav Bar -->
</template>

<script>
import List from '../menus/ListStyle1'
export default {
  name: 'SideBarStyle1',
  props: {
    homeURL: { type: Object, default: () => ({ name: 'layout1.dashboard' }) },
    items: { type: Array },
    logo: { type: String, default: require('../../../assets/images/logo.png') },
    horizontal: { type: Boolean },
    toggleButton: { type: Boolean, default: true }
  },
  components: {
    List
  },
  methods: {
    miniSidebar () {
      this.$emit('toggle')
    },
    logout () {
      console.log('logout')
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
      // this.$router.push({ name: 'auth1.sign-in1' })
      window.location.assign('/auth/sign-in')
    }
  },
  data () {
    return {
    }
  }
}
</script>
