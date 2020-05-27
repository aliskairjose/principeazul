<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <b-alert :show="isShow" variant="success" class="bg-white">
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
            <h4 class="card-title">Lista de inventario</h4>
          </template>
          <!-- <template v-slot:headerAction>
            <b-button variant="primary" @click="add">Nuevo producto</b-button>
          </template> -->
          <template>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col md="4" class="my-1">
                <b-form-group
                  label="Filter"
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
                      placeholder="Type to Search">
                    </b-form-input>
                    <b-input-group-append>
                      <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col md="4" class="my-1">

              </b-col>
              <b-col md="4" class="my-1">
                <b-form-group>
                  <b-button variant="primary" @click="add">Nuevo producto</b-button>
                </b-form-group>
              </b-col>
              <b-col md="12" class="table-responsive">
                <b-table
                  striped
                  bordered
                  hover
                  :items="data"
                  :fields="titles"
                  :current-page="currentPage"
                  :per-page="perPage">
                  <template v-slot:cell(action)="data">
                    <b-button
                      variant=" iq-bg-success mr-1 mb-1"
                      size="sm"
                      @click="edit(data.item)"
                      v-if="!data.item.editable"
                    >
                      <i class="ri-ball-pen-fill m-0"></i>
                    </b-button>
                    <b-button
                      variant=" iq-bg-success mr-1 mb-1"
                      size="sm"
                      @click="submit(data.item)"
                      v-else
                    >Ok</b-button>
                    <b-button variant=" iq-bg-danger" size="sm" @click="remove(data.item)">
                      <i class="ri-delete-bin-line m-0"></i>
                    </b-button>
                  </template>
                </b-table>
              </b-col>
              <b-col md="12">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="rows"
                  :per-page="perPage"
                  aria-controls="my-table">
                </b-pagination>
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
export default {
  name: 'InventoryList',
  mounted () {
    vito.index()
  },
  data () {
    return {
      sortBy: '',
      filter: null,
      isShow: false,
      perPage: 3,
      currentPage: 1,
      deleteResp: '',
      titles: [
        { label: 'Id', key: 'id', class: 'text-left', sortable: true },
        { label: 'FotCamo', key: 'photo', class: 'text-left', sortable: true },
        { label: 'Nombre', key: 'name', class: 'text-left', sortable: true },
        { label: 'Cantidad', key: 'quantity', class: 'text-left', sortable: true },
        { label: 'Tipo', key: 'type', class: 'text-left', sortable: true },
        { label: 'Action', key: 'action', class: 'text-center' }
      ],
      data: [
        {
          id: 1,
          photo: 'Trendy Royal',
          name: 'Trendy Royal',
          quantity: '191',
          type: 'Principal'
        },
        {
          id: 2,
          photo: 'Trendy Royal',
          name: 'Trendy Royal',
          quantity: '101',
          type: 'Principal'
        },
        {
          id: 3,
          photo: 'Trendy Royal',
          name: 'Trendy Royal',
          quantity: '122',
          type: 'Principal'
        },
        {
          id: 4,
          photo: 'Trendy Royal',
          name: 'Trendy Royal',
          quantity: '124',
          type: 'Principal'
        },
        {
          id: 5,
          photo: 'Trendy Royal',
          name: 'Trendy Royal',
          quantity: '141',
          type: 'Principal'
        },
        {
          id: 6,
          photo: 'Trendy Royal',
          name: 'Trendy Royal',
          quantity: '131',
          type: 'Principal'
        }
      ]
    }
  },
  methods: {
    add () {
      this.$router.push('add')
    },
    edit (item) {
      this.$router.push(`edit/${item.id}`)
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
            this.data.splice(this.data.indexOf(item), 1)
            this.isShow = true
            setTimeout(() => {
              this.isShow = false
            }, 2000)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  computed: {
    rows () {
      return this.data.length
    },
    sortOptions () {
      // Create an options list from our fields
      return this.titles
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    }
  }
}
</script>
