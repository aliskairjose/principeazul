<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </b-col>
            <b-row>
              <b-col md="12" class="mb-4">
                <h4>Detalles de la orden #{{data.id}}</h4>
              </b-col>
              <b-col md="12" class="mb-2">
                <h5>Información del cliente</h5>
              </b-col>
              <b-col md="6">Cliente: {{ data.client.name}}</b-col>
              <b-col md="6">Dirección: {{ data.client.address}}</b-col>
              <b-col md="6">Teléfono: {{ data.client.phone  }}</b-col>
              <b-col md="6">Email: {{ data.client.email}}</b-col>
              <b-col md="12" class="mb-2 mt-3">
                <h5>Información de la orden</h5>
              </b-col>
              <b-col md="6">Dirección de entrega: {{ data.delivery_address }}</b-col>
              <b-col md="6">Fecha: {{ data.created_at | formatDate}}</b-col>
              <b-col md="6">Recibe: {{ data.addressee}}</b-col>
              <b-col md="6">Fecha entrega: {{ data.delivery_date | formatDate}}</b-col>
              <b-col md="6">Modo de entrega: {{ data.mode | capitalize }}</b-col>
              <b-col md="6">Tipo de compra: {{ data.type | capitalize }}</b-col>
              <b-col md="6">Status de la orden: {{ data.status | capitalize }}</b-col>
              <b-col md="6">Dedicatoria: {{ data.dedication | capitalize }}</b-col>
              <b-col md="6">Firma: {{ data.signature | capitalize }}</b-col>
              <b-col md="12" class="mb-2 mt-3">
                <h5>Productos</h5>
              </b-col>
             <b-col>
              <b-row md="12" v-for="item in data.products" :key="item.id">
                <b-col md="6">
                  {{ item.name }}
                </b-col>
                <b-col md="4">
                  <label v-for="a in item.additionals" :key="a.id" class="text-muted text-capitalize mr-3">
                    {{ a.name }}
                  </label>
                </b-col>
              </b-row>
             </b-col>
            </b-row>
            <b-row align-h="center" class="mt-3" v-show="isEnable">
              <b-col md="4">
                <b-button variant="outline-primary" v-show="index > 0 ? true : false" @click="prev">Orden Anterior</b-button>
              </b-col>
              <b-col md="4">
                <b-button variant="outline-primary" @click="next">Orden Siguiente</b-button>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
import orderService from '@/services/order'

export default {
  name: 'OrderDetailComponent',
  props: {
    dataId: { type: Number },
    idList: { type: Array }
  },
  mounted () {
    vito.index()
    if (localStorage.getItem('role') === 'taller') {
      this.isEnable = true
    }
    this.loadData()
  },
  data () {
    return {
      loading: true,
      isEnable: false,
      index: '',
      data: {
        client: {
          name: '',
          phone: '',
          email: ''
        }
      }
    }
  },
  methods: {
    loadData () {
      orderService.getById(this.dataId)
        .then(response => {
          this.data = response.data
        })
        .catch(error => { console.log(error) })
        .finally(() => { this.loading = false })
    },
    prev () {
      this.index = this.idList.indexOf(this.dataId) - 1
      this.dataId = this.idList[this.index]
      this.loadData()
    },
    next () {
      this.index = this.idList.indexOf(this.dataId) + 1
      this.dataId = this.idList[this.index]
      this.loadData()
    }
  }
}
</script>

<style>

</style>
