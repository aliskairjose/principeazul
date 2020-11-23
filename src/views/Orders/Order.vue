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
                  style="width: 3rem; height: 3rem"
                ></b-spinner>
              </div>
            </b-row>
            <form-wizard
              ref="wizard"
              @on-complete="onComplete"
              @on-change="tabChange"
              title
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
                :before-change="validateOrder"
              >
                <ValidationObserver ref="form">
                  <form @submit.prevent="onSubmit">
                    <b-row id="row">
                      <!-- Cliente -->
                      <b-form-group
                        class="col-md-6"
                        label="Cliente:"
                        label-for="cliente"
                      >
                        <ValidationProvider
                          name="Cliente"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <b-input-group>
                            <b-form-input
                              autocomplete="off"
                              readonly
                              v-model="client.name"
                              @click="getClient"
                              type="text"
                              placeholder="Cliente"
                              :value="client.id"
                              :class="errors.length > 0 ? ' is-invalid' : ''"
                            ></b-form-input>
                            <b-input-group-append is-text>
                              <b-button
                                size="sm"
                                variant="outline"
                                @click="showClientModal"
                              >
                                <b-icon
                                  icon="person-plus-fill"
                                  aria-label="Help"
                                ></b-icon>
                              </b-button>
                            </b-input-group-append>
                          </b-input-group>
                          <div class="invalid-feedback">
                            <span>{{ errors[0] }}</span>
                          </div>
                        </ValidationProvider>
                      </b-form-group>
                      <!-- Fecha de entrega -->
                      <b-form-group
                        class="col-md-6"
                        label="Fecha de entrega:"
                        label-for="date"
                      >
                        <ValidationProvider
                          name="Fecha de entrega"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <b-form-datepicker
                            v-model="order.delivery_date"
                            :value="client.delivery_date"
                            :class="errors.length > 0 ? ' is-invalid' : ''"
                            placeholder="Fecha de entrega"
                          ></b-form-datepicker>
                          <div class="invalid-feedback">
                            <span>{{ errors[0] }}</span>
                          </div>
                        </ValidationProvider>
                      </b-form-group>
                      <!-- Tipo de compra -->
                      <b-form-group
                        class="col-md-6"
                        label="Tipo de compra:"
                        label-for="shopType"
                      >
                        <b-form-select
                          v-model="order.type"
                          :options="purchaseType"
                        ></b-form-select>
                      </b-form-group>
                      <!-- Modo de entrega -->
                      <b-form-group
                        class="col-md-6"
                        label="Modo de entrega:"
                        label-for="delivery"
                      >
                        <ValidationProvider
                          name="Modo de entrega"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <b-form-select
                            v-model="order.mode"
                            :options="deliveryType"
                            @change="onModeChange"
                            :class="errors.length > 0 ? ' is-invalid' : ''"
                          ></b-form-select>
                          <div class="invalid-feedback">
                            <span>{{ errors[0] }}</span>
                          </div>
                        </ValidationProvider>
                      </b-form-group>
                      <!-- Zona de entrega -->
                      <b-form-group
                        class="col-md-6"
                        label="Zona de entrega:"
                        label-for="delivery"
                      >
                        <b-form-select
                          :disabled="order.mode !== 'delivery'"
                          v-model="order.delivery_zone_id"
                          :options="deliveryZones"
                          @change="deliveryCostChange"
                        ></b-form-select>
                      </b-form-group>

                      <!-- Turnos -->
                      <b-form-group
                        class="col-md-6"
                        label="Turno:"
                        label-for="turn"
                      >
                        <b-form-select
                          v-model="order.turn"
                          :options="turns"
                        ></b-form-select>
                      </b-form-group>

                      <b-form-group class="col-md-12">
                        <hr />
                      </b-form-group>

                      <!-- Direccion -->
                      <b-form-group
                        class="col-md-6"
                        label="Dirección de entrega:"
                        label-for="name"
                      >
                        <b-form-textarea
                          v-model="order.delivery_address"
                          placeholder="Dirección de entrega"
                          rows="3"
                          max-rows="6"
                        ></b-form-textarea>
                      </b-form-group>

                      <!-- Dedicatoria -->
                      <b-form-group
                        class="col-md-6"
                        label="Dedicatoria del arreglo:"
                        label-for="dedication"
                      >
                        <b-form-textarea
                          v-model="order.dedication"
                          placeholder="Dedicatoria del arreglo"
                          rows="3"
                          max-rows="6"
                        ></b-form-textarea>
                      </b-form-group>

                      <!-- Persona quien recibe -->
                      <b-form-group
                        class="col-md-6"
                        label="Persona que recibe:"
                        label-for="name"
                      >
                        <b-form-input
                          v-model="order.addressee"
                          type="text"
                          placeholder="Persona que recibe"
                        ></b-form-input>
                      </b-form-group>

                      <!-- Motivo -->
                      <b-form-group
                        class="col-md-6"
                        label="Motivo:"
                        label-for="delivery"
                      >
                        <b-form-select
                          v-model="order.reason"
                          :options="reasons"
                        ></b-form-select>
                      </b-form-group>
                      <!-- Phone number -->
                      <b-form-group
                        class="col-md-6"
                        label="Teléfono:"
                        label-for="phone"
                      >
                        <b-form-input
                          v-model="order.phone"
                          type="tel"
                          name="phone"
                          id="phone"
                          placeholder="Teléfono"
                          v-mask="['###-####', '####-####']"
                        ></b-form-input>
                      </b-form-group>
                      <!-- Columna vacia -->
                      <b-form-group class="col-md-6"></b-form-group>
                      <!-- Status de la compra -->
                      <b-form-group
                        v-if="status === 'edit'"
                        class="col-md-6"
                        label="Status de la compra:"
                        label-for="statuses"
                      >
                        <b-form-select
                          :disabled="
                            order.status === 'Entregado' ||
                            order.status === 'Cancelado'
                          "
                          v-model="order.status"
                          :options="statuses"
                        ></b-form-select>
                      </b-form-group>
                    </b-row>
                  </form>
                </ValidationObserver>
              </tab-content>
              <!-- Tab Productos -->
              <tab-content
                title="Productos"
                icon="ti-package"
                :before-change="validateProducts"
              >
                <div v-for="(p, index) in orderProducts" :key="index">
                  <b-row id="row" class="mb-2">
                    <b-col class="col-md-3">
                      <b-img
                        v-viewer="{ movable: false }"
                        center
                        rounded="circle"
                        :src="
                          p.image
                            ? p.image
                            : require(`@/assets/images/no-image.png`)
                        "
                        id="image"
                      ></b-img>
                    </b-col>
                    <b-col class="col-md-6">
                      <h5 class="text-capitalize">{{ p.name }}</h5>
                      <p class="h6" id="price" v-if="p.tax !== 0">
                        {{ (p.price + (p.price * p.tax) / 100) | money }}
                      </p>
                      <p class="h6" id="price" v-else>{{ p.price | money }}</p>
                      <h6>
                        Nota de taller: <strong>{{ p.note }}</strong>
                      </h6>
                      <h6>
                        Nota de diseño: <strong>{{ p.note_design }}</strong>
                      </h6>
                      <h6 v-if="p.personalized">
                        Texto personalizado: {{ p.personalized_text }}
                      </h6>
                      <p class="mt-2">Extras</p>
                      <b-button
                        v-for="(item, indice) in p.additionals"
                        :key="indice"
                        variant="primary"
                        class="mb-3 mr-1 text-capitalize"
                        @click="deleteExtra(index, indice)"
                      >
                        {{ item.name }} x {{ item.quantity }}
                        <i
                          class="ri-indeterminate-circle-line"
                          v-if="status === 'add'"
                        ></i>
                      </b-button>
                      <b-button
                        variant="success"
                        class="mb-3 mr-1"
                        @click="showModal('extras', index)"
                        v-if="status === 'add'"
                      >
                        Añadir
                        <i class="ri-add-line"></i>
                      </b-button>
                    </b-col>
                    <b-col class="col-md-3">
                      <b-button
                        v-b-tooltip.right="'Eliminar producto'"
                        size="sm"
                        variant="link"
                        @click="deleteProduct(index)"
                      >
                        <i class="ri-delete-back-2-fill ri-lg pr-0"></i>
                      </b-button>
                      <br />
                      <b-button
                        v-b-tooltip.right="'Agregar notas'"
                        size="sm"
                        variant="outline-link"
                        @click="showModalNote(index)"
                      >
                        <i class="ri-file-4-fill ri-lg pr-0"></i>
                      </b-button>
                      <br />
                      <b-button
                        v-b-tooltip.right="'Agregar notas de diseño'"
                        size="sm"
                        variant="link"
                        @click="showModalDesignNote(index)"
                      >
                        <i class="ri-file-4-fill ri-lg pr-0"></i>
                      </b-button>
                      <br />
                      <b-button
                        class="btn-link-personlized"
                        v-if="p.personalized"
                        v-b-tooltip.right="'Añadir texto Personalizado'"
                        size="sm"
                        variant="link"
                        @click="showPersonalizedText(index)"
                      >
                        <i class="ri-file-4-fill ri-lg pr-0"></i>
                      </b-button>
                    </b-col>
                  </b-row>
                </div>
                <b-row align-h="center">
                  <b-col class="col-md-8 text-center">
                    <b-button
                      @click="showModal('lista-productos')"
                      pill
                      variant="outline-secondary"
                      class="mb-3 pr-5 pl-5"
                      v-if="status === 'add'"
                    >
                      <i class="ri-add-line"></i>
                      {{ buttonTitle }}
                    </b-button>
                  </b-col>
                </b-row>
              </tab-content>
              <!-- Tab Pago -->
              <tab-content
                title="Pago"
                icon="ti-credit-card"
                :before-change="validatePayment"
              >
                <b-row align-h="center" id="row">
                  <div class="col-md-6">
                    <div v-for="item in payments" :key="item.id">
                      <b-form inline class="mb-2">
                        <b-form-checkbox
                          v-model="item.checkBox"
                          :name="item.payment_method"
                          class="mb-2 mr-sm-2 mb-sm-0"
                          >{{ item.payment_method }}</b-form-checkbox
                        >
                        <b-form-input
                          v-money="money"
                          v-show="item.checkBox"
                          v-model="item.amount"
                        ></b-form-input>
                      </b-form>
                    </div>
                    <b-form-group
                      class="col-md-6"
                      label="Descuento"
                      label-for="cliente"
                    >
                      <b-form-input
                        id="discount"
                        autocomplete="off"
                        v-model="order.discount"
                        type="text"
                        v-money="money"
                        placeholder="Descuento"
                      ></b-form-input>
                    </b-form-group>
                  </div>
                  <div class="col-md-3 text-right">
                    ITMS:
                    <label for class="success">{{ itms | money }}</label>
                    <br />
                    Monto a pagar:
                    <label for class="success">{{ amount | money }}</label>
                    <br />
                    Monto delivery:<label for class="success">{{
                      deliveryCost | money
                    }}</label>
                    <br />
                    Monto descuento:<label for class="success">{{
                      order.discount | money
                    }}</label>
                    <br />
                    Total a pagar:<label for class="success">{{
                      finalPrice | money
                    }}</label>
                    <br />
                    Pagado:<label
                      :class="payOut > finalPrice ? 'error' : 'success'"
                      >{{ payOut | money }}</label
                    >
                    <br />
                    Restante:<label
                      for
                      :class="rest > 0 ? 'success' : 'error'"
                      >{{ rest | money }}</label
                    >
                  </div>
                </b-row>
              </tab-content>
            </form-wizard>
          </template>
        </iq-card>
      </b-col>
    </b-row>

    <!-- Modal Nota -->
    <b-modal
      ref="modal-note"
      ok-only
      id="modal-note"
      title="Añadir nota"
      @ok="addNote"
    >
      <b-form-group
        class="col-md-12"
        label="Nota de taller:"
        label-for="cliente"
      >
        <b-form-textarea v-model="note" rows="3" max-rows="6"></b-form-textarea>
      </b-form-group>
    </b-modal>
    <!-- Modal Texto Personalizado -->
    <b-modal
      ref="modal-personalized"
      ok-only
      id="modal-personalized"
      title="Texto personalizado"
      @ok="addPersonalizedNote"
    >
      <b-form-group
        class="col-md-12"
        label="Texto personalizado:"
        label-for="cliente"
      >
        <b-form-textarea
          v-model="personalized_text"
          rows="3"
          max-rows="6"
        ></b-form-textarea>
      </b-form-group>
    </b-modal>
    <!-- Modal Nota de diseño -->
    <b-modal
      ref="modal-design-note"
      ok-only
      id="modal-design-note"
      title="Añadir nota dieño"
      @ok="addDesignNote"
    >
      <b-form-group class="col-md-12" label="Nota de diseño:">
        <b-form-textarea
          v-model="note_design"
          rows="3"
          max-rows="6"
        ></b-form-textarea>
      </b-form-group>
    </b-modal>

    <!-- Modal nuevo cliente -->
    <b-modal
      ref="modal-client"
      size="lg"
      id="lista-productos"
      title="Lista de productos"
      ok-only
      ok-title="Cerrar"
      no-close-on-esc
      no-close-on-backdrop
    >
      <client is-modal @new-client="client = $event"></client>
    </b-modal>

    <!-- Modal productos Principales -->
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
      @cancel="handleCancel"
    >
      <modal-table
        read-only
        :items="principals"
        :titems="pTitles"
        v-on:add-item="addItem"
        v-on:delete-item="delItem"
      ></modal-table>
    </b-modal>

    <!-- Modal extras  -->
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
      @cancel="handleCancelExtra"
    >
      <modal-table
        :items="additionals"
        :titems="eTitles"
        v-on:add-item="addItem"
        v-on:delete-item="delItem"
      ></modal-table>
    </b-modal>

    <!-- Modal Lista de Clientes -->
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
      <modal-table
        :items="clients"
        :titems="cTitles"
        v-on:add-item="addClient"
      ></modal-table>
    </b-modal>

    <!-- Final Order Modal -->
    <b-modal
      ok-only
      ref="modal-order"
      size="lg"
      id="final-order"
      ok-title="Finalizar orden"
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
      @ok="finishOrder"
    >
      <OrderDetailComponent
        :dataId="orderResponse.id"
        :idList="ids"
        :enableButtons="false"
      >
        <h5 class="mt-3">Formulario de datos</h5>

        <b-row>
          <b-col md="10">
            <a :href="url">{{ url }}</a>
          </b-col>
          <b-col md="2">
            <b-button
              v-b-tooltip.top="'Copiar'"
              variant="link"
              class="mb-3 mr-1"
              v-clipboard:copy="url"
            >
              <i class="ri-file-copy-line pr-0"></i>
            </b-button>
          </b-col>
        </b-row>

        <b-form-checkbox
          v-model="sendForm"
          name="sendForm"
          class="mb-2 mr-sm-2 mb-sm-0"
          >Enviar formulario por email</b-form-checkbox
        >
      </OrderDetailComponent>
    </b-modal>
  </b-container>
</template>
<script>
import { vito } from '../../config/pluginInit'
import { mask } from 'vue-the-mask'
import { FormWizard, TabContent } from 'vue-form-wizard'
import clientService from '@/services/client'
import productService from '@/services/product'
import generalService from '@/services/general'
import orderService from '@/services/order'
import ModalTable from '@/components/Modals/ModalTable'
import OrderDetailComponent from '@/components/Order/OrderDetailComponent'
import Client from '@/views/Clients/Client'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

import { VMoney } from 'v-money'

export default {
  name: 'Order',
  directives: { money: VMoney, mask },

  components: {
    FormWizard,
    TabContent,
    ModalTable,
    OrderDetailComponent,
    Client
  },
  created () {
    const id = this.$route.params.id
    if (id) this.status = 'edit'
  },
  mounted () {
    vito.index()
    this.loading = true
    generalService.paymentMethods()
      .then(response => {
        const object = response.data
        const list = []
        for (const iterator of object) {
          this.payment = {}
          this.$set(this.payment, 'payment_method', iterator)
          this.$set(this.payment, 'amount', 0)
          list.push(this.payment)
        }
        this.payments = [ ...list ]
      })
    generalService.reasons()
      .then(response => {
        const object = response.data
        this.reason.text = 'Seleccione un motivo'
        this.reason.value = null
        this.reasons.push(this.reason)
        for (const iterator of object) {
          this.reason = {}
          this.reason.value = iterator
          this.reason.text = iterator
          this.reasons.push(this.reason)
        }
      })

    generalService.turns()
      .then(response => {
        const object = response.data
        this.turn.text = 'Seleccione un turno'
        this.turn.value = null
        this.turns.push(this.turn)
        for (const iterator of object) {
          this.turn = {}
          this.turn.value = iterator
          this.turn.text = iterator
          this.turns.push(this.turn)
        }
      })

    generalService.deliveryZones()
      .then(response => {
        const data = response.data
        this.deliveryZone.value = null
        this.deliveryZone.text = 'Seleccione una zona'
        this.deliveryZone.price = 0
        this.deliveryZones.push(this.deliveryZone)

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const element = data[key]
            this.deliveryZone = {}
            this.deliveryZone.value = element.id
            this.deliveryZone.text = `${element.name} - $${element.price}`
            this.deliveryZone.price = element.price
            this.deliveryZones.push(this.deliveryZone)
          }
        }
      })

    generalService.orderStatus()
      .then(response => {
        const object = response.data
        for (const iterator of object) {
          let status = {}
          status.value = iterator
          status.text = iterator
          this.statuses.push(status)
        }
      })

    clientService.getAll()
      .then(response => {
        this.clients = response.data
      })

    productService.getAll()
      .then(response => {
        const data = response.data
        data.map(r => {
          if (r.type === 'principal') {
            r.additionals = []
            r.note = ''
            r.note_design = ''
            r.personalized_text = ''
            r.quantity = 1
            this.principals.push(r)
          }
          if (r.type === 'additional') {
            r.isAddItem = false
            r.quantity = 1
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
          const value = this.order.delivery_date
          this.order.delivery_date = value.slice(0, value.indexOf(' '))

          this.payments = data.payments
          this.client = data.client
          this.orderProducts = data.products
        })
        .catch((error) => { console.error(error) })
        .finally(() => { this.loading = false })
    }
  },
  data () {
    return {
      deliveryCost: 0,
      percent: null,
      deliveryPrice: 0,
      deliveryTime: '00:00:00',
      reasons: [],
      reason: {},
      turns: [],
      turn: {},
      ids: [],
      status: 'add',
      orderResponse: [],
      sendForm: false,
      money: {},
      note: '',
      note_design: '',
      personalized_text: '',
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
        id: '',
        phone: null,
        delivery_zone_id: null,
        client_id: '',
        client_name: '',
        client_dni: '',
        delivery_date: '',
        type: null,
        mode: null,
        status: null,
        reason: null,
        turn: null,
        discount: 0,
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
      statuses: [],
      product: {
        id: null,
        personalized_text: '',
        product_id: '',
        order_id: null,
        quantity: 1,
        note: '',
        note_design: '',
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
      deliveryZone: {},
      deliveryZones: [],
      payments: [],
      payment: {
        payment_method: '',
        amount: 0,
        checkBox: false
      },
      orderProducts: [],
      paymentSelected: [],
      paymentOptions: [
        { text: 'Efectivo', value: 'Efectivo' },
        { text: 'Depósito', value: 'Depósito' },
        { text: 'Tarjeta de crédito', value: 'Tarjeta de crédito' }
      ],
      deliveryType: [
        { value: null, text: 'Seleccione modo de entrega' },
        { value: 'pedidosya', text: 'PedidosYa' },
        { value: 'delivery', text: 'Delivery' },
        { value: 'local', text: 'Local' }
      ],
      purchaseType: [
        { value: null, text: 'Seleccione tipo de compra' },
        { value: 'whatsapp', text: 'WhatsApp' },
        { value: 'tienda', text: 'Tienda' },
        { value: 'paginaweb', text: 'Pagina Web' },
        { value: 'instagram', text: 'Instagram' },
        { value: 'pedidosya', text: 'PedidosYa' }
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
        // { label: 'Cantidad', key: 'quantity', class: 'text-center', sortable: true },
        { label: 'Acción', key: 'action', class: 'text-center' }
      ],
      eTitles: [
        { label: 'Id', key: 'id', class: 'text-center', sortable: true },
        { label: 'Foto', key: 'image', class: 'text-center', sortable: true },
        { label: 'Nombre', key: 'name', class: 'text-center', sortable: true },
        { label: 'Cantidad', key: 'quantity', class: 'text-center', sortable: true },
        { label: 'Acción', key: 'action', class: 'text-center' }
      ]
    }
  },
  computed: {
    url () {
      return `${window.location.origin}/form/public/${this.orderResponse.id}`
    },
    itms () {
      let products = this.order.products
      for (const key in products) {
        if (products.hasOwnProperty(key)) {
          const element = products[key]
          console.log(element)
        }
      }
      return 0
    },
    amount () {
      // Total a pagar
      let price = 0
      let prices = []
      let products = this.order.products
      for (const key in products) {
        if (products.hasOwnProperty(key)) {
          const element = products[key]
          prices.push(parseFloat(element.price))
        }
      }
      const add = prices => prices.reduce((a, b) => a + b, 0)
      price = add(prices)
      return price
    },
    finalPrice () {
      const monto = (parseFloat(this.amount) + this.deliveryCost) - this.order.discount
      return parseFloat(monto).toFixed(2)
    },
    payOut () {
      let amount = 0
      for (const key in this.payments) {
        if (this.payments.hasOwnProperty(key)) {
          const element = this.payments[key]
          if (!element.checkBox) { element.amount = 0 }
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
        return 'Datos de la orden'
      }
      if (this.tabIndex === 2) {
        return 'Añadir productos'
      }
      return 'Método de pago'
    }
  },
  watch: {
    client (newValue, oldValue) {
      if (this.client) {
        this.order.client_id = this.client.id
        this.order.client_dni = this.client.dni
        this.order.client_name = this.client.name
        this.$refs['modal-client'].hide()
      }
    }
  },
  methods: {
    showClientModal () {
      this.$refs['modal-client'].show()
    },
    deliveryCostChange ($event) {
      const object = this.deliveryZones.find(x => x.value === $event)
      this.deliveryCost = object.price
    },
    onModeChange () {
      if (this.order.mode === 'pedidosya') {
        this.order.delivery_zone_id = null
      }
    },
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
        this.handleOk()
      } else {
        this.tempExtra.push(item)
      }
    },
    addNote () {
      this.orderProducts[this.index].note = this.note
    },
    addDesignNote () {
      this.orderProducts[this.index].note_design = this.note_design
    },
    addPersonalizedNote () {
      this.orderProducts[this.index].personalized_text = this.personalized_text
    },
    delItem (id) {
      this.tempProd = this.tempProd.filter(x => x.id !== id)
    },
    deleteProduct (index) {
      const object = this.orderProducts[index].additionals
      let salePrice = 0

      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          const element = object[key]
          salePrice += element.quantity * element.sale_price
        }
      }
      this.orderProducts[index].note = ''
      this.orderProducts[index].note_design = ''
      this.orderProducts[index].personalized_text = ''
      this.orderProducts[index].price = this.orderProducts[index].price - salePrice
      this.orderProducts[index].additionals.length = 0
      this.orderProducts.splice(index, 1)
    },
    deleteExtra (index, indice) {
      const extraPrice = this.orderProducts[index].additionals[indice].sale_price
      const qty = this.orderProducts[index].additionals[indice].quantity
      const price = this.orderProducts[index].price

      if (this.status === 'add') {
        this.orderProducts[index].price = price - (extraPrice * qty)
        this.orderProducts[index].additionals.splice(indice, 1)
      }
    },
    getClient () {
      this.clients.map(r => {
        if (r.isAddItem) { r.isAddItem = false }
      })
      this.$refs['lista-clientes'].show()
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
      this.resetPrincipals()
      this.tempProd.length = 0
      this.$refs['lista-productos'].hide()
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
        for (const iterator of this.tempExtra) {
          if (iterator.tax !== 0) {
            this.orderProducts[this.index].price += (iterator.sale_price + (iterator.sale_price * iterator.tax) / 100) * iterator.quantity
          } else {
            this.orderProducts[this.index].price += iterator.sale_price * iterator.quantity
          }
        }
        this.orderProducts[this.index].additionals.push(...this.tempExtra)
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
    resetPrincipals () {
      this.principals.map(r => {
        if (r.isAddItem) { r.isAddItem = false }
      })
    },
    resetAdditionals () {
      this.additionals.map(r => {
        if (r.isAddItem) { r.isAddItem = false }
      })
    },
    showPersonalizedText (index) {
      this.index = index
      this.$refs['modal-personalized'].show()
    },
    showModalNote (index) {
      this.index = index
      this.$refs['modal-note'].show()
    },
    showModalDesignNote (index) {
      this.index = index
      this.$refs['modal-design-note'].show()
    },
    onComplete () {
      // console.log(this.order)
      this.order.delivery_date = `${this.order.delivery_date} ${this.deliveryTime}`
      this.loading = true
      if (this.status === 'add') {
        orderService.create(this.order)
          .then(response => {
            this.orderResponse = response.data
            this.$refs['modal-order'].show()
          })
          .catch(error => { console.error(error) })
          .finally(() => { this.loading = false })
      }
      if (this.status === 'edit') {
        orderService.update(this.order.id, this.order)
          .then(response => {
            this.orderResponse = response.data
            this.$refs['modal-order'].show()
          })
          .catch(error => { console.error(error) })
          .finally(() => { this.loading = false })
      }
    },
    showModal (modal, index) {
      this.index = index
      this.updateAdditionals()
      this.$refs[modal].show()
    },
    tabChange (prevIndex, nextIndex) {
      this.tabIndex = nextIndex
    },
    updateAdditionals () {
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
      }
    },
    validateOrder () {
      return this.$refs.form.validate().then(success => {
        return success
        // return true
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
            if (element.tax !== 0) {
              const price = element.price + ((element.price * element.tax) / 100)
              this.product.price = parseFloat(price).toFixed(2)
            } else {
              this.product.price = element.price
            }
            this.product.product_id = element.id
            this.product.name = element.name
            this.product.note_design = element.note_design
            this.product.note = element.note
            this.product.personalized_text = element.personalized_text
            this.product.image = element.image
            this.product.quantity = 1
            this.product.additionals = []
            for (const key in element.additionals) {
              if (element.additionals.hasOwnProperty(key)) {
                const item = element.additionals[key]
                this.additional = {}
                this.additional.product_id = item.id
                this.additional.name = item.name
                this.additional.quantity = item.quantity
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
      if (this.sendForm) {
        this.loading = true
        orderService.emailForm(this.orderResponse.id)
          .then(response => {
            if (response.status) { this.$router.push({ name: 'orders.list' }) }
          })
          .catch(error => { console.error(error) })
          .finally(() => { this.loading = false })
      } else {
        this.$router.push({ name: 'orders.list' })
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import url('https://rawgit.com/lykmapipo/themify-icons/master/css/themify-icons.css');

#row {
  border: 1px solid #E5E8E8;
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

.btn-link-personlized {
  color: var(--iq-success);
}
</style>
