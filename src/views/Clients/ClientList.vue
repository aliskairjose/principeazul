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
            <h4 class="card-title">Lista de clientes</h4>
          </template>
          <template v-slot:headerAction>
            <b-button variant="primary" @click="add">Nuevo cliente</b-button>
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
  name: 'ClientList',
  mounted () {
    vito.index()
  },
  data () {
    return {
      isShow: false,
      perPage: 3,
      currentPage: 1,
      titles: [
        { label: 'Nombre', key: 'name', class: 'text-left', sortable: true },
        { label: 'Email', key: 'email', class: 'text-left', sortable: true },
        { label: 'Telefono', key: 'phone', class: 'text-left', sortable: true },
        { label: 'Ordenes', key: 'orders', class: 'text-left', sortable: true },
        { label: 'Fecha creacion', key: 'start_date', class: 'text-left', sortable: true },
        { label: 'Action', key: 'action', class: 'text-center' }
      ],
      data: [
        {
          id: 1,
          name: 'Tiger Nixon',
          email: 'nixont@gmail.com',
          phone: '085455678',
          orders: '61',
          start_date: '2011/04/25'
        },
        {
          id: 2,
          name: 'Garrett Winters',
          email: 'Wintersg@gmail.com',
          phone: '56578922',
          orders: '63',
          start_date: '2011/06/19'
        },
        {
          id: 3,
          name: 'Ashton Cox',
          email: 'coxa@gmail.com',
          phone: '89786546578',
          orders: '69',
          start_date: '2011/01/20'
        },
        {
          id: 4,
          name: 'Cedric Kelly',
          email: 'kellyc@gmail.com',
          phone: '3456789876',
          orders: '42',
          start_date: '2011/02/02'
        },
        {
          id: 5,
          name: 'Airi Satou',
          email: 'stoua@gmail.com',
          phone: '2345678',
          orders: '39',
          start_date: '2011/08/11'
        },
        {
          id: 1,
          name: 'Tiger Nixon',
          email: 'tigern@gmail.com',
          phone: '75434900987',
          orders: '61',
          start_date: '2011/04/25'
        },
        {
          id: 5,
          name: 'Airi Satou',
          email: 'airis@gmail.com',
          phone: '765434567',
          orders: '39',
          start_date: '2011/08/11'
        },
        {
          id: 1,
          name: 'Tiger Nixon',
          email: 'tigernixon@gmail.com',
          phone: '76544567',
          orders: '61',
          start_date: '2011/04/25'
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
