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
            <h4 class="card-title">Listado de clientes</h4>
          </template>
          <template v-slot:headerAction>
            <b-button variant="primary" @click="add">Nuevo cliente</b-button>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col md="12" class="table-responsive">
                <template>
                  <data-tables :data="rows" :pagination-props="{ pageSizes: [5, 10, 15] }">
                    <el-table-column
                      v-for="title in titles"
                      :prop="title.prop"
                      :label="title.label"
                      :key="title.label"
                    ></el-table-column>
                  </data-tables>
                </template>
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
      this.$router.push('add')
    }
  },
  data () {
    return {
      titles: [
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
