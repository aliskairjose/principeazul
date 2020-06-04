<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Ordenes</h4>
          </template>
          <template v-slot:body>
            <form-wizard
              @on-complete="onComplete"
              title="Crear orden"
              shape="tab"
              back-button-text="Go Back"
              next-button-text="Añadir producto"
              finish-button-text="Finalizar orden"
              color="#0630E4">
              <tab-content title="Datos de la orden" icon="ti-pencil-alt">
                <b-row>
                  <b-form-group class="col-md-6" label="Cliente:" label-for="cliente">
                    <ValidationProvider name="Cliente" rules="required" v-slot="{ errors }">
                      <b-form-input
                        v-model="order.client"
                        type="text"
                        placeholder="Cliente"
                        :class="(errors.length > 0 ? ' is-invalid' : '')"
                      ></b-form-input>
                      <div class="invalid-feedback">
                        <span>{{ errors[0] }}</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Fecha de entrega:" label-for="date">
                    <ValidationProvider name="Fecha de entrega" rules="required" v-slot="{ errors }">
                      <b-form-input
                        v-model="order.date"
                        type="date"
                        placeholder="Fecha de entrega"
                        :class="(errors.length > 0 ? ' is-invalid' : '')"
                      ></b-form-input>
                      <div class="invalid-feedback">
                        <span>{{ errors[0] }}</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group
                    class="col-md-6"
                    label="Categoría:"
                    label-for="category"
                    lot-scope="{ valid, errors }"
                  >
                    <ValidationProvider name="Tipo de compra" rules="required" v-slot="{ errors }">
                      <b-form-select
                        :state="errors[0] ? false : (selectedType ? true : null)"
                        v-model="selectedType"
                        :options="purchaseType"
                        @change="onChange"
                      ></b-form-select>
                      <div class="invalid-feedback">
                        <span>{{ errors[0] }}</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Observaciones:" label-for="name">
                    <ValidationProvider name="Observaciones" rules="required" v-slot="{ errors }">
                      <b-form-input
                        v-model="order.observacines"
                        type="text"
                        placeholder="Observaciones"
                        :class="(errors.length > 0 ? ' is-invalid' : '')"
                      ></b-form-input>
                      <div class="invalid-feedback">
                        <span>{{ errors[0] }}</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                </b-row>
              </tab-content>
              <tab-content title="Productos" icon="ti-package">Productos</tab-content>
              <tab-content title="Pago" icon="ti-credit-card">
                <b-row align-h="center">
                  <b-form-group class="col-md-4">
                    <b-form-radio v-model="radio1" name="efectivo">Efectivo</b-form-radio>
                    <b-form-radio v-model="radio1" name="deposito">Depósito</b-form-radio>
                    <b-form-radio v-model="radio1" name="tdc">Tarjeta de crédito</b-form-radio>
                  </b-form-group>
                  <b-col class="col-md-4">
                    {{price}}
                  </b-col>
                </b-row>
              </tab-content>
            </form-wizard>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { vito } from '../../config/pluginInit'
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

export default {
  name: 'Order',
  components: {
    FormWizard,
    TabContent
  },
  mounted () {
    vito.index()
  },
  data () {
    return {
      selectedType: null,
      order: {
        client: '',
        date: '',
        category: '',
        observaciones: ''
      },
      purchaseType: [
        { value: null, text: 'Seleccione tipo de compra' },
        { value: '1', text: 'Delivery' },
        { value: '2', text: 'Compra en tienda' },
        { value: '3', text: 'Compra web' }
      ],
      price: 100
    }
  },
  methods: {
    onComplete () {
      alert('Yay. Done!')
    },
    onChange () {
      this.order.category = this.selectedType
    }
  }
}
</script>
<style lang="stylus" scoped>
@import url('https://rawgit.com/lykmapipo/themify-icons/master/css/themify-icons.css');
</style>
