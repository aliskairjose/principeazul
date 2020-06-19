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
              <div v-for="(item, index) in data.products" :key="item.id" class="product-info">
                <b-row md="12">
                  <b-col md="6">
                    <label for="" class="text-muted text-capitalize">{{ item.name }}</label>
                  </b-col>
                  <b-col md="4">
                    <label v-for="(a) in item.additionals" :key="a.id" class="text-muted text-capitalize mr-3">
                      <label for="" class="text-muted text-capitalize">{{ a.name }}</label>
                    </label>
                  </b-col>
                  <b-col md="1">
                    <b-button variant="link" @click="showHideDetail(index)">
                      <i class="ri-arrow-down-s-line" v-if="item.showDetails"></i>
                      <i class="ri-arrow-up-s-line" v-else></i>
                    </b-button>
                  </b-col>
                </b-row>
                <b-row v-show="item.showDetails">
                  <b-col md="12">
                    <table style="width:100%">
                      <tr class="text-center">
                        <th>Id</th>
                        <th>Imagen</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                      </tr>
                      <tr v-for="x in item.additionals" :key="x.id" class="text-muted text-capitalize text-muted text-center">
                        <td>{{ x.id }}</td>
                        <td>
                          <b-img
                            v-viewer="{movable: false}"
                            center
                            rounded="circle"
                            :src="x.image ? products.item.image : require(`@/assets/images/no-image.png`)"
                            class="image">
                          </b-img>
                        </td>
                        <td>
                          <label for="" class="text-muted text-capitalize">{{ x.name }}</label>
                        </td>
                        <td>{{ x.quantity }}</td>
                      </tr>
                    </table>
                  </b-col>
                </b-row>
              </div>
             </b-col>
            </b-row>
            <b-row align-h="center" class="mt-3" v-show="isEnable">
              <b-col md="4">
                <b-button variant="outline-primary" v-show="index > 0 ? true : false" @click="prevNext(-1)">Orden Anterior</b-button>
              </b-col>
              <b-col md="4">
                <b-button variant="outline-primary" @click="prevNext(1)">Orden Siguiente</b-button>
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
      showDetails: '',
      index: '',
      data: {
        showDetails: false,
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
      this.loading = true
      orderService.getById(this.dataId)
        .then(response => {
          this.data = response.data
          for (const key in this.data.products) {
            if (this.data.products.hasOwnProperty(key)) {
              const element = this.data.products[key]
              this.$set(element, 'showDetails', false)
            }
          }
        })
        .catch(error => { console.log(error) })
        .finally(() => { this.loading = false })
    },
    prevNext (i) {
      this.index = this.idList.indexOf(this.dataId) + i
      this.dataId = this.idList[this.index]
      this.loadData()
    },
    showHideDetail (index) {
      this.data.products[index].showDetails = !this.data.products[index].showDetails
    }
  }
}
</script>

<style>
  .product-info {
    border: 1px solid black;
    margin-bottom: 5px;
    padding: 5px;
  }
  .image {
    width: 64px;
    height: auto;
  }
</style>
