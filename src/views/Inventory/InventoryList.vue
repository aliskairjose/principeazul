<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <div class="text-center" id="spinner" v-if="loading">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </div>
            <b-row v-else align-h="between">
              <b-col md="4" class="my-1">
                <b-form-group>
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="quantity"
                      type="number"
                      id="quantity"
                      placeholder="Cantidad">
                    </b-form-input>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col md="4" class="my-1">
                <b-form-group>
                  <b-button variant="primary" @click="add">Agregar</b-button>
                </b-form-group>
              </b-col>
              <template>
                <b-col md="12" class="table-responsive">
                  <b-table
                    striped
                    bordered
                    hover
                    :items="data"
                    :filter="filter"
                    :fields="titles"
                    :per-page="perPage"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :current-page="currentPage">
                  </b-table>
                </b-col>
                <b-col sm="5" md="6">
                  <b-form-group
                    label="Resultados por página"
                    label-cols-sm="6"
                    label-cols-md="6"
                    label-align-sm="right"
                    label-size="sm"
                    label-for="perPageSelect"
                    class="mb-0">
                    <b-form-select
                      v-model="perPage"
                      id="perPageSelect"
                      size="sm"
                      :options="pageOptions"
                    ></b-form-select>
                  </b-form-group>
                </b-col>
                <!-- <b-col sm="7" md="8">
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                    align="right"
                    aria-controls="my-table">
                  </b-pagination>
                </b-col> -->
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
import inventoryService from '@/services/inventory'

export default {
  props: { product: { type: Object } },
  name: 'InventoryList',
  mounted () {
    vito.index()
    // this.totalRows = this.products.length
    inventoryService.getAll(`product_id=${this.product.id}`)
      .then(response => {
        console.log(response)
        this.data = response.data
      })
      .then((error) => { console.log(error) })
      .finally(() => { this.loading = false })
  },
  data () {
    return {
      quantity: 0,
      sortBy: '',
      loading: true,
      filter: null,
      isShow: false,
      isEmpty: true,
      isRemoving: false,
      perPage: 15,
      selectedType: null,
      sortDesc: false,
      pageOptions: [5, 10, 15],
      totalRows: 1,
      currentPage: 1,
      data: [],
      titles: [
        { label: 'Id', key: 'id', class: 'text-left' },
        { label: 'Nombre', key: 'name', class: 'text-left' },
        { label: 'Cantidad', key: 'price', class: 'text-left' }
      ]
    }
  },
  methods: {
    add () {
      const inv = {}
      inv.product_id = this.product.id
      inv.quantity = parseInt(this.quantity)
      inv.provider_id = 1
      inv.type = 'purchase'

      console.log(inv)
    }
  }
}
</script>
