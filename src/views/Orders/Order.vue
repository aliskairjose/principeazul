<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <iq-card>
          <template v-slot:body>
            <b-row>
              <div class="text-center" id="spinner" v-show="loading">
                <b-spinner
                  variant="primary"
                  type="grow"
                  label="Spinning"
                  style="width: 3rem; height: 3rem;">
                </b-spinner>
              </div>
            </b-row>
            <form-wizard
              ref="wizard"
              @on-complete="onComplete"
              @on-change="tabChange"
              title=""
              :subtitle="validateMsg"
              :back-button-text="backBtn"
              :next-button-text="nextBtn"
              finish-button-text="Finalizar orden"
              color="#0630E4"
              error-color="#f35448"
            >
              <!-- Tab Ordenes -->
              <tab-content
                title="Datos de la orden"
                icon="ti-pencil-alt"
                :before-change="validateOrder">
                <ValidationObserver ref="form">
                  <form @submit.prevent="onSubmit">
                    <b-row id="row">
                      <b-form-group class="col-md-6" label="Cliente:" label-for="cliente">
                        <ValidationProvider name="Cliente" rules="required" v-slot="{ errors }">
                          <b-form-input
                            autocomplete="off"
                            readonly
                            v-model="client.name"
                            @click="getClient"
                            type="text"
                            :value="client.id"
                            placeholder="Cliente"
                            :class="(errors.length > 0 ? ' is-invalid' : '')"
                          ></b-form-input>
                          <div class="invalid-feedback">
                            <span>{{ errors[0] }}</span>
                          </div>
                        </ValidationProvider>
                      </b-form-group>
                      <b-form-group
                        class="col-md-6"
                        label="Modo de entrega:"
                        label-for="delivery"
                        lot-scope="{ valid, errors }">
                        <ValidationProvider
                          name="Modo de entrega"
                          rules="required"
                          v-slot="{ errors }">
                          <b-form-select
                            v-model="order.mode"
                            :state="errors[0] ? false : (order.mode ? true : null)"
                            :options="deliveryType"
                          ></b-form-select>
                          <div class="invalid-feedback">
                            <span>{{ errors[0] }}</span>
                          </div>
                        </ValidationProvider>
                      </b-form-group>
                      <b-form-group
                        class="col-md-6"
                        label="Tipo de compra:"
                        label-for="shopType"
                        lot-scope="{ valid, errors }"
                      >
                        <ValidationProvider
                          name="Tipo de compra"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <b-form-select
                            v-model="order.type"
                            :state="errors[0] ? false : (order.type ? true : null)"
                            :options="purchaseType"
                          ></b-form-select>
                          <div class="invalid-feedback">
                            <span>{{ errors[0] }}</span>
                          </div>
                        </ValidationProvider>
                      </b-form-group>
                      <b-form-group class="col-md-6" label="Fecha de entrega:" label-for="date">
                        <b-form-input
                          v-model="order.delivery_date"
                          type="date"
                          placeholder="Fecha de entrega"
                        ></b-form-input>
                      </b-form-group>
                      <b-form-group class="col-md-12">
                        <hr />
                      </b-form-group>
                      <b-form-group class="col-md-6" label="Dirección de entrega:" label-for="name">
                        <b-form-input
                          v-model="order.delivery_address"
                          type="text"
                          placeholder="Dirección de entrega"
                        ></b-form-input>
                      </b-form-group>
                      <b-form-group class="col-md-6" label="Destinatario:" label-for="name">
                        <b-form-input
                          v-model="order.addressee"
                          type="text"
                          placeholder="Destinatario"
                        ></b-form-input>
                      </b-form-group>
                      <b-form-group class="col-md-6" label="Firma del regalo:" label-for="name">
                        <b-form-input
                          v-model="order.signature"
                          type="text"
                          placeholder="Firma del regalo"
                        ></b-form-input>
                      </b-form-group>
                      <b-form-group
                        class="col-md-6"
                        label="Dedicatoria del regalo:"
                        label-for="dedication">
                        <b-form-input
                          v-model="order.dedication"
                          type="text"
                          placeholder="Dedicatoria del regalo">
                        </b-form-input>
                      </b-form-group>
                      <b-form-group
                        v-if="status === 'edit'"
                        class="col-md-6"
                        label="Status de la compra:"
                        label-for="statuses">
                          <b-form-select
                            v-model="order.status"
                            :options="statuses">
                          </b-form-select>
                      </b-form-group>
                    </b-row>
                  </form>
                </ValidationObserver>
              </tab-content>
              <!-- Tab Productos -->
              <tab-content title="Productos" icon="ti-package" :before-change="validateProducts">
                <div v-for="(p, index) in orderProducts" :key="p.id">
                  <b-row id="row" class="mb-2">
                    <b-col class="col-md-3">
                      <b-img
                        v-viewer="{movable: false}"
                        center
                        rounded="circle"
                        :src="p.image ? p.image : require(`@/assets/images/no-image.png`)"
                        id="image"
                        class
                      ></b-img>
                    </b-col>
                    <b-col class="col-md-7">
                      <h3 class="text-capitalize">{{ p.name }}</h3>
                      <p class="h5" id="price">{{ p.price }} $</p>
                      <h5>{{ p.note }}</h5>
                      <p class="h6 mt-3">Extras</p>
                      <b-button
                        v-for="item in p.additionals"
                        :key="item.id"
                        variant="outline-primary"
                        class="mb-3 mr-1 text-capitalize"
                        @click="deleteExtra(index, item.id)"
                      >
                        {{ item.name }}
                        <i class="ri-indeterminate-circle-line" v-if="status === 'add'"></i>
                      </b-button>
                      <b-button
                        variant="outline-success"
                        class="mb-3 mr-1"
                        @click="showModal('extras', index)"
                        v-if="status === 'add'">
                        Añadir
                        <i class="ri-add-line"></i>
                      </b-button>
                    </b-col>
                    <b-col class="col-md-2">
                      <b-button
                        v-b-tooltip.right="'Eliminar producto'"
                        size="lg"
                        variant="link"
                        @click="deleteProduct(p.id)"
                      >
                        <i class="ri-delete-back-2-fill ri-2x pr-0"></i>
                      </b-button>
                      <br />
                      <b-button
                        v-b-tooltip.right="'Agregar notas'"
                        size="lg"
                        variant="utline-link"
                        @click="showModalNote(index)"
                      >
                        <i class="ri-file-4-fill ri-2x pr-0"></i>
                      </b-button>
                    </b-col>
                  </b-row>
                </div>
                <b-row align-h="center">
                  <b-col class="col-md-8 text-center">
                    <b-button
                      @click="showModal('lista-productos')"
                      pill
                      variant="outline-link"
                      class="mb-3 mr-1"
                      v-if="status === 'add'">
                      <i class="ri-add-line"></i>
                      {{ buttonTitle }}
                    </b-button>
                  </b-col>
                </b-row>
              </tab-content>
              <!-- Tab Pago -->
              <tab-content title="Pago" icon="ti-credit-card" :before-change="validatePayment">
                <b-row align-h="center" id="row">
                  <div class="col-md-6">
                    <div v-for="item in payments" :key="item.id">
                      <b-form inline class="mb-2">
                        <b-form-checkbox
                          v-model="item.chekBox"
                          :name="item.payment_method"
                          class="mb-2 mr-sm-2 mb-sm-0"
                        >{{item.payment_method}}</b-form-checkbox>
                        <b-form-input v-money="money" v-if="item.chekBox" v-model="item.amount"></b-form-input>
                      </b-form>
                    </div>
                  </div>
                  <div class="col-md-3 text-right">
                    Total a pagar:
                    <label for class="success">{{finalPrice}}$</label>
                    <br />Pagado:
                    <label for :class="payOut > finalPrice ? 'error' : 'success' ">{{ payOut }}$</label>
                    <br />Restante:
                    <label for :class="rest > 0 ? 'success' : 'error' ">{{ rest }}$</label>
                  </div>
                </b-row>
              </tab-content>
            </form-wizard>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal ref="modal-note" ok-only id="modal-note" title="Añadir nota" @ok="addNote">
      <b-form-group class="col-md-12" label="Nota de regalo:" label-for="cliente">
        <b-form-input autocomplete="off" v-model="note" type="text"></b-form-input>
      </b-form-group>
    </b-modal>
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
        :items="principals"
        :titems="pTitles"
        v-on:add-item="addItem"
        v-on:delete-item="delItem"
      ></modal-table>
    </b-modal>
    <b-modal
      ref="extras"
      size="lg"
      id="extras"
      title="Lista de extras"
      cancel-title="Cancelar"
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
      @ok="handleOkExtra"
      @cancel="handleCancelExtra">
      <modal-table
        :items="additionals"
        :titems="pTitles"
        v-on:add-item="addItem"
        v-on:delete-item="delItem"
      ></modal-table>
    </b-modal>
    <b-modal
      ok-only
      ref="lista-clientes"
      size="lg"
      id="lista-clientes"
      title="Lista de clientes"
      ok-title="Cerrar"
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <modal-table :items="clients" :titems="cTitles" v-on:add-item="addClient"></modal-table>
    </b-modal>
    <!-- Final Order Modal -->
    <b-modal
      ok-only
      ref="modal-order"
      size="md"
      id="final-order"
      ok-title="Finalizar orden"
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
      @ok="finishOrder">
      <div class="p-3">
        <p class="h4 text-primary mb-4">Pedido #{{orderResponse.id}}</p>

        <p class="h5 text-secondary" v-if="status === 'add'">{{ order.client_name }} - {{ order.client_dni }}</p>
        <p class="h5 text-secondary" v-else>{{ order.client.name.substring(0,30) + '...' }} - {{ order.client.dni }}</p>

        <b-row class="mb-0" v-for="item in orderResponse.products" :key="item.id">
          <b-col class="col-md-10">
            <label for class="text-dark text-capitalize">{{ item.name }}</label>
          </b-col>
          <b-col class="col-md-2">
            <label for class="text-primary">1</label>
          </b-col>
        </b-row>

        <b-row class="mt-4"></b-row>

        <b-row v-for="item in orderResponse.payments" :key="item.id">
          <b-col class="col-md-10">
            <label for class="text-dark" v-if="item.amount > 0">{{ item.payment_method }}</label>
          </b-col>
          <b-col class="col-md-2">
            <label for class="text-primary" v-if="item.amount > 0">{{ item.amount }}$</label>
          </b-col>
        </b-row>

        <b-row class="mt-4"></b-row>

        <label for class="text-primary">Formulario de datos</label>
        <b-form-checkbox
          v-model="sendForm"
          name="sendForm"
          class="mb-2 mr-sm-2 mb-sm-0"
        >Enviar formulario por email</b-form-checkbox>
      </div>
    </b-modal>
  </b-container>
</template>
<script>
import { vito } from '../../config/pluginInit'
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import clientService from '@/services/client'
import productService from '@/services/product'
import orderService from '@/services/order'
import ModalTable from '@/components/Modals/ModalTable'
import { VMoney } from 'v-money'

export default {
  name: 'Order',
  directives: { money: VMoney },
  components: {
    FormWizard,
    TabContent,
    ModalTable
  },
  created () {
    const id = this.$route.params.id
    if (id) this.status = 'edit'
  },
  mounted () {
    vito.index()
    this.loading = true
    productService.getAll()
      .then(response => {
        const data = response.data
        data.map(r => {
          if (r.type === 'principal') {
            r.additionals = []
            r.note = ''
            r.isAddItem = false
            this.principals.push(r)
          }
          if (r.type === 'additional') {
            r.isAddItem = false
            this.additionals.push(r)
          }
        })
      })
      .finally(() => { this.loading = false })

    if (this.status === 'edit') {
      this.loading = true
      orderService.getById(this.$route.params.id)
        .then(response => {
          const data = response.data
          this.order = data
          this.payments = data.payments
          this.client = data.client
          this.orderProducts = data.products
        })
        .catch((error) => { console.log(error) })
        .finally(() => { this.loading = false })
    }
  },
  data () {
    return {
      status: 'add',
      orderResponse: [],
      sendForm: false,
      money: {},
      note: '',
      index: null,
      tabIndex: 0,
      validateMsg: '',
      loading: false,
      checkbox1: null,
      selectedType: null,
      selectedDelivery: null,
      client: {
        name: ''
      },
      order: {
        client_id: '',
        client_name: '',
        client_dni: '',
        delivery_date: '',
        type: null,
        mode: null,
        status: null,
        delivery_address: '',
        addressee: '',
        dedication: '',
        signature: '',
        products: [],
        payments: [],
        client: {
          name: '',
          dni: ''
        }
      },
      statuses: [
        { value: 'Creado', text: 'Creado' },
        { value: 'Pendiente', text: 'Pendiente' },
        { value: 'En confección', text: 'En confección' },
        { value: 'Confeccionado', text: 'Confeccionado' },
        { value: 'En camino a reparto', text: 'En camino a reparto' },
        { value: 'Entregado', text: 'Entregado' },
        { value: 'Cancelado', text: 'Cancelado' }
      ],
      product: {
        id: null,
        product_id: '',
        order_id: null,
        quantity: 1,
        note: '',
        price: null,
        image: '',
        additionals: []
      },
      additional: {
        id: null,
        order_product_id: null,
        quantity: '',
        name: '',
        product_id: '',
        type: ''
      },
      payments: [
        {
          payment_method: 'Efectivo',
          amount: 0,
          chekBox: false
        },
        {
          payment_method: 'Depósito',
          amount: 0,
          chekBox: false
        },
        {
          payment_method: 'Tarjeta de crédito',
          amount: 0,
          chekBox: false
        }
      ],
      orderProducts: [],
      paymentSelected: [],
      paymentOptions: [
        { text: 'Efectivo', value: 'Efectivo' },
        { text: 'Depósito', value: 'Depósito' },
        { text: 'Tarjeta de crédito', value: 'Tarjeta de crédito' }
      ],
      deliveryType: [
        { value: null, text: 'Seleccione modo de entrega' },
        { value: 'local', text: 'Local' },
        { value: 'delivery', text: 'Delivery' }
      ],
      purchaseType: [
        { value: null, text: 'Seleccione tipo de compra' },
        { value: 'local', text: 'Local' },
        { value: 'delivery', text: 'Delivery' },
        { value: 'web', text: 'Web' },
        { value: 'redes', text: 'Redes' },
        { value: 'otros', text: 'Otros' }
      ],
      tempProd: [],
      tempExtra: [],
      clients: [],
      cTitles: [
        { label: 'Nombre', key: 'name', class: 'text-center', sortable: true },
        { label: 'Teléfono', key: 'phone', class: 'text-center', sortable: true },
        { label: 'Acción', key: 'action', class: 'text-center' }
      ],
      principals: [],
      additionals: [],
      pTitles: [
        { label: 'Id', key: 'id', class: 'text-center', sortable: true },
        { label: 'Foto', key: 'image', class: 'text-center', sortable: true },
        { label: 'Nombre', key: 'name', class: 'text-center', sortable: true },
        { label: 'Acción', key: 'action', class: 'text-center' }
      ]
    }
  },
  computed: {
    finalPrice () {
      // Total a pagar
      let price = 0
      let products = this.order.products
      for (const key in products) {
        if (products.hasOwnProperty(key)) {
          const element = products[key]
          price += element.price
        }
      }
      return parseFloat(price).toFixed(2)
    },
    payOut () {
      const object = this.payments
      let amount = 0
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          const element = object[key]
          if (!element.chekBox) { element.amount = 0 }
          amount += parseFloat(element.amount)
        }
      }
      return amount
    },
    rest () {
      const amount = this.finalPrice - this.payOut
      return parseFloat(amount).toFixed(2)
    },
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
    addClient (item) {
      this.client = item
      this.order.client_id = item.id
      this.order.client_dni = item.dni
      this.order.client_name = item.name
      this.$refs['lista-clientes'].hide()
    },
    addItem (item) {
      if (item.type === 'principal') {
        this.tempProd.push(item)
      } else {
        this.tempExtra.push(item)
      }
    },
    addNote () {
      this.orderProducts[this.index].note = this.note
    },
    delItem (id) {
      this.tempProd = this.tempProd.filter(x => x.id !== id)
    },
    deleteProduct (id) {
      this.orderProducts = this.orderProducts.filter(x => x.id !== id)
      this.principals.map(r => {
        if (r.id === id) {
          r.isAddItem = false
          r.additionals.length = 0
        }
      })
    },
    deleteExtra (index, id) {
      if (this.status === 'add') {
        this.orderProducts[index].additionals = this.orderProducts[index].additionals.filter(x => x.id !== id)
      }
    },
    getClient () {
      if (this.clients.length === 0) {
        this.loading = true
        clientService.getAll()
          .then(response => {
            this.clients = response.data
            this.$refs['lista-clientes'].show()
          })
          .catch((error) => { console.log(error) })
          .finally(() => { this.loading = false })
      } else {
        this.clients.map(r => {
          if (r.isAddItem) { r.isAddItem = false }
        })
        this.$refs['lista-clientes'].show()
      }
    },
    handleOk () {
      if (this.status === 'add') {
        if (this.tempProd.length > 0) {
          for (const key in this.tempProd) {
            if (this.tempProd.hasOwnProperty(key)) {
              const element = this.tempProd[key]
              this.orderProducts.push(element)
            }
          }
        }
      }

      if (this.status === 'edit') {

      }
      this.tempProd.length = 0
    },
    handleCancel () {
      if (this.orderProducts.length === 0) {
        this.principals.map(r => { r.isAddItem = false })
      }
      if (this.tempProd.length > 0) {
        this.principals.map(r => {
          this.tempProd.map(x => {
            if (r.id === x.id) { r.isAddItem = false }
          })
        })
      }
      this.tempProd.length = 0
    },
    handleOkExtra () {
      if (this.tempExtra.length > 0) {
        for (const key in this.tempExtra) {
          if (this.tempExtra.hasOwnProperty(key)) {
            const element = this.tempExtra[key]
            this.orderProducts[this.index].additionals.push(element)
          }
        }
      } else {
        this.orderProducts[this.index].additionals.length = 0
      }
      this.tempExtra.length = 0
      this.resetAdditionals()
    },
    handleCancelExtra () {
      if (this.orderProducts[this.index].additionals.length === 0) {
        this.additionals.map(r => { r.isAddItem = false })
      }
      if (this.tempExtra.length > 0) {
        let object = []
        object = this.orderProducts[this.index].additionals
        for (const key in object) {
          if (object.hasOwnProperty(key)) {
            const element = object[key]
            this.additionals.map(r => {
              if (r.id === element.id) { r.isAddItem = false }
            })
          }
        }
      }
      this.tempExtra.length = 0
    },
    resetAdditionals () {
      this.additionals.map(r => {
        if (r.isAddItem) { r.isAddItem = false }
      })
    },
    showModalNote (index) {
      this.index = index
      this.$refs['modal-note'].show()
    },
    onComplete () {
      this.loading = true
      if (this.status === 'add') {
        orderService.create(this.order)
          .then(response => {
            this.orderResponse = response.data
            this.$refs['modal-order'].show()
          })
          .catch(error => { console.log(error) })
          .finally(() => { this.loading = false })
      }
      if (this.status === 'edit') {
        orderService.update(this.order.id, this.order)
          .then(response => {
            this.orderResponse = response.data
            this.$refs['modal-order'].show()
          })
          .catch(error => { console.log(error) })
          .finally(() => { this.loading = false })
      }
    },
    showModal (modal, index) {
      this.index = index
      this.updateAdditonals()
      this.$refs[modal].show()
    },
    tabChange (prevIndex, nextIndex) {
      this.tabIndex = nextIndex
    },
    updateAdditonals () {
      if (this.orderProducts[this.index] !== undefined) {
        let extras = this.additionals
        let object = this.orderProducts[this.index].additionals
        for (const key in object) {
          if (object.hasOwnProperty(key)) {
            const element = object[key]
            extras.map(r => {
              if (r.id === element.id) {
                r.isAddItem = true
              } else {
                r.isAddItem = false
              }
            })
          }
        }
        this.additionals = extras.slice()
        extras.length = 0
        object.length = 0
      }
    },
    validateOrder () {
      return this.$refs.form.validate().then(success => {
        return success
      })
    },
    validateProducts () {
      if (this.orderProducts.length === 0) {
        this.validateMsg = 'Debe agregar al menos un producto antes de continuar'
        return false
      }

      this.validateMsg = ''

      if (this.status === 'add') {
        this.order.products.length = 0

        for (const key in this.orderProducts) {
          if (this.orderProducts.hasOwnProperty(key)) {
            const element = this.orderProducts[key]
            this.product = {}
            this.product.product_id = element.id
            this.product.name = element.name
            this.product.note = element.note
            this.product.image = element.image
            this.product.price = element.price
            this.product.quantity = 1
            this.product.additionals = []
            for (const key in element.additionals) {
              if (element.additionals.hasOwnProperty(key)) {
                const item = element.additionals[key]
                this.additional = {}
                this.additional.product_id = item.id
                this.additional.name = item.name
                this.additional.quantity = '1'
                this.additional.type = 'extra'
                this.product.additionals.push(this.additional)
              }
            }
            this.order.products.push(this.product)
          }
        }
      }

      return true
    },
    validatePayment () {
      if (this.rest < 0) {
        return false
      }
      this.order.payments = this.payments
      return true
    },
    finishOrder () {
      this.$router.push({ name: 'orders.list' })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import url('https://rawgit.com/lykmapipo/themify-icons/master/css/themify-icons.css');

#row {
  border: 1px solid black;
  border-radius: 7px;
  padding: 20px;
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
  font-weight: 300;
}

.error {
  color: var(--pa-danger);
}

.success {
  color: var(--pa-light-blue);
}
</style>
