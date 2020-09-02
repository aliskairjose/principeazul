<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card id="printMe">
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </b-col>
            <b-row>
              <b-col md="10" class="mb-4">
                <h4>Detalles de la orden #{{data.id}}</h4>
              </b-col>
              <b-col md="2">
                <b-button variant="link" class="mb-3 mr-1" v-print="'#printMe'">
                  <i class="ri-printer-fill ri-lg"></i>
                </b-button>
              </b-col>
              <!-- Información del cliente -->
              <b-col md="6" class="mb-3">Cliente: {{ data.client.name}}</b-col>
              <b-col md="6" class="mb-3">Teléfono: {{ data.client.phone  }}</b-col>
              <b-col md="6" class="mb-3">Entrega: {{ data.mode | capitalize }}</b-col>
              <b-col md="6" class="mb-3">Tipo de compra: {{ data.type | capitalize }}</b-col>
              <b-col md="6" class="mb-3">Monto total: {{ data.total | money }}</b-col>
              <b-col md="6" class="mb-3">Total pagado: {{ data.totalPaid | money }}</b-col>
              <b-col md="6" class="mb-3">
                Método de pago:
                <ul v-for="p in data.payments" :key="p.id">
                  <li v-show="p.amount > 0">{{p.payment_method}}: {{p.amount | money }}</li>
                </ul>
              </b-col>
              <b-col md="12"><hr></b-col>

              <!-- Información del producto -->
              <b-col md="12" class="mb-3">
                <div v-for="(item, index) in data.products" :key="item.id" class="product-info pt-3">
                  <b-row>
                    <b-col md="2">
                      <b-img
                        v-viewer="{movable: false}"
                        center
                        rounded="circle"
                        :src="item.product.image ? item.product.image : require(`@/assets/images/no-image.png`)"
                        class="image">
                      </b-img>
                    </b-col>
                    <b-col md="10">
                      <b-row>
                        <b-col md="6"> <h5>{{item.name}}</h5> </b-col>
                        <b-col md="4">
                          <h6 class="mx-1">
                            <b-badge :variant="item.product.personalized ? 'info' : 'warning'" class="px-3">
                              {{item.product.personalized ? 'Personalizado' : 'Standard'  }}
                            </b-badge>
                          </h6>
                        </b-col>
                        <b-col md="12"> <label class="text-italic text-muted" for="" v-show="item.note">Nota de taller: "{{item.note}}"</label> </b-col>
                        <b-col md="12"> <label class="text-italic text-muted" for="" v-show="item.note_design">Nota de diseño: "{{item.note_design}}"</label> </b-col>
                        <!-- <b-col md="6">
                          <label v-for="(a) in item.additionals" :key="a.id" class="text-muted text-capitalize mr-3">
                              <h6 class="mx-1"> <b-badge variant="primary" class="px-3"> {{ a.name }}</b-badge></h6>
                          </label>
                        </b-col> -->
                        <b-col md="4" v-show="item.additionals.length > 0">
                          <b-button variant="link" @click="showHideDetail(index)">
                            <!-- <i class="ri-arrow-down-s-fill" v-if="!item.showDetails"></i>
                            <i class="ri-arrow-up-s-fill" v-else></i> -->
                          </b-button>
                        </b-col>
                        <!-- <b-col md="12">
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
                        </b-col> -->
                      </b-row>
                    </b-col>
                  </b-row>

                </div>
              </b-col>
              <b-col md="6" class="mb-3"> Motivo: {{ data.reason ? data.reason : 'Sin motivo' }} </b-col>
              <!-- <b-col md="6" class="mb-3">Firma: {{ data.signature | capitalize }}</b-col> -->
              <b-col md="12" class="mb-3">
                Mensaje para la tarjeta dedicatoria: <br>
                <label for="" class="text-italic text-muted" v-show="data.dedication">
                  "{{ data.dedication | capitalize }}"
                </label>
              </b-col>
              <b-col md="12" class="mb-3">
                Texto personalizado: <br>
                <label for="" class="text-italic text-muted" v-show="data.personalized_text">
                  "{{ data.personalized_text | capitalize }}"
                </label>
              </b-col>

              <b-col md="12"><hr></b-col>

              <!-- Datos de la entrega -->
              <b-col md="12" class="mb-2 mt-3"> <h5 class="text-muted">Datos de la entrega</h5> </b-col>
              <b-col md="6" class="mb-3">Recibe: {{ data.addressee}}</b-col>
              <b-col md="6" class="mb-3">Fecha entrega: {{ data.delivery_date | formatWeekDate}}</b-col>
              <b-col md="6" class="mb-3">Dirección de entrega: <br>{{ data.delivery_address }}</b-col>
              <!-- <b-col md="6" class="mb-3">Teléfono: <br>{{ data.phone_number }}</b-col> -->

             <b-col md="12">
               <slot></slot>
             </b-col>
            </b-row>
            <b-row align-h="center" class="mt-3" v-show="enableButtons">
              <b-col md="4">
                <b-button variant="primary" v-show="index > 0 ? true : false" @click="prevNext(-1)">Orden Anterior</b-button>
              </b-col>
              <b-col md="4">
                <b-button variant="primary" @click="prevNext(1)">Orden Siguiente</b-button>
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
          this.data = response.data
          console.log(this.data)
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
    border: 1px dashed #E5E8E8;
    margin-bottom: 5px;
    padding: 10px 5px;
  }
  .image {
    width: 64px;
    height: auto;
  }

  .text-italic {
    font-style: italic;
  }
</style>
