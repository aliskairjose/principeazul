<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <b-alert :show="isShow" variant="success" class="bg-white" id="alert">
          <div class="iq-alert-icon">
            <i class="ri-alert-line"></i>
          </div>
          <div class="iq-alert-text">
            El registro ha sido
            <b>eliminado</b> con éxito!
          </div>
        </b-alert>
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Lista de productos</h4>
          </template>
          <template v-slot:body>
            <div class="text-center is-removing" v-show="isRemoving">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </div>
            <div class="text-center" id="spinner" v-if="loading">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </div>
            <b-row v-else>
              <b-col md="4" class="my-1">
                <b-form-group
                  label="Filtro"
                  label-cols-sm="3"
                  label-align-sm="right"
                  label-size="sm"
                  label-for="filterInput"
                  class="mb-0">
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
              <b-col md="4" class="my-1">
                <b-form-group class="mb-0">
                  <b-form-select
                    v-model="selectedType"
                    id="types"
                    size="sm"
                    :options="typesOptions"
                    @change="onChange">
                    </b-form-select>
                </b-form-group>
              </b-col>
              <b-col md="4" class="my-1">
                <b-form-group>
                  <b-button variant="primary" @click="add">Nuevo producto</b-button>
                </b-form-group>
              </b-col>
              <template v-if="isEmpty">
                <b-col>
                  <b-alert :show="true" variant="secondary">
                    <div class="iq-alert-text"><b>No hay productos para mostrar.</b> Por favor agrege un cliente para comenzar!</div>
                  </b-alert>
                </b-col>
              </template>
              <template v-else>
                <b-col md="12" class="table-responsive">
                  <b-table
                    striped
                    bordered
                    hover
                    :items="products"
                    :filter="filter"
                    :fields="titles"
                    :per-page="perPage"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :current-page="currentPage"
                    @filtered="onFiltered">
                    <template v-slot:cell(action)="products">
                      <b-button
                        variant=" iq-bg-success mr-1 mb-1"
                        size="sm"
                        @click="edit(products.item)"
                        v-if="!products.item.editable"
                      >
                        <i class="ri-ball-pen-fill m-0"></i>
                      </b-button>
                      <b-button
                        variant=" iq-bg-success mr-1 mb-1"
                        size="sm"
                        @click="submit(products.item)"
                        v-else
                      >Ok</b-button>
                      <b-button variant=" iq-bg-danger" size="sm" @click="remove(products.item)">
                        <i class="ri-delete-bin-line m-0"></i>
                      </b-button>
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
                    class="mb-0">
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
                    aria-controls="my-table">
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
// import inventoryService from '@/services/inventory'

export default {
  props: { product: { type: Object } },
  name: 'InventoryList',
  created () {
    console.log('created', this.product)
  },
  mounted () {
    vito.index()
    console.log('mounted', this.product)
    // Set the initial number of items
    // this.totalRows = this.products.length
    // inventoryService.getAll(`product_id=${this.id}`)
    //   .then(response => {
    //     console.log(response)
    //   })
    //   .then((error) => { console.log(error) })
    //   .finally(() => { this.loading = false })
  },
  data () {
    return {
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
      currentPage: 1
    }
  }
}
</script>
