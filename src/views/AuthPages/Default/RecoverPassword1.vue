<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <div>
      <h2 class="mb-0">Restablecer la contraseña</h2>
      <p>Ingrese su dirección de correo electrónico y le enviaremos un correo electrónico con instrucciones para restablecer su contraseña.</p>
      <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
        <div class="text-center" id="spinner" v-show="loading">
          <b-spinner variant="primary" type="grow" label="Spinning" style="width: 5rem; height: 5rem;"></b-spinner>
        </div>
        <ValidationProvider vid="email" name="E-mail" rules="required|email" v-slot="{ errors }">
          <div class="form-group">
            <label for="emailInput">Correo electrónico</label>
            <input
              type="email"
              :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
              id="emailInput"
              aria-describedby="emailHelp"
              v-model="data.email"
              placeholder="tu@email.com"
              required
            />
            <div class="invalid-feedback">
              <span>{{ errors[0] }}</span>
            </div>
          </div>
        </ValidationProvider>

        <div class="d-inline-block w-100">
          <button type="submit" class="btn btn-primary float-right">Restablecer contraseña</button>
        </div>
      </form>
    </div>
    <div>
      <b-alert :show="isSuccess" variant="success">
        <div class="iq-alert-icon">
          <i class="ri-alert-line"></i>
        </div>
        <div class="iq-alert-text">Su contraseña ha sido restablecida con exito</div>
      </b-alert>
    </div>
  </ValidationObserver>
</template>
<script>
import auth from '@/services/auth'

export default {
  name: 'RecoverPassword1',
  data () {
    return {
      loading: false,
      isSuccess: false,
      data: {
        email: ''
      }
    }
  },
  methods: {
    onSubmit () {
      this.loading = true
      auth.resetPassword(this.data)
        .then(response => {
          if (response.status) { this.isSuccess = true }
        })
        .then(error => { console.log(error) })
        .finally(() => { this.loading = false })
    }
  }
}
</script>

<style lang="stylus" scoped>
 #spinner{
    z-index: 1000;
    position: absolute;
    left: 40%;
 }
</style>
