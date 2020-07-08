<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
      <div class="text-center" id="spinner" v-show="loading">
        <b-spinner
          variant="primary"
          type="grow"
          label="Spinning"
          style="width: 5rem; height: 5rem;"
        ></b-spinner>
      </div>
      <b-alert :show="isUpdated" variant=" " dismissible fade class="text-white bg-info">
        <div class="iq-alert-text">
          Datos actualizados con
          <b>exito</b>!
        </div>
      </b-alert>
      <ValidationProvider vid="Fecha" name="Fecha de entrega" rules="required" v-slot="{ errors }">
        <div class="form-group">
          <label for="dateInput">Fecha de entrega</label>
          <input
            type="date"
            :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
            id="destinatarioInput"
            v-model="order.delivery_date"
            required
          />
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider
        vid="Hora entrega"
        name="Hora entrega"
        rules="required"
        v-slot="{ errors }">
        <div class="form-group">
          <label for="destinatarioInput">Hora estimada de entrega</label>
          <b-form-timepicker
            size="sm"
            v-model="deliveryTime"
            placeholder="Hora estimada de entrega">
          </b-form-timepicker>
          <div class="invalid-feedback">
              <span>{{ errors[0] }}</span>
            </div>
        </div>
      </ValidationProvider>
      <ValidationProvider
        vid="Persona que recibe"
        name="Persona que recibe"
        rules="required"
        v-slot="{ errors }">
        <div class="form-group">
          <label for="destinatarioInput">Persona que recibe</label>
          <input
            type="text"
            :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
            id="destinatarioInput"
            v-model="order.addressee"
            placeholder="Persona que recibe"
            required
          />
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider vid="address" name="Dirección" rules="required" v-slot="{ errors }">
        <div class="form-group">
          <label for="emailInput">Dirección</label>
          <textarea
            :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
            id="direccion"
            aria-describedby="direccion"
            v-model="order.delivery_address"
            placeholder="Dirección"
            rows="6"
            max-rows="10"
            required
          ></textarea>
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider vid="Firma" name="Firma" rules="required" v-slot="{ errors }">
        <div class="form-group">
          <label for="signatureInput">Firma</label>
          <input
            type="text"
            :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
            id="signatureInput"
            v-model="order.signature"
            placeholder="Firma del regalo"
            required
          />
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider vid="Dedicatoria" name="Dedicatoria" rules="required" v-slot="{ errors }">
        <div class="form-group">
          <label for="dedicationInput">Dedicatoria</label>
          <textarea
            :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
            id="dedicationInput"
            v-model="order.dedication"
            placeholder="Dedicatoria del regalo"
            rows="6"
            max-rows="10"
            required
          ></textarea>
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <div class="form-group" v-show="order.personalizedRequired">
        <label for="dedicationInput">Personalizado</label>
        <input
          type="text"
          class="form-control mb-0"
          id="dedicationInput"
          v-model="order.personalized_text"
          placeholder="Personalizado"
        />
      </div>
      <div class="d-inline-block w-100">
        <button type="submit" class="btn btn-primary float-right">Enviar</button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { mapGetters } from 'vuex'
import { mask } from 'vue-the-mask'
import orderService from '@/services/order'

export default {
  name: 'UpdateForm',
  directives: { mask },
  mounted () {
    const id = this.$route.params.id
    orderService.getById(id)
      .then(response => {
        this.order = response.data
        const value = this.order.delivery_date
        this.order.delivery_date = value.slice(0, value.indexOf(' '))
        this.deliveryTime = value.slice(value.indexOf(' ') + 1)
      })
      .catch(error => { console.log(error) })
      .finally(() => { this.loading = false })
  },
  computed: {
    ...mapGetters({
      orders: 'Setting/ordersState'
    })
  },
  data () {
    return {
      deliveryTime: null,
      loading: true,
      isUpdated: false,
      order: {
        delivery_date: '',
        delivery_address: '',
        addressee: '',
        dedication: '',
        signature: ''
      }
    }
  },
  methods: {
    onSubmit () {
      this.loading = true
      this.order.delivery_date = `${this.order.delivery_date} ${this.deliveryTime}`
      orderService.update(this.order.id, this.order)
        .then(response => {
          this.orderResponse = response.data
          this.isUpdated = true
        })
        .catch(error => { console.log(error) })
        .finally(() => { this.loading = false })
    }
  }
}
</script>

<style scoped>
#spinner {
  z-index: 1000;
  position: absolute;
  left: 40%;
}
</style>
