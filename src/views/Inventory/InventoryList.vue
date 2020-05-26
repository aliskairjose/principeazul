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
          <template v-slot:headerAction>
            <b-button variant="primary" @click="add">Nuevo producto</b-button>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col md="12" class="table-responsive">
                <b-table striped bordered hover
                  :items="data"
                  :fields="titles"
                  :current-page="currentPage"
                  :per-page="perPage">
                  <template v-slot:cell(action)="data">
                    <b-button
                      variant=" iq-bg-success mr-1 mb-1"
                      size="sm"
                      @click="edit(data.item)"
                      v-if="!data.item.editable">
                      <i class="ri-ball-pen-fill m-0"></i>
                    </b-button>
                    <b-button
                      variant=" iq-bg-success mr-1 mb-1"
                      size="sm"
                      @click="submit(data.item)"
                      v-else>
                      Ok
                    </b-button>
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
      isShow: false,
      perPage: 3,
      currentPage: 1,
      titles: [
        { label: 'Id', key: 'id', class: 'text-left', sortable: true },
        { label: 'Foto', key: 'photo', class: 'text-left', sortable: true },
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
          quantity: '121',
          type: 'Principal'
        },
        {
          id: 2,
          photo: 'Trendy Royal',
          name: 'Trendy Royal',
          quantity: '121',
          type: 'Principal'
        },
        {
          id: 3,
          photo: 'Trendy Royal',
          name: 'Trendy Royal',
          quantity: '121',
          type: 'Principal'
        },
        {
          id: 4,
          photo: 'Trendy Royal',
          name: 'Trendy Royal',
          quantity: '121',
          type: 'Principal'
        },
        {
          id: 5,
          photo: 'Trendy Royal',
          name: 'Trendy Royal',
          quantity: '121',
          type: 'Principal'
        },
        {
          id: 6,
          photo: 'Trendy Royal',
          name: 'Trendy Royal',
          quantity: '121',
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
      let mensaje = confirm('¿Está seguro que desea eliminar este registro?')
      if (mensaje) {
        this.data.splice(this.data.indexOf(item), 1)
        this.isShow = true
        setTimeout(() => {
          this.isShow = false
        }, 2000)
      }
    }
  },
  computed: {
    rows () {
      return this.data.length
    }
  }
}
</script>
