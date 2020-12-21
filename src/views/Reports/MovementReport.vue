<template>
   <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </b-col>
            <b-row v-else align-h="between">
              <b-col md="12" class="my-1 mb-3">
                  <b-row align-h="end">
                    <b-col md="3">
                      Fecha inicial
                      <b-form-input v-model="startDate" type="date"></b-form-input>
                    </b-col>
                    <b-col md="3">
                      Fecha final
                      <b-form-input v-model="endDate" type="date"></b-form-input>
                    </b-col>
                    <b-col md="2" align-self="end">
                      <b-button variant="primary" v-b-tooltip.top="'Buscar'" class="mr-2" @click="getData()">
                        <i class="ri-search-line"></i>
                      </b-button>
                      <b-button variant="outline-success" v-b-tooltip.top="'Descargar a PDF'" @click="exportPDF">
                        <i class="ri-download-cloud-line"></i>
                      </b-button>
                    </b-col>
                  </b-row>
                </b-col>
              <template v-if="results.length === 0">
                <b-col class="col-md-12">
                  <b-alert :show="true" variant="secondary">
                    <div class="iq-alert-text"><b>No hay registros para mostrar.</b></div>
                  </b-alert>
                </b-col>
              </template>
              <template v-else>
                <b-col md="12">
                  <b-container class="my-3">
                    <b-row v-for="(pers, i) in results.countPersonalizedByProduct" :key="i">
                      <b-col sm="6" align="center" style="font-weight: bold; color: #0b0b0b"><span v-if="pers.personalized">PERSONALIZADOS</span><span v-else>STANDARD</span></b-col>
                      <b-col sm="6"> {{pers.quantity}} </b-col>
                    </b-row>
                  </b-container>

                  <b-container class="my-3">
                  <b-row v-for="(mode, j) in results.countByMode" :key="j">
                    <b-col sm="6" align="center" style="font-weight: bold; color: #0b0b0b">{{mode.mode}}</b-col>
                    <b-col sm="6"> {{mode.quantity}} </b-col>
                  </b-row>
                  </b-container>
                  <b-container class="my-3">
                    <pre></pre>
                    <b-row style="font-weight: bold; color: #0b0b0b; size: 12px!important; text-decoration: underline">
                      <b-col sm="4" align="center"></b-col>
                      <b-col sm="4"> Unidades</b-col>
                      <b-col sm="4"> Venta</b-col>
                    </b-row>
                    <b-row style="font-weight: bold; color: #0b0b0b">
                      <b-col sm="4" align="center">Total Pedidos</b-col>
                      <b-col sm="4">{{category.qty}}</b-col>
                      <b-col sm="4"> {{category.val.toFixed(2)}}</b-col>
                    </b-row>
                    <b-row v-for="(category, j) in results.quantityByCategory" :key="j">
                      <b-col sm="4" align="center" style="font-weight: bold; color: #0b0b0b">{{ category.name }}</b-col>
                      <b-col sm="4"> {{ category.quantity }}</b-col>
                      <b-col sm="4"> $ {{ category.value.toFixed(2) }}</b-col>
                    </b-row>
                  </b-container>

                  <b-container class="my-3">
                    <b-row style="font-weight: bold; color: #0b0b0b; size: 12px!important; text-decoration: underline">
                      <b-col sm="4" align="center"></b-col>
                      <b-col sm="4"> Unidades</b-col>
                      <b-col sm="4"> Venta</b-col>
                    </b-row>
                    <b-row v-for="(category, j) in gProducts" :key="j" class="my-3">
                      <b-col sm="12">
                        <b-row style="font-weight: bold; color: #0b0b0b">
                          <b-col sm="4" align="center">{{ j }}</b-col>
                          <b-col sm="4"> {{ category.qty }}</b-col>
                          <b-col sm="4"> $ {{ category.val.toFixed(2) }}</b-col>
                        </b-row>
                        <b-row v-for="(item, k) in category.products" :key="k">
                          <b-col sm="4" style="color: #0b0b0b">{{ item.name }}</b-col>
                          <b-col sm="4"> {{ item.quantity }}</b-col>
                          <b-col sm="4"> $ {{ item.value.toFixed(2) }}</b-col>
                        </b-row>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-col>
              </template>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
import reportsService from '@/services/reports'
import moment from 'moment'

export default {
  name: 'Moment',
  created () {},
  mounted () {
    vito.index()
    const dateInit = new Date()
    dateInit.setDate(dateInit.getDate() - 3)
    const dateEnd = new Date()
    dateEnd.setDate(dateEnd.getDate() + 3)
    const formatDateInit = moment(String(dateInit)).format('YYYY-MM-DD')
    const formatDateEnd = moment(String(dateEnd)).format('YYYY-MM-DD')
    this.startDate = formatDateInit
    this.endDate = formatDateEnd
    this.getData()
  },
  data () {
    return {
      startDate: '',
      endDate: '',
      results: [],
      category: {
        qty: null,
        val: null
      },
      gProducts: {},
      sortBy: '',
      loading: true,
      filter: null,
      isShow: false,
      isRemoving: false,
      titles: [
        { label: 'Producto', key: 'name', class: 'text-center' },
        { label: 'Total', key: 'total', class: 'text-center' }
      ]
    }
  },
  computed: {
    rows () {
      return this.results.length
    }
  },
  methods: {
    exportPDF () {
      let params = `?start_date=${this.startDate}&end_date=${this.endDate}`
      reportsService.getMovementReportPdf(params)
    },
    getData () {
      // eslint-disable-next-line no-unused-vars
      let params = ''
      params = `start_date=${this.startDate}&end_date=${this.endDate}`
      reportsService.getMovementReport(params)
        .then(response => {
          this.results = response.data
          this.category.qty = this.results.quantityByCategory.reduce((a, b) => a + parseInt(b.quantity), 0)
          this.category.val = this.results.quantityByCategory.reduce((a, b) => a + parseFloat(b.value), 0)
          const produtGrup = {}
          const categories = this.results.quantityByProduct
          categories.forEach(product => {
            if (!produtGrup.hasOwnProperty(product.category)) {
              produtGrup[product.category] = {
                products: [],
                qty: 0,
                val: 0
              }
            }
            const { name, category, quantity, value } = product
            produtGrup[product.category].products.push({ name, category, quantity, value })
            produtGrup[product.category].qty += parseInt(quantity)
            produtGrup[product.category].val += parseFloat(value)
          })
          this.gProducts = produtGrup
        })
        .catch(() => { })
        .finally(() => { this.loading = false })
    }
  }
}
</script>
