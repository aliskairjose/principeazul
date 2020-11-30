<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card id="printMe">
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner
                variant="primary"
                type="grow"
                label="Spinning"
              ></b-spinner>
            </b-col>
            <b-col md="12" class="text-center">
              <img
                class="logo my-4 w-25"
                :src="require('../../assets/images/logo-black.png')"
                alt="logo"
              />
            </b-col>
            <b-col md="12">
              <div class="clearfix">
                <div class="float-left">
                  {{ data.created_at | formatWeekDate }}
                </div>
                <div class="float-right">
                  <h3 class="d-inline">{{ data.id }}</h3>
                  <b-button
                    variant="link"
                    class="d-inline mb-3 mr-1"
                    v-print="'#printMe'"
                  >
                    <i class="ri-printer-fill ri-lg"></i>
                  </b-button>
                </div>
              </div>
            </b-col>
            <b-container>
              <b-row>
                <b-col>
                  <p class="text-uppercase font-weight-bolder">Cliente:</p>
                  <p class="text-uppercase">Teléfono:</p>
                  <p class="text-uppercase">Tipo de compra:</p>
                  <p class="text-uppercase">Total a pagar</p>
                  <p class="text-uppercase">Pagado:</p>
                  <p class="text-uppercase">Saldo Pendiente:</p>
                  <p class="text-uppercase">Método de pago:</p>
                </b-col>
                <b-col>
                  <p class="font-weight-bolder">{{ data.client.name }}</p>
                  <p>{{ data.client.phone }}</p>
                  <p>{{ data.type }}</p>
                  <p>{{ data.total | money }}</p>
                </b-col>
              </b-row>
            </b-container>
            <hr />
            <!-- Detalle de los productos -->
            <b-container>
              <b-row>
                <b-col>
                  <p class="text-uppercase">Motivo:</p>
                  <p class="text-uppercase">
                    Mensaje para la tarjeta dedicatoria:
                  </p>
                </b-col>
                <b-col>
                  <p>{{ data.reason }}</p>
                  <p>{{ data.dedication }}</p>
                </b-col>
              </b-row>
            </b-container>
            <b-container>
              <b-row v-for="(p, index) in data.products" :key="index">
                <b-col>
                  <h4>{{ p.name | capitalize }} {{ p.price | money }}</h4>
                  <div v-for="(a, index) in p.additionals" :key="index">
                    <h6 v-if="a.type === 'extra'" class="ml-4 text-black-50">
                      {{ a.name | capitalize }} x {{ a.quantity }}
                    </h6>
                  </div>
                  <b-container>
                    <b-row class="mt-2">
                      <b-col>
                        <p class="text-uppercase">Nota de taller:</p>
                        <p class="text-uppercase">Nota de diseño:</p>
                        <p class="text-uppercase">Personalización de texto:</p>
                      </b-col>
                      <b-col>
                        <p>{{ p.note }}</p>
                        <p>{{ p.note_design }}</p>
                        <p>{{ p.personalized_text }}</p>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-col>
                <b-col>
                  <b-img
                    v-viewer="{ movable: false }"
                    center
                    rounded="circle"
                    :src="
                      p.product.image
                        ? p.product.image
                        : require(`@/assets/images/no-image.png`)
                    "
                    class="image-list"
                  ></b-img>
                  <div v-for="(a, i) in p.additionals" :key="i">
                    <b-img
                      v-if="a.type === 'extra'"
                      v-viewer="{ movable: false }"
                      center
                      rounded="circle"
                      :src="
                        a.product.image
                          ? a.product.image
                          : require(`@/assets/images/no-image.png`)
                      "
                      class="image-list"
                    ></b-img>
                  </div>
                </b-col>
              </b-row>
            </b-container>
            <hr />
            <!-- Datos de la entrega -->
            <b-col>
              <div class="clearfix">
                <div class="float-left">
                  <h5>Datos de la entrega</h5>
                </div>
                <div class="float-right">
                  <h3 class="d-inline">{{ data.id }}</h3>
                </div>
              </div>
            </b-col>
            <b-container>
              <b-row>
                <b-col>
                  <p class="text-uppercase">Fecha de entrega:</p>
                  <p class="text-uppercase">Dirección de entrega:</p>
                  <p class="text-uppercase">Recibe:</p>
                  <p class="text-uppercase">Turno:</p>
                  <p class="text-uppercase">Teléfono:</p>
                  <p class="text-uppercase">Cantidad:</p>
                  <p class="text-uppercase">Productos:</p>
                </b-col>
                <b-col>
                  <p>
                    {{ data.delivery_date | formatWeekDate }}
                  </p>
                  <p>{{ data.delivery_address }}</p>
                  <p>{{ data.addressee }}</p>
                  <p>{{ data.turn }}</p>
                  <p>{{ data.phone }}</p>
                  <p>{{ data.products.length }}</p>
                  <p v-for="(p, i) in data.products" :key="i">
                    {{ p.name | capitalize }}
                  </p>
                </b-col>
              </b-row>
            </b-container>
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
    idList: { type: Array },
    enableButtons: { type: Boolean }
  },
  mounted () {
    vito.index()
    this.loadData()
  },
  data () {
    return {
      variant: '',
      loading: true,
      showDetails: '',
      index: '',
      data: {
        products: [],
        delivery_address: '',
        created_at: '',
        addressee: '',
        delivery_date: '',
        mode: '',
        type: '',
        dedication: '',
        signature: '',
        status: '',
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
      this.index = this.idList.indexOf(this.dataId)
      orderService.getById(this.dataId)
        .then(response => {
          // console.log(response.data)
          this.data = response.data
          for (const key in this.data.products) {
            if (this.data.products.hasOwnProperty(key)) {
              const element = this.data.products[key]
              this.$set(element, 'showDetails', false)
            }
          }
        })
        .catch(() => { this.loading = false })
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
  border: 1px dashed #e5e8e8;
  margin-bottom: 5px;
  padding: 10px 5px;
}
.image {
  width: 64px;
  height: auto;
}
.image-list {
  width: 80px;
  height: auto;
}

.text-italic {
  font-style: italic;
}
@media print {
  .row-data {
    display: flex;
    flex-direction: row;
  }
  p {
    text-transform: uppercase;
  }
  .image-list {
    width: 80px;
    height: auto;
  }
}
</style>
