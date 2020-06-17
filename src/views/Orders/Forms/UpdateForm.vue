<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
      <div class="text-center" id="spinner" v-show="loading">
        <b-spinner variant="primary" type="grow" label="Spinning" style="width: 5rem; height: 5rem;"></b-spinner>
      </div>
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
      <ValidationProvider vid="Destinatario" name="Destinatario" rules="required" v-slot="{ errors }">
        <div class="form-group">
          <label for="destinatarioInput">Destinatario</label>
          <input
            type="text"
            :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
            id="destinatarioInput"
            v-model="order.addressee"
            placeholder="Destinatario"
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
          <input
            type="text"
            :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
            id="direccion"
            aria-describedby="direccion"
            v-model="order.delivery_address"
            placeholder="Dirección"
            required
          />
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
          <input
            type="text"
            :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
            id="dedicationInput"
            v-model="order.dedication"
            placeholder="Dedicatoria del regalo"
            required
          />
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <div class="d-inline-block w-100">
        <button type="submit" class="btn btn-primary float-right">Enviar</button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { mapGetters } from 'vuex'
import { mask } from 'vue-the-mask'

export default {
  name: 'UpdateForm',
  directives: { mask },
  computed: {
    ...mapGetters({
      orders: 'Setting/ordersState'
    })
  },
  data: () => ({
    loading: false,
    order: {
      delivery_date: '',
      delivery_address: '',
      addressee: '',
      dedication: '',
      signature: ''
    }
  })
}
</script>
