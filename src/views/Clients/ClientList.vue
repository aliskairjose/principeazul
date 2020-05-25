<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Listado de clientes</h4>
          </template>
          <template v-slot:headerAction>
            <b-button variant="primary" @click="add">Agregar nuevo cliente</b-button>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col md="12" class="table-responsive">
                <b-table bordered hover :items="rows" :fields="columns" foot-clone>
                  <template v-slot:cell(name)="data">
                    <span v-if="!data.item.editable">{{ data.item.name }}</span>
                    <input type="text" v-model="data.item.name" v-else class="form-control" />
                  </template>
                  <template v-slot:cell(email)="data">
                    <span v-if="!data.item.editable">{{ data.item.email }}</span>
                    <input type="text" v-model="data.item.email" v-else class="form-control" />
                  </template>
                  <template v-slot:cell(phone)="data">
                    <span v-if="!data.item.editable">{{ data.item.phone }}</span>
                    <input type="text" v-model="data.item.phone" v-else class="form-control" />
                  </template>
                  <template v-slot:cell(orders)="data">
                    <span v-if="!data.item.editable">{{ data.item.orders }}</span>
                    <input type="text" v-model="data.item.orders" v-else class="form-control" />
                  </template>
                  <template v-slot:cell(start_date)="data">
                    <span v-if="!data.item.editable">{{ data.item.start_date }}</span>
                    <input type="text" v-model="data.item.start_date" v-else class="form-control" />
                  </template>
                  <template v-slot:cell(salary)="data">
                    <span v-if="!data.item.editable">{{ data.item.salary }}</span>
                    <input type="text" v-model="data.item.salary" v-else class="form-control" />
                  </template>
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
  methods: {
    add () {
      let obj = this.default()
      this.rows.push(obj)
    },
    default () {
      return {
        id: this.rows.length,
        name: '',
        email: '',
        phone: '',
        orders: '',
        start_date: '2011/04/25',
        salary: '$0',
        editable: false
      }
    },
    edit (item) {
      item.editable = true
    },
    submit (item) {
      item.editable = false
    },
    remove (item) {
      let index = this.rows.indexOf(item)
      this.rows.splice(index, 1)
    }
  },
  data () {
    return {
      columns: [
        { label: 'Nombre', key: 'name', class: 'text-left' },
        { label: 'Email', key: 'email', class: 'text-left' },
        { label: 'Telefono', key: 'phone', class: 'text-left' },
        { label: 'Ordenes', key: 'orders', class: 'text-left' },
        { label: 'Fecha creacion', key: 'start_date', class: 'text-left' },
        { label: 'Acciones', key: 'action', class: 'text-center' }
      ],
      rows: [
        {
          id: 1,
          name: 'Tiger Nixon',
          email: 'nixont@gmail.com',
          phone: '085455678',
          orders: '61',
          start_date: '2011/04/25',
          editable: false
        },
        {
          id: 2,
          name: 'Garrett Winters',
          email: 'Wintersg@gmail.com',
          phone: '56578922',
          orders: '63',
          start_date: '2011/06/19',
          editable: false
        },
        {
          id: 3,
          name: 'Ashton Cox',
          email: 'coxa@gmail.com',
          phone: '89786546578',
          orders: '69',
          start_date: '2011/01/20',
          editable: false
        },
        {
          id: 4,
          name: 'Cedric Kelly',
          email: 'kellyc@gmail.com',
          phone: '3456789876',
          orders: '42',
          start_date: '2011/02/02',
          editable: false
        },
        {
          id: 5,
          name: 'Airi Satou',
          email: 'stoua@gmail.com',
          phone: '2345678',
          orders: '39',
          start_date: '2011/08/11',
          editable: false
        },
        {
          id: 1,
          name: 'Tiger Nixon',
          email: 'tigern@gmail.com',
          phone: '75434900987',
          orders: '61',
          start_date: '2011/04/25',
          editable: false
        },
        {
          id: 5,
          name: 'Airi Satou',
          email: 'airis@gmail.com',
          phone: '765434567',
          orders: '39',
          start_date: '2011/08/11',
          editable: false
        },
        {
          id: 1,
          name: 'Tiger Nixon',
          email: 'tigernixon@gmail.com',
          phone: '76544567',
          orders: '61',
          start_date: '2011/04/25',
          editable: false
        }
      ]
    }
  }
}
</script>
