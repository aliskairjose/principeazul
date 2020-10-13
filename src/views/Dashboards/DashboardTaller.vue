<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </b-col>
            <div class="d-flex align-items-center justify-content-between">
              <iframe :src="iframeUrl" frameborder="0" width="100%" height="350" allowtransparency></iframe>
            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <b-row align-h="between" align-v="center">
              <!-- Fiiltro texto -->
              <b-col md="3">
                <b-form-group
                  label="Filtro"
                  label-cols-sm="3"
                  label-align-sm="right"
                  label-size="sm"
                  label-for="filterInput"
                  class="mb-0 pt-3"
                >
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="filter"
                      type="search"
                      id="filterInput"
                      placeholder="Escriba para buscar"
                    ></b-form-input>
                    <b-input-group-append>
                      <b-button :disabled="!filter" @click="filter = ''">Limpiar</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <!-- Filtro Tipo de orden -->
              <b-col md="2">
                <b-form-group class="mb-0 pt-3">
                  <b-form-select
                    v-model="selectedPersonalize"
                    id="types"
                    size="sm"
                    :options="perOptions"
                    @change="onChangePersonalized"
                  ></b-form-select>
                </b-form-group>
              </b-col>
              <!-- Rango de fechas -->
              <b-col md="2">
                <b-form-group class="mb-0 pt-3">
                  <b-form-select
                    v-model="selectedType"
                    id="types"
                    size="sm"
                    :options="typeOptions"
                    @change="onSelectedChange"
                  ></b-form-select>
                </b-form-group>
              </b-col>
              <!-- Filtro Fecha Inicial -->
              <b-col md="2">
                <b-form-group label="Fecha inicial:" label-for="date">
                  <b-form-input
                    :disabled="selectedType ? false : true"
                    v-model="initDate"
                    type="date"
                    @change="onDateChange"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <!-- Filtro Fecha Final -->
              <b-col md="2">
                <b-form-group label="Fecha final:" label-for="date">
                  <b-form-input
                    :disabled="selectedType ? false : true"
                    v-model="endDate"
                    type="date"
                    @change="onDateChange"
                  ></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row cols-md="3" cols-sm="1">
              <b-col v-for="order in orders" :key="order.id">
                <OrderCard
                  :order="order"
                  :statuses="statuses"
                  @status-change="updateStatus($event)"
                  @modal-recipes="showModalRecipes($event)"
                ></OrderCard>
              </b-col>
            </b-row>
            <b-modal ok-only ref="modal-recipes" title="Receta de producto">
              <b-col md="12">
                <h5>Receta</h5>
                <label v-for="recipe in recipes" :key="recipe.id" class="text-muted text-capitalize mr-3">
                  <h6 class="mx-1">
                    <b-badge variant="primary" class="px-2">{{ recipe.name }} x {{recipe.pivot.quantity}}</b-badge>
                  </h6>
                </label>
                <hr>
                <h5>Adicionales</h5>
                <label v-for="additional in additionals" :key="additional.id" class="text-muted text-capitalize mr-3">
                  <h6 class="mx-1">
                    <b-badge variant="primary" class="px-2">{{ additional.name }} x {{additional.quantity}}</b-badge>
                  </h6>
                </label>
              </b-col>
            </b-modal>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
import OrderCard from '@/views/Dashboards/OrderCard/OrderCard'
import orderService from '@/services/order'
import productService from '@/services/product'
import moment from 'moment'

export default {
  name: 'DasboardTaller',
  components: {
    OrderCard
  },
  created () {
    orderService.orderStatuses()
      .then(response => {
        const object = response.data
        for (const iterator of object) {
          let status = {}
          status.value = iterator
          status.text = iterator
          this.statuses.push(status)
        }
      })

    setInterval(() => {
      this.loadData(this.params)
    }, 60000)
  },
  mounted () {
    vito.index()
    const date = new Date()
    date.setDate(date.getDate() + 1)
    const formatDate = moment(String(date)).format('YYYY-MM-DD')
    this.initDate = formatDate
    this.endDate = formatDate
    this.loadData(`delivery_init_date=${this.initDate}&delivery_end_date=${this.endDate}`)

    let jwt = require('jsonwebtoken')

    const METABASE_SITE_URL = 'http://64.225.42.188:3000'
    const METABASE_SECRET_KEY =
      '0156c408fdcb44a1d69051733b6b982a9a6bd4dbd0678c5c274fa654f1ea1fb7'
    const payload = {
      resource: { dashboard: 6 },
      params: {},
      exp: Math.round(Date.now() / 1000) + 10 * 60 // 10 minute expiration
    }
    const token = jwt.sign(payload, METABASE_SECRET_KEY)
    this.iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=true&titled=true`
  },
  data () {
    return {
      params: '',
      additionals: [],
      recipes: [],
      selectedType: 1,
      selectedPersonalize: null,
      loading: false,
      orders: [],
      filter: null,
      iframeUrl: '',
      initDate: '',
      endDate: '',
      statuses: [],
      typeOptions: [
        { value: 1, text: 'Fecha de creación' },
        { value: 2, text: 'Fecha de entrega' }
      ],
      perOptions: [
        { value: null, text: 'Tipo de orden' },
        { value: 2, text: 'Todos' },
        { value: 1, text: 'Personalizada' },
        { value: 0, text: 'Standard' }
      ]
    }
  },
  methods: {
    onChangePersonalized () {
      if (this.selectedPersonalize !== 2) {
        this.loadData(`required_personalized=${this.selectedPersonalize}&delivery_init_date=${this.initDate}&delivery_end_date=${this.endDate}`)
        return
      }
      this.loadData(`delivery_init_date=${this.initDate}&delivery_end_date=${this.endDate}`)
    },
    onSelectedChange () {
      // Fecha de creacion
      if (this.selectedType === 1) {
        this.loadData(`init_date=${this.initDate}&end_date=${this.endDate}`)
      }
      // Fecha de entrega
      if (this.selectedType === 2) {
        this.loadData(`delivery_init_date=${this.initDate}&delivery_end_date=${this.endDate}`)
      }
    },
    onDateChange () {
      if (this.initDate && this.endDate) {
        if (this.selectedType === 1) {
          // Fecha de creación
          this.loadData(`init_date=${this.initDate}&end_date=${this.endDate}`)
        } else {
          // Fecha de entrega
          this.loadData(`delivery_init_date=${this.initDate}&delivery_end_date=${this.endDate}`)
        }
      }
    },
    updateStatus ($event) {
      this.loading = true
      orderService.updateSatus($event.id, $event.status)
        .then(() => {})
        .catch(() => { })
        .finally(() => {
          this.loadData(``)
          this.loading = false
        })
    },
    showModalRecipes ($event) {
      this.additionals = []
      $event.additionals.map(additional => {
        if (additional.type === 'extra') { this.additionals.push(additional) }
      })
      productService.getById($event.productID)
        .then(response => {
          this.recipes = [...response.data.additionals]
          this.$refs['modal-recipes'].show()
        })
    },
    loadData (params = '') {
      this.params = params
      this.loading = true
      orderService.getAll(params)
        .then(response => {
          let list = []
          for (const d of response.data) {
            if (d.status === 'Creado' || d.status === 'Pendiente' || d.status === 'En confección' || d.status === 'Confección urgente') {
              list.push(d)
            }
          }
          this.orders = [...list]
        })
        .catch(() => {})
        .finally(() => { this.loading = false })
    }
  }
}
</script>

<style></style>
