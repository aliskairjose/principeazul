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
          <input type="checkbox" class="custom-control-input"/>
          <label class="custom-control-label">Recordarme</label>
        </div>
        <button type="submit" class="btn btn-primary float-right">Inicia sesión</button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { mapGetters } from 'vuex'
import auth from '@/services/auth'
export default {
  name: 'SignIn1Form',
  data: () => ({
    user: {
      email: '',
      password: ''
    }
  }),
  mounted () {
  },
  computed: {
    ...mapGetters({
      stateUsers: 'Setting/usersState'
    })
  },
  methods: {
    onSubmit () {
      this.jwtLogin(this.user)
    },
    jwtLogin () {
      auth.login(this.user).then(response => {
        const resp = response.data
        if (response) {
          localStorage.setItem('user', JSON.stringify(resp.data))
          localStorage.setItem('access_token', resp.access_token)
          this.$router.push({ name: 'dashboard.home' })
        } else if (response.data.errors.length > 0) {
          this.$refs.form.setErrors(response.data.errors)
        }
      })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => { this.loading = false })
    }
  }
}
</script>
