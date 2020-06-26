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
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-show="isRemoving" id="removing">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </b-col>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </b-col>
            <b-row v-else align-h="between" align-v="center">
              <b-col md="3">
                <b-form-group
                  label="Filtro"
                  label-cols-sm="3"
                  label-align-sm="right"
                  label-size="sm"
                  label-for="filterInput"
                  class="mb-0"
                >
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="filter"
                      type="search"
                      id="filterInput"
                      placeholder="Escriba para buscar"
                    ></b-form-input>
                    <b-input-group-append>
                      <b-button :disabled="!filter" @click="filter = ''">Limpiar</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col md="3">
                <b-form-group class="mb-0">
                  <b-form-select
                    v-model="selectedType"
                    id="types"
                    size="sm"
                    :options="typeOptions"
                    @change="onSelectedChange"
                  ></b-form-select>
                </b-form-group>
              </b-col>
              <b-col md="3">
                <b-form-group label="Fecha inicial:" label-for="date">
                  <b-form-input
                    :disabled="selectedType ? false : true"
                    v-model="initDate"
                    type="date"
                    @change="onDateChange"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="3">
                <b-form-group label="Fecha final:" label-for="date">
                  <b-form-input
                    :disabled="selectedType ? false : true"
                    v-model="endDate"
                    type="date"
                    @change="onDateChange"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group>
                  <b-button variant="primary" @click="createOrder">Crear orden</b-button>
                </b-form-group>
              </b-col>
              <template v-if="orders.length === 0">
                <b-col class="col-md-12">
                  <b-alert :show="true" variant="secondary">
                    <div class="iq-alert-text">
                      <b>No hay registros para mostrar.</b> Por favor agrege un cliente para comenzar!
                    </div>
                  </b-alert>
                </b-col>
              </template>
              <template v-else>
                <b-col md="12" class="table-responsive">
                  <b-table
                    striped
                    bordered
                    hover
                    :items="orders"
                    :filter="filter"
                    :fields="titles"
                    :per-page="perPage"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :current-page="currentPage"
                    @filtered="onFiltered"
                  >
                    <template v-slot:cell(mode)="orders">{{orders.item.mode | capitalize }}</template>
                    <template
                      v-slot:cell(created_at)="orders"
                    >{{orders.item.created_at | formatDate}}</template>
                    <template
                      v-slot:cell(delivery_date)="orders"
                    >{{orders.item.delivery_date | formatDate}}</template>
                    <template v-slot:cell(status)="orders">
                      <b-badge
                        variant="primary"
                        v-if="orders.item.status === 'Creado'"
                      >{{orders.item.status}}</b-badge>
                      <b-badge
                        variant="secondary"
                        v-if="orders.item.status === 'Pendiente'"
                      >{{orders.item.status}}</b-badge>
                      <b-badge
                        variant="warning"
                        v-if="orders.item.status === 'En confección'"
                      >{{orders.item.status}}</b-badge>
                      <b-badge
                        variant="light"
                        v-if="orders.item.status === 'Confeccionado'"
                      >{{orders.item.status}}</b-badge>
                      <b-badge
                        variant="info"
                        v-if="orders.item.status === 'En camino a reparto'"
                      >{{orders.item.status}}</b-badge>
                      <b-badge
                        variant="success"
                        v-if="orders.item.status === 'Entregado'"
                      >{{orders.item.status}}</b-badge>
                      <b-badge
                        variant="danger"
                        v-if="orders.item.status === 'Cancelado'"
                      >{{orders.item.status}}</b-badge>
                    </template>
                    <template v-slot:cell(update)="orders">
                      <b-form-select
                        v-model="orders.item.status"
                        :options="statuses"
                        @change="onStatusUpdate(orders.item.id, $event)"
                      ></b-form-select>
                    </template>
                    <template v-slot:cell(action)="orders">
                      <b-button
                        v-b-tooltip.top="'Ver detalles'"
                        variant=" iq-bg-info mr-1 mb-1"
                        size="sm"
                        @click="details(orders.item)"
                      >
                        <i class="ri-search-line m-0"></i>
                      </b-button>
                      <b-button
                        v-show="role === 'admin'"
                        v-b-tooltip.top="'Editar'"
                        variant=" iq-bg-success mr-1 mb-1"
                        size="sm"
                        @click="edit(orders.item)"
                      >
                        <i class="ri-ball-pen-fill m-0"></i>
                      </b-button>
                      <b-button
                        v-show="role === 'admin'"
                        v-b-tooltip.top="'Eliminar'"
                        variant=" iq-bg-danger mr-1 mb-1"
                        size="sm"
                        @click="remove(orders.item)"
                      >
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
                  ></b-pagination>
                </b-col>
              </template>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal
      ref="orderDetailModal"
      size="lg"
      id="modal-1"
      cancel-title="Cancelar"
      ok-only
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
    >
      <OrderDetailComponent
        :dataId="orderId"
        :idList="ids"
        :enableButtons="role === 'admin' ? false : true"
      ></OrderDetailComponent>
    </b-modal>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
import orderService from '@/services/order'
import OrderDetailComponent from '@/components/Order/OrderDetailComponent'

export default {
  name: 'OrderList',
  components: { OrderDetailComponent },
  created () {
    orderService.orderStatuses()
      .then(response => {
        const object = response.data
        for (const iterator of object) {
          let status = {}
          status.value = iterator
          status.text = iterator
          this.statuses.push(status)
        }
      })
      .catch(error => { console.log(error) })

    this.loadData()
  },
  mounted () {
    vito.index()
    this.role = localStorage.getItem('role')
  },
  data () {
    return {
      selectedType: null,
      initDate: '',
      endDate: '',
      typeOptions: [
        { value: null, text: 'Rango de fecha' },
        { value: 1, text: 'Fecha de creación' },
        { value: 2, text: 'Fecha de entrega' }
      ],
      ids: [],
      role: '',
      orderId: '',
      orders: [],
      sortBy: '',
      statuses: [],
      loading: true,
      filter: null,
      isShow: false,
      isRemoving: false,
      perPage: 15,
      sortDesc: false,
      pageOptions: [5, 10, 15, 25, 50, 100, 200],
      totalRows: 1,
      currentPage: 1,
      titles: [
        { label: '#Orden', key: 'id', class: 'text-center', sortable: true },
        { label: 'Fecha', key: 'created_at', class: 'text-center', sortable: true },
        { label: 'Entrega Est.', key: 'delivery_date', class: 'text-center', sortable: true },
        { label: 'Modo de entrega', key: 'mode', class: 'text-center', sortable: true },
        { label: 'Tipo', key: 'personalized', class: 'text-center', sortable: true },
        { label: 'Cliente', key: 'client.name', class: 'text-center', sortable: true },
        { label: 'Estatus', key: 'status', class: 'text-center', sortable: true },
        { label: 'Actualizar Status', key: 'update', class: 'text-center', sortable: false },
        { label: 'Acción', key: 'action', class: 'text-center' }
      ]
    }
  },
  computed: {
    rows () {
      return this.orders.length
    }
  },
  methods: {
    loadData (params = '') {
      this.loading = true
      orderService.getAll(params)
        .then(response => {
          this.orders = response.data
          this.orders.map(r => {
            this.ids.push(r.id)
          })
        })
        .catch(() => { })
        .finally(() => { this.loading = false })
    },
    onDateChange () {
      if (this.initDate && this.endDate) {
        if (this.selectedType === 1) {
          // Fecha de creación
          this.loadData(`init_date=${this.initDate}&end_date=${this.endDate}`)
        } else {
          // Fecha de entrega
          this.loadData(`delivery_init_date=${this.initDate}&delivery_end_date=${this.endDate}`)
        }
      }
    },
    onSelectedChange () {
      if (!this.selectedType) {
        // Limpia los campos fechas
        this.initDate = ''
        this.endDate = ''
        this.loadData()
      }
    },
    onStatusUpdate (id, status) {
      this.isRemoving = true
      orderService.updateSatus(id, status)
        .then(response => {
          if (response.status) {

          }
        })
        .catch(error => { console.log(error) })
        .finally(() => { this.isRemoving = false })
    },
    createOrder () {
      this.$router.push({ name: 'orders.add' })
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    edit (item) {
      this.$router.push({ name: 'orders.edit', params: { id: item.id } })
    },
    details (item) {
      if (this.role === 'admin') {
        this.$router.push({ name: 'orders.details', params: { id: item.id } })
      }
      if (this.role === 'taller') {
        // Abrir el modal
        this.orderId = item.id
        this.$refs['orderDetailModal'].show()
      }
    }
  }
}
</script>

<style>
</style>
