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
                <b-spinner
                  variant="primary"
                  type="grow"
                  label="Spinning"
                  style="width: 3rem; height: 3rem;"
                ></b-spinner>
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
                            :options="deliveryType">
                          </b-form-select>
                          <div class="invalid-feedback">
                            <span>{{ errors[0] }}</span>
                          </div>
                        </ValidationProvider>
                      </b-form-group>
                      <b-form-group
                        class="col-md-6"
                        label="Tipo de compra:"
                        label-for="shopType"
                        lot-scope="{ valid, errors }">
                        <ValidationProvider
                          name="Tipo de compra"
                          rules="required"
                          v-slot="{ errors }">
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
                          placeholder="Dirección de entrega">
                        </b-form-input>
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
                          placeholder="Dedicatoria del regalo"
                        ></b-form-input>
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
                            v-for="item in p.additionals" :key="item.product_id"
                            variant="outline-primary"
                            class="mb-3 mr-1 text-capitalize"
                            @click="deleteExtra(index, item.product_id)">
                              {{ item.name }}
                            <i class="ri-indeterminate-circle-line"></i>
                          </b-button>
                        <b-button variant="outline-success" class="mb-3 mr-1" @click="showModal('extras', index)">
                          Añadir
                          <i class="ri-add-line"></i>
                        </b-button>
                      </b-col>
                      <b-col class="col-md-2">
                        <b-button
                          v-b-tooltip.right="'Eliminar producto'"
                          size="lg"
                          variant="link"
                          @click="deleteProduct(p.product_id)">
                          <i class="ri-delete-back-2-fill ri-2x pr-0"></i>
                        </b-button>
                        <br>
                        <b-button
                          v-b-tooltip.right="'Agregar notas'"
                          size="lg"
                          variant="utline-link"
                          @click="showModalNote(index)">
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
                    >
                      <i class="ri-add-line"></i>
                      {{ buttonTitle }}
                    </b-button>
                  </b-col>
                </b-row>
              </tab-content>
              <!-- Tab Pago -->
              <tab-content title="Pago" icon="ti-credit-card">
                <b-row align-h="center" id="row">
                  <div class="col-md-6">
                    <div v-for="item in paymentMethods" :key="item.id">
                      <b-form inline class="mb-2">
                        <b-form-checkbox v-model="item.chekBox" :name="item.payment_method" class="mb-2 mr-sm-2 mb-sm-0">
                          {{item.payment_method}}
                        </b-form-checkbox>
                        <b-form-input v-money="money" v-if="item.chekBox" v-model="item.amount"></b-form-input>
                      </b-form>
                    </div>

                    <!-- <b-form inline class="mb-2">
                      <b-form-checkbox v-model="efectivoCB" name="efectivo" class="mb-2 mr-sm-2 mb-sm-0">Efectivo</b-form-checkbox>
                      <b-form-input v-money="money" v-if="efectivoCB" v-model="paymentMethods[0].amount"></b-form-input>
                    </b-form>
                    <b-form inline class="mb-2">
                      <b-form-checkbox v-model="depositoCB" name="deposito" class="mb-2 mr-sm-2 mb-sm-0">Depósito</b-form-checkbox>
                      <b-form-input v-money="money" v-if="depositoCB" v-model="paymentMethods[1].amount"></b-form-input>
                    </b-form>
                    <b-form inline>
                      <b-form-checkbox v-model="tarjetaCB" name="tarjeta" class="mb-2 mr-sm-2 mb-sm-0">Tarjeta de crédito</b-form-checkbox>
                      <b-form-input v-money="money" v-if="tarjetaCB" v-model="paymentMethods[2].amount"></b-form-input>
                    </b-form> -->
                  </div>
                  <div class="col-md-3 text-right">
                    Total a pagar: {{finalPrice}}$ <br>
                    Pagado: {{ payOut }} $  <br>
                    Restante: 0$

                  </div>
                </b-row>
              </tab-content>
            </form-wizard>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal
      ref="modal-note"
      ok-only
      id="modal-note"
      title="Añadir nota"
      @ok="addNote">
      <b-form-group class="col-md-12" label="Nota de regalo:" label-for="cliente">
        <b-form-input
          autocomplete="off"
          v-model="note"
          type="text">
        </b-form-input>
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
      @cancel="handleCancel">
      <modal-table :items="clients" :titems="cTitles" v-on:add-item="addClient"></modal-table>
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
import { VMoney } from 'v-money'

export default {
  name: 'Order',
  directives: { money: VMoney },
  components: {
    FormWizard,
    TabContent,
    ModalTable
  },
  mounted () {
    vito.index()
    this.loading = true
    productService.getAll()
      .then(response => {
        const data = response.data
        data.map(r => {
          if (r.type === 'principal') {
            r.extras = []
            r.note = ''
            this.principals.push(r)
          }
          if (r.type === 'additional') {
            this.additionals.push(r)
          }
        })
      })
      .catch(error => { console.log(error) })
      .finally(() => { this.loading = false })
  },
  data () {
    return {
      money: {},
      note: '',
      index: null,
      tabIndex: 0,
      validateMsg: '',
      loading: false,
      checkbox1: null,
      selectedType: null,
      selectedDelivery: null,
      client: { },
      order: {
        client_id: '',
        delivery_date: '',
        type: null,
        mode: null,
        delivery_address: '',
        addressee: '',
        dedication: '',
        signature: '',
        products: [],
        paymentMethods: []
      },
      product: {
        product_id: '',
        quantity: 0,
        note: '',
        price: null,
        image: '',
        additionals: []
      },
      additional: {
        quantity: '',
        name: '',
        product_id: '',
        type: ''
      },
      paymentMethods: [
        {
          payment_method: 'Efectivo',
          amount: 0,
          chekBox: ''
        },
        {
          payment_method: 'Depósito',
          amount: 0,
          chekBox: ''
        },
        {
          payment_method: 'Tarjeta de crédito',
          amount: 0,
          chekBox: ''
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
        { label: 'Cantidad', key: 'quantity', class: 'text-center', sortable: true },
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
      return price
    },
    payOut () {
      let amount = 0
      let payment = this.paymentMethods
      for (const key in payment) {
        if (payment.hasOwnProperty(key)) {
          const element = payment[key]
          console.log(key, element.amount, typeof element.amount)
          amount += parseFloat(element.amount).toFixed(2)
        }
      }
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
    addNote () {
      this.orderProducts[this.index].note = this.note
      this.note = ''
    },
    showModalNote (index) {
      this.index = index
      this.$refs['modal-note'].show()
    },
    deleteProduct (id) {
      this.orderProducts = this.orderProducts.filter(x => x.product_id !== id)
      this.principals.map(r => {
        if (r.isAddItem) {
          r.isAddItem = false
          r.extras.length = 0
        }
      })
    },
    deleteExtra (index, id) {
      this.orderProducts[index].extras = this.orderProducts[index].extras.filter(x => x.id !== id)
    },
    showModal (modal, index) {
      this.index = index
      this.$refs[modal].show()
    },
    onComplete () {
      alert('Yay. Done!')
    },
    tabChange (prevIndex, nextIndex) {
      this.tabIndex = nextIndex
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
    addClient (item) {
      this.client = item
      this.order.client_id = item.id
      this.$refs['lista-clientes'].hide()
    },
    addItem (item) {
      this.product = {}
      this.additional = {}
      if (item.type === 'principal') {
        this.product.product_id = item.id
        this.product.name = item.name
        this.product.note = item.note
        this.product.image = item.image
        this.product.price = item.price
        this.product.additionals = []
        this.tempProd.push(this.product)
      } else {
        this.additional.product_id = item.id
        this.additional.name = item.name
        this.additional.quantity = '1'
        this.additional.type = 'extra'
        this.tempExtra.push(this.additional)
      }
    },
    delItem (id) {
      let prods = this.tempProd.filter(x => x.id !== id)
      this.tempProd = prods
    },
    handleOkExtra () {
      if (this.tempExtra.length > 0) {
        for (const key in this.tempExtra) {
          if (this.tempExtra.hasOwnProperty(key)) {
            const element = this.tempExtra[key]
            this.orderProducts[this.index].additionals.push(element)
            console.log(this.orderProducts[this.index])
          }
        }
      }
      this.tempExtra.length = 0
    },
    handleCancelExtra () {

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
      if (this.orderProducts.length === 0) {
        this.principals.map(r => { r.isAddItem = false })
      } else {

      }
    },
    validateOrder () {
      return true
      // return this.$refs.form.validate().then(success => {
      //   return success
      // })
    },
    validateProducts () {
      // return true
      if (this.orderProducts.length === 0) {
        this.validateMsg = 'Debe agregar al menos un producto antes de continuar'
        return false
      }
      this.validateMsg = ''
      this.order.products = this.orderProducts
      return true
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
</style>
