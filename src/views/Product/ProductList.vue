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
              <template v-if="products.length === 0">
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
                    <template v-slot:cell(type)="products">
                      {{products.item.type === 'principal' ? 'Principal' : 'Adicional'}}
                    </template>
                    <template v-slot:cell(image)="products">
                      <b-img
                        v-viewer="{movable: false}"
                        center
                        rounded="circle"
                        :src="products.item.image ? products.item.image : require(`@/assets/images/no-image.png`)"
                        id="image"
                        class="">
                      </b-img>
                    </template>
                    <template v-slot:cell(action)="products">
                      <b-button
                        variant=" iq-bg-success mr-1 mb-1"
                        size="sm"
                        @click="edit(products.item)"
                        v-if="!products.item.editable">
                        <i class="ri-ball-pen-fill m-0"></i>
                      </b-button>
                      <b-button
                        variant=" iq-bg-success mr-1 mb-1"
                        size="sm"
                        @click="submit(products.item)"
                        v-else>Ok
                      </b-button>
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
import productService from '@/services/product'
import { VMoney } from 'v-money'

export default {
  name: 'ProductList',
  directives: { money: VMoney },
  created () { this.loadData() },
  mounted () {
    vito.index()
    // Set the initial number of items
    this.totalRows = this.products.length
  },
  data () {
    return {
      noImage: '',
      sortBy: '',
      loading: true,
      filter: null,
      isShow: false,
      isRemoving: false,
      perPage: 15,
      selectedType: null,
      sortDesc: false,
      money: {
        decimal: ',',
        thousands: '.',
        prefix: 'B/. ',
        precision: 2,
        masked: false /* doesn't work with directive */
      },
      product: {
        name: '',
        description: '',
        type: '',
        price: 0,
        image: ''
      },
      typesOptions: [
        { value: null, text: 'Tipo de Producto' },
        { value: true, text: 'Principal' },
        { value: false, text: 'Adicional' }
      ],
      pageOptions: [5, 10, 15],
      totalRows: 1,
      currentPage: 1,
      titles: [
        { label: 'Id', key: 'id', class: 'text-left', sortable: true },
        { label: 'Foto', key: 'image', class: 'text-left' },
        { label: 'Nombre', key: 'name', class: 'text-left', sortable: true },
        { label: 'Precio', key: 'price', class: 'text-left', sortable: true },
        { label: 'Tipo', key: 'type', class: 'text-left', sortable: true },
        { label: 'Action', key: 'action', class: 'text-center' }
      ],
      products: []
    }
  },
  methods: {
    loadData () {
      productService.getAll()
        .then(response => {
          this.products = response.data
        })
        .catch(error => { console.log(error) })
        .finally(() => {
          this.loading = false
          setTimeout(() => {
            this.isShow = false
          }, 2000)
        })
    },
    add () {
      this.$router.push({ name: 'product.add' })
    },
    edit (item) {
      this.$router.push({ name: 'product.edit', params: { id: item.id } })
    },
    submit (item) {
      // item.editable = false
    },
    remove (item) {
      this.$bvModal.msgBoxConfirm('Esta seguro que desea eliminar el registro?.', {
        title: 'Por favor confirme',
        okVariant: 'danger',
        okTitle: 'Si',
        cancelTitle: 'No',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(value => {
          if (value) {
            this.isRemoving = true
            productService.delete(item.id)
              .then(res => {
                this.isShow = true
              })
              .catch((error) => { console.log(error) })
              .finally(() => {
                this.isRemoving = false
                this.loadData()
              })
          }
        })
        .catch(err => { console.log(err) })
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    onChange () {
      if (this.selectedType !== null) {
        this.sortBy = 'type'
      } else {
        this.sortBy = ''
      }
      this.sortDesc = this.selectedType
    }
  },
  computed: {
    rows () {
      return this.products.length
    }
  }
}
</script>

<style scoped>
  #alert {
    z-index: 1000;
    position: absolute;
    left: 40%;
  }
  .is-removing {
    z-index: 1000;
    position: relative;
    left: 0;
  }
  #spinner {
    z-index: 1000;
    position: relative;
    left: 0;
  }
  #image {
    width: 64px;
    height: 64px;
  }
</style>
