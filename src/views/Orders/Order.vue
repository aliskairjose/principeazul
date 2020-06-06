<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Ordenes</h4>
          </template>
          <template v-slot:body>
            <b-row>
              <div class="text-center" id="spinner" v-show="loading">
                <b-spinner variant="primary" type="grow" label="Spinning" style="width: 3rem; height: 3rem;"></b-spinner>
              </div>
            </b-row>
            <form-wizard
              ref="wizard"
              @on-complete="onComplete"
              @on-change="tabChange"
              title="Crear orden"
              :subtitle="validateMsg"
              :back-button-text="backBtn"
              :next-button-text="nextBtn"
              finish-button-text="Finalizar orden"
              color="#0630E4">
              <!-- Tab 1 -->
              <tab-content title="Datos de la orden" icon="ti-pencil-alt">
                <b-row id="row">
                  <b-form-group class="col-md-6" label="Cliente:" label-for="cliente">
                    <ValidationProvider name="Cliente" rules="required" v-slot="{ errors }">
                      <b-form-input
                        autocomplete="off"
                        readonly
                        v-model="client.name"
                        @click="getClient"
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
                    <ValidationProvider
                      name="Fecha de entrega"
                      rules="required"
                      v-slot="{ errors }"
                    >
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
                    lot-scope="{ valid, errors }">
                    <ValidationProvider name="Tipo de compra" rules="required" v-slot="{ errors }">
                      <b-form-select
                        v-model="selectedType"
                        :state="errors[0] ? false : (selectedType ? true : null)"
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
              <!-- Tab 2 -->
              <tab-content title="Productos" icon="ti-package" :before-change="validateProducts">
                <div v-for="p in orderProducts" :key="p.id">
                  <b-row id="row">
                  <b-col class="col-md-3">
                    <b-img
                      v-viewer="{movable: false}"
                      center
                      rounded="circle"
                      :src="p.image ? p.image : require(`@/assets/images/no-image.png`)"
                      id="image"
                      class="">
                    </b-img>
                  </b-col>
                  <b-col class="col-md-7">
                    <h3 class="text-capitalize">{{p.name}}</h3>
                    <p class="h5" id="price"> {{ p.price }} $</p>
                    <h5>{{ p.description }} </h5>
                    <p class="h6 mt-3">Extras</p>
                    <p>{{p.extras}}</p>
                    <b-button variant="outline-success" class="mb-3 mr-1" @click="addExtras(p)">
                      Añadir <i class="ri-add-line"></i>
                    </b-button>
                  </b-col>
                  <b-col class="col-md-2">
                    <b-button size="lg" variant="link" class="mb-3 mr-1">
                      <i class="ri-search-line ri-xl pr-0"></i>
                    </b-button>
                  </b-col>
                </b-row>
                </div>
                <b-row align-h="center">
                  <b-col class="col-md-8 text-center">
                    <b-button
                      @click="showProductModal"
                      pill
                      variant="outline-link"
                      class="mb-3 mr-1">
                      <i class="ri-add-line"></i>{{ buttonTitle }}
                    </b-button>
                  </b-col>
                </b-row>
              </tab-content>
              <!-- Tab 3 -->
              <tab-content title="Pago" icon="ti-credit-card">
                <b-row align-h="center" id="row">
                  <b-form-group class="col-md-4">
                    <b-form-radio v-model="radio1" name="efectivo">Efectivo</b-form-radio>
                    <b-form-radio v-model="radio1" name="deposito">Depósito</b-form-radio>
                    <b-form-radio v-model="radio1" name="tdc">Tarjeta de crédito</b-form-radio>
                  </b-form-group>
                  <b-col class="col-md-4">{{price}}</b-col>
                </b-row>
              </tab-content>
            </form-wizard>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal
      ref="lista-productos"
      size="lg"
      id="lista-productos"
      title="Lista de productos"
      cancel-title="Cancelar"
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
      @ok="handleOk"
      @cancel="handleCancel">
      <modal-table
        :items="products"
        :titems="pTitles"
        cancel-title="Cancelar"
        v-on:add-item="addProduct"
        v-on:delete-item="delProduct">
      </modal-table>
    </b-modal>
    <b-modal
      ref="lista-clientes"
      size="lg"
      id="lista-clientes"
      title="Lista de clientes"
      cancel-title="Cancelar"
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
      @ok="handleOk"
      @cancel="handleCancel">
      <modal-table
        :items="clients"
        :titems="cTitles"
        cancel-title="Cancelar"
        v-on:add-item="addClient"
        v-on:delete-item="delClient">
      </modal-table>
    </b-modal>
  </b-container>
</template>
<script>
import { vito } from '../../config/pluginInit'
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import clientService from '@/services/client'
import productService from '@/services/product'
import ModalTable from '@/components/Modals/ModalTable'

export default {
  name: 'Order',
  components: {
    FormWizard,
    TabContent,
    ModalTable
  },
  mounted () {
    vito.index()
    this.loading = true
    productService.getAll('type=principal')
      .then(response => {
        response.data.map(r => {
          r.extra = []
          this.products.push(r)
        })
      })
      .catch((error) => { console.log(error) })
      .finally(() => { this.loading = false })
  },
  data () {
    return {
      tabIndex: 0,
      validateMsg: '',
      loading: false,
      hasProduct: false,
      radio1: null,
      selectedType: null,
      client: { },
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
      tempProd: [],
      orderProducts: [],
      clients: [],
      cTitles: [
        { label: 'Nombre', key: 'name', class: 'text-center', sortable: true },
        { label: 'Teléfono', key: 'phone', class: 'text-center', sortable: true },
        { label: 'Acción', key: 'action', class: 'text-center' }
      ],
      products: [],
      pTitles: [
        { label: 'Id', key: 'id', class: 'text-center', sortable: true },
        { label: 'Foto', key: 'image', class: 'text-center', sortable: true },
        { label: 'Nombre', key: 'name', class: 'text-center', sortable: true },
        { label: 'Cantidad', key: 'quantity', class: 'text-center', sortable: true },
        { label: 'Acción', key: 'action', class: 'text-center' }
      ],
      price: 100
    }
  },
  computed: {
    buttonTitle () {
      if (this.orderProducts.length > 0) {
        return 'Añadir otro producto'
      }
      return 'Añadir producto'
    },
    nextBtn () {
      if (this.tabIndex === 0) {
        return 'Añadir productos'
      }
      return 'Método de pago'
    },
    backBtn () {
      if (this.tabIndex === 1) {
        return 'Añadir productos'
      }
      return 'Método de pago'
    }
  },
  methods: {
    showProductModal () {
      this.$refs['lista-productos'].show()
    },
    validateProducts () {
      if (this.orderProducts.length === 0) {
        this.validateMsg = 'Debe agregar al menos un producto antes de continuar'
        return false
      }
      this.validateMsg = ''
      return true
    },
    onComplete () {
      alert('Yay. Done!')
    },
    tabChange (prevIndex, nextIndex) {
      this.tabIndex = nextIndex
    },
    onChange () {
      this.order.category = this.selectedType
    },
    addExtras (item) {
      console.log('addExtras', item)
    },
    getClient () {
      this.loading = true
      clientService.getAll()
        .then(response => {
          this.clients = response.data
          this.$refs['lista-clientes'].show()
        })
        .catch((error) => { console.log(error) })
        .finally(() => { this.loading = false })
    },
    addClient (item) {
      this.client = item
      this.$refs['lista-clientes'].hide()
    },
    delClient () {

    },
    addProduct (item) {
      this.tempProd.push(item)
    },
    delProduct (id) {
      let prods = this.tempProd.filter(x => x.id !== id)
      this.tempProd = prods
    },
    handleOk () {
      if (this.tempProd.length > 0) {
        for (const key in this.tempProd) {
          if (this.tempProd.hasOwnProperty(key)) {
            const element = this.tempProd[key]
            this.orderProducts.push(element)
          }
        }
      }
      this.tempProd.length = 0
    },
    handleCancel () {
      if (!this.hasProduct) {
        this.orderProducts.length = 0
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import url('https://rawgit.com/lykmapipo/themify-icons/master/css/themify-icons.css');

  #row {
    border: 1px solid black
    border-radius: 7px
    padding: 20px
  }
  #spinner {
    z-index: 1000;
    position: absolute;
    left: 40vw;
  }
  #image {
    width: 132px;
    height: auto;
  }
  #price {
    font-weight: 300
  }

</style>
