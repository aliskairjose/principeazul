<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <b-row align-v="center">
              <b-col md="1"></b-col>
              <b-col md="2">
                <b-form-group label="Fecha inicial:" label-for="date">
                  <b-form-input v-model="startDate" type="date"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Fecha final:" label-for="date">
                  <b-form-input v-model="endDate" type="date"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-button
                  size="md"
                  variant="outline-primary"
                  @click="getData"
                >
                  Buscar
                </b-button>
              </b-col>
            </b-row>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </b-col>
            <b-row v-else align-h="between">
              <b-col md="12" class="my-1 text-center">
                <b-row align-h="end" class="mb-2 mt-2" >
                  <div class="col-md-2 text-right">
                    <b-button variant="outline-success" v-b-tooltip.top="'Descargar a PDF'" @click="exportPDF">
                      <i class="ri-download-cloud-line"></i>
                      </b-button>
                  </div>
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
                    <b-row align-h="end">
                      <b-col sm="6">
                        <b-row>
                          <b-col sm="6" style="font-weight: bold; color: #0b0b0b">Cuentas x Cobrar</b-col>
                          <b-col sm="6"> ${{ totalCredit }}</b-col>
                        </b-row>
                        <b-row>
                        <b-col sm="6" style="color: #0b0b0b">Facturas Pendientes.</b-col>
                        <b-col sm="6"> {{ results.length }}</b-col>
                      </b-row>
                      </b-col>
                    </b-row>
                  </b-container>
                  <b-container class="my-3">
                    <b-row>
                      <b-col md="12" class="table-responsive">
                        <b-table
                          ref="content"
                          striped
                          bordered
                          hover
                          :items="results"
                          :filter="filter"
                          :fields="titles"
                          :sort-by.sync="sortBy"
                          >
                          <template v-slot:cell(created_at)="results">
                            {{results.item.created_at | formatDate }}
                        </template>
                          <template v-slot:cell(products)="results">
                          <label v-for="(product,i) in results.item.products" :key="i">{{ product.name }}<span v-if="(results.item.products.length-1)>i"> - </span></label>
                        </template>
                          <template v-slot:cell(saldo)="results">
                            {{ (parseFloat(results.item.total) - parseFloat(results.item.totalPaid)).toFixed(2)}}
                          </template>
                        </b-table>
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
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import moment from 'moment'

export default {
  name: 'Moment',
  created () {},
  mounted () {
    vito.index()
    const dateInit = new Date()
    dateInit.setDate(dateInit.getDate() - 8)
    const dateEnd = new Date()
    dateEnd.setDate(dateEnd.getDate())
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
      totalCredit: 0,
      titles: [
        { label: '#Orden', key: 'id', class: 'text-center', sortable: true },
        { label: 'Cliente', key: 'client.name', class: 'text-center', sortable: true },
        { label: 'Teledono.', key: 'client.phone', class: 'text-center', sortable: true },
        { label: 'Fecha de Compra', key: 'created_at', class: 'text-center', sortable: true },
        { label: 'productos', key: 'products', class: 'text-center', sortable: true },
        { label: 'Total Compra', key: 'total', class: 'text-center', sortable: false },
        { label: 'Abono', key: 'totalPaid', class: 'text-center', sortable: false },
        { label: 'Saldo', key: 'saldo', class: 'text-center' }
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
      const doc = new JsPDF()
      let columns = [
        { title: '#Orden', dataKey: 'id' },
        { title: 'Cliente', dataKey: 'client.name' },
        { title: 'Teledono.', dataKey: 'client.phone' },
        { title: 'Fecha de Compra', dataKey: 'created_at' },
        { title: 'Total Compra', dataKey: 'total' },
        { title: 'Abono', dataKey: 'totalPaid' },
        { title: 'Saldo', dataKey: 'saldo' }
      ]
      doc.text('Cuentas x Cobrar', 20, 20)
      doc.autoTable(columns, this.results, { margin: { top: 30 } })
      doc.save('Cuentas x Cobrar.pdf')
    },
    getData () {
      // eslint-disable-next-line no-unused-vars
      let params = ''
      params = `?start_date=${this.startDate}&end_date=${this.endDate}`
      reportsService.getAccountsReceivableReport(params)
        .then(response => {
          this.results = response.data
          let totalPaid = this.results.reduce((a, b) => a + parseFloat(b.totalPaid), 0)
          let total = this.results.reduce((a, b) => a + parseFloat(b.total), 0)
          this.totalCredit = (total - totalPaid).toFixed(2)
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
