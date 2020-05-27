<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
      <ValidationProvider vid="email" name="E-mail" rules="required|email" v-slot="{ errors }">
        <div class="form-group">
          <label for="emailInput">Email</label>
          <input
            type="email"
            :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
            id="emailInput"
            aria-describedby="emailHelp"
            v-model="user.email"
            placeholder="Tú email"
            required
          />
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider vid="password" name="Password" rules="required" v-slot="{ errors }">
        <div class="form-group">
          <label for="passwordInput">Password</label>
          <router-link to="/auth/password-reset1" class="float-right">Olvidó la contraseña?</router-link>
          <input
            type="password"
            :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
            id="passwordInput"
            v-model="user.password"
            placeholder="Tú contraseña"
            required
          />
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <div class="d-inline-block w-100">
        <div class="custom-control custom-checkbox d-inline-block mt-2 pt-1">
          <input type="checkbox" class="custom-control-input" :id="formType" />
          <label class="custom-control-label" :for="formType">Recordarme</label>
        </div>
        <button type="submit" class="btn btn-primary float-right">Inicia sesión</button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import auth from '../../../../services/auth'
// import { vito } from '../../../../config/pluginInit'
import { mapGetters } from 'vuex'

export default {
  name: 'SignIn1Form',
  // components: { SocialLoginForm },
  props: ['formType', 'email', 'password'],
  data: () => ({
    user: {
      email: '',
      password: ''
    }
  }),
  mounted () {
    this.user.email = this.$props.email
    this.user.password = this.$props.password
  },
  computed: {
    ...mapGetters({
      stateUsers: 'Setting/usersState'
    })
  },
  methods: {
    onSubmit () {
      this.jwtLogin()
    },
    jwtLogin () {
      let selectedUser = this.stateUsers.find(user => {
        return (user.email === this.user.email && user.password === this.user.password)
      }) || null
      if (selectedUser) {
        this.$store.dispatch('Setting/authUserAction', {
          auth: true,
          authType: 'jwt',
          user: {
            id: selectedUser.uid,
            name: selectedUser.name,
            mobileNo: null,
            email: selectedUser.email,
            profileImage: null
          }
        })
        localStorage.setItem('user', JSON.stringify(selectedUser))
        localStorage.setItem('access_token', selectedUser.token)
        this.$router.push({ name: 'dashboard.home' })
      }
    },
    passportLogin () {
      auth.login(this.user).then(response => {
        if (response.status) {
          localStorage.setItem('user', JSON.stringify(response.data))
          this.$router.push({ name: 'mini.dashboard.home-1' })
        } else if (response.data.errors.length > 0) {
          this.$refs.form.setErrors(response.data.errors)
        }
      }).finally(() => { this.loading = false })
    }
  }
}
</script>
