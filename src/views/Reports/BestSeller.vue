<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner
                variant="primary"
                type="grow"
                label="Spinning"
              ></b-spinner>
            </b-col>
            <b-row v-else align-h="between">
              <b-col md="12" class="my-1 text-center">
                <b-row align-h="end" class="mb-2 mt-2">
                  <div class="col-md-2 text-right">
                    <b-button
                      class="mr-2"
                      variant="outline-success"
                      v-b-tooltip.top="'Descargar a PDF'"
                      @click="exportPDF"
                    >
                      <i class="ri-download-cloud-line"></i>
                    </b-button>
                    <download-excel
                      class="btn btn-outline-warning"
                      :data="results"
                      worksheet="Productos más vendidos"
                      name="Productos más vendidos.xls"
                    >
                      <i class="ri-file-excel-2-line"></i>
                    </download-excel>
                  </div>
                </b-row>
              </b-col>
              <template v-if="results.length === 0">
                <b-col class="col-md-12">
                  <b-alert :show="true" variant="secondary">
                    <div class="iq-alert-text">
                      <b>No hay registros para mostrar.</b>
                    </div>
                  </b-alert>
                </b-col>
              </template>
              <template v-else>
                <b-col md="12" class="table-responsive">
                  <b-table
                    ref="content"
                    striped
                    bordered
                    hover
                    :items="results"
                    :filter="filter"
                    :fields="titles"
                    :per-page="perPage"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :current-page="currentPage"
                    @filtered="onFiltered"
                  >
                    <template v-slot:cell(name)="results">
                      <label for="" class="text-capitalize">{{
                        results.item.name
                      }}</label>
                    </template>
                    <template v-slot:cell(created_at)="results">
                      {{ results.item.created_at | formatDate }}
                    </template>
                    <template v-slot:cell(type)="results">
                      <b-badge
                        variant="success"
                        v-if="results.item.type === 'sale'"
                        >Venta</b-badge
                      >
                      <b-badge
                        variant="primary"
                        v-if="results.item.type === 'purchase'"
                        >Compra</b-badge
                      >
                    </template>
                  </b-table>
                </b-col>
                <b-col sm="5" md="4">
                  <b-form-group
                    label="Resultados por página"
                    label-cols-sm="6"
                    label-cols-md="6"
                    label-align-sm="right"
                    label-size="sm"
                    label-for="perPageSelect"
                    class="mb-0"
                  >
                    <b-form-select
                      v-model="perPage"
                      id="perPageSelect"
                      size="sm"
                      :options="pageOptions"
                    ></b-form-select>
                  </b-form-group>
                </b-col>
                <b-col sm="7" md="8">
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                    align="right"
                    aria-controls="my-table"
                  >
                  </b-pagination>
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

export default {
  name: 'BestSeller',
  created () {
    this.getData()
  },
  mounted () {
    vito.index()
  },
  data () {
    return {
      filters: {
        type: '',
        products: [],
        initDate: '',
        endDate: ''
      },
      options: {
        type: [
          { value: '', text: 'Todos' },
          { value: 'sale', text: 'Venta' },
          { value: 'purchase', text: 'Compra' }
        ],
        products: [
          { value: '', text: 'Todos' }

        ]
      },
      results: [],
      sortBy: '',
      loading: true,
      filter: null,
      isShow: false,
      isRemoving: false,
      perPage: 15,
      selectedType: null,
      sortDesc: false,
      pageOptions: [5, 10, 15, 25, 50, 100, 200],
      totalRows: 1,
      currentPage: 1,
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
      const doc = new JsPDF()
      let columns = [
        { title: 'Producto', dataKey: 'name' },
        { title: 'Total', dataKey: 'total' }
      ]
      doc.text('Best Sellers', 20, 20)
      doc.autoTable(columns, this.results, { margin: { top: 30 } })
      doc.save('Best Sellers.pdf')
    },
    getData () {
      // let params = `type=${this.filters.type}&product_id=${this.filters.products}&init_date=${this.filters.initDate}&end_date=${this.filters.endDate}`
      reportsService.getBestSellers()
        .then(response => {
          this.results = response.data
        })
        .catch(() => { })
        .finally(() => { this.loading = false })
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }

  }
}
</script>
