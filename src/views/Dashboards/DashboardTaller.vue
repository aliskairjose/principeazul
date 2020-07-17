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
            <!-- <OrderList></OrderList> -->
            <b-row align-h="between" align-v="center">
              <b-col md="3">
                <b-form-group
                    label="Filtro"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="sm"
                    label-for="filterInput"
                    class="mb-0 pt-3">
                    <b-input-group size="sm">
                      <b-form-input
                        v-model="filter"
                        type="search"
                        id="filterInput"
                        placeholder="Escriba para buscar">
                      </b-form-input>
                      <b-input-group-append>
                        <b-button :disabled="!filter" @click="filter = ''">Limpiar</b-button>
                      </b-input-group-append>
                    </b-input-group>
                </b-form-group>
              </b-col>
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
            <b-row>
            <b-col md="4" v-for="order in orders" :key="order.id">
              <OrderCard
               :order="order"
               :statuses="statuses"
               @status-change="updateStatus($event)"></OrderCard>
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
import OrderCard from '@/views/Dashboards/OrderCard/OrderCard'
import orderService from '@/services/order'
import moment from 'moment'

// import OrderList from '@/views/Orders/OrderList'

export default {
  name: 'DasboardTaller',
  components: { OrderCard },
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
      .catch(error => { console.log(error) })
  },
  mounted () {
    vito.index()
    // this.loadData()
    const date = new Date()
    date.setDate(date.getDate() + 1)
    const formatDate = moment(String(date)).format('YYYY-MM-DD')
    this.loadData(`delivery_init_date=${formatDate}&delivery_end_date=${formatDate}`)

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
      selectedType: null,
      selectedPersonalize: null,
      loading: false,
      orders: '',
      filter: null,
      iframeUrl: '',
      initDate: '',
      endDate: '',
      statuses: [],
      typeOptions: [
        { value: null, text: 'Rango de fecha' },
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
        this.loadData(`required_personalized=${this.selectedPersonalize}`)
      } else {
        this.loadData(``)
      }
    },
    onSelectedChange () {
      if (!this.selectedType) {
        // Limpia los campos fechas
        this.initDate = ''
        this.endDate = ''
        this.loadData()
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
        .then(() => { })
        .catch(() => { })
        .finally(() => { this.loading = false })
    },
    loadData (params = '') {
      this.loading = true
      orderService.getAll(params)
        .then(response => {
          this.orders = response.data
        })
        .catch(() => {})
        .finally(() => { this.loading = false })
    }
  }
}
</script>

<style></style>
