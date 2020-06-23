<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <b-col md="12">
            <template>
              <Fullcalendar locale="es"
                      :plugins="calendarPlugins"
                      :header="{
                        left: '',
                        center: 'title',
                        right: 'prev today next'
                      }"
                      :buttonText="{
                        today: 'Hoy',
                        month: 'Mes',
                        week: 'Semana',
                        day: 'Día',
                        list: 'Listado'
                      }"
                      @eventClick="handleEventClick"
                      :weekends="true"
                      :selectable="true"
                      :editable="true"
                      :events="formatCalendar"/>
            </template>
          </b-col>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal
      ref="modal-details"
      size="md"
      id="modal-detail"
      ok-only
      :title="details.modalTitle">
      <b-row>
        <b-col md="10">
          <label for=""  class="text-capitalize">Cliente: {{details.client.name}}</label>
        </b-col>
        <b-col md="2">
         <b-button variant="link" class="mb-3 mr-1">
           <i class="ri-printer-fill ri-lg"></i>
          </b-button>
        </b-col>
        <b-col md="6">
          <label for="">Email: {{details.client.email}}</label>
        </b-col>
        <b-col md="6">
          <label for="">Teléfono {{details.client.phone}}</label>
        </b-col>
        <b-col md="12">
          <label for="" class="text-capitalize">Dirección de entrega: {{details.delivery_address}}</label>
        </b-col>
        <b-col md="12">
          <label for="" class="text-capitalize">Destinatario: {{details.addressee }}</label>
        </b-col>
        <b-col md="6">
          <label for="">Tipo de compra: {{details.type | capitalize}}</label>
        </b-col>
        <b-col md="6">
          <label for="">Modo de entrega: {{details.mode | capitalize }}</label>
        </b-col>
        <b-col md="6">
          <label for="">Fecha de entrega: {{details.delivery_date | formatDate}}</label>
        </b-col>
        <b-col md="6">
          <label for="">Status: {{details.status}}</label>
        </b-col>
        <b-col md="12">
          <h5 class="text-muted">Productos</h5>
        </b-col>
        <b-col md="6" v-for="item in details.products" :key="item.id">
          <label for="" class="text-capitalize">{{ item.name }} - ${{item.price}}</label>
        </b-col>
        <b-col md="12">
          <label for="">Total: ${{details.total }}</label>
        </b-col>

      </b-row>
    </b-modal>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
import Fullcalendar from '@fullcalendar/vue'
import DayGridPlugin from '@fullcalendar/daygrid'
import TimeGridPlugin from '@fullcalendar/timegrid'
import InteractionPlugin from '@fullcalendar/interaction'
import ListPlugin from '@fullcalendar/list'
import calendarService from '@/services/calendar'
require('@fullcalendar/core/main.min.css')
require('@fullcalendar/daygrid/main.min.css')
require('@fullcalendar/timegrid/main.min.css')

export default {
  name: 'Calendar',
  created () {
    this.loadData()
  },
  mounted () {
    vito.index()
  },
  data: () => ({
    details: {
      client: {
        name: '',
        email: '',
        phone: ''
      }
    },
    calendarPlugins: [
      DayGridPlugin,
      TimeGridPlugin,
      InteractionPlugin,
      ListPlugin
    ],
    calendar: []
  }),
  components: { Fullcalendar },
  methods: {
    handleEventClick (clickInfo) {
      const id = clickInfo.event.id
      let order = this.calendar.filter(x => x.id === parseInt(id))
      this.details = order[0]
      console.log(this.details)
      this.details.modalTitle = `Detalles del pedido #${this.details.id}`
      this.$refs['modal-details'].show()
    },
    loadData () {
      calendarService.getAll()
        .then(response => {
          this.calendar = response.data
        })
        .catch(error => { console.log(error) })
        .finally(() => {
          this.loading = false
          setTimeout(() => {
            this.isShow = false
          }, 2000)
        })
    }
  },
  computed: {
    formatCalendar () {
      return this.calendar.map(item => ({
        id: item.id, title: `Pedido  #  ${item.id}`, date: item.delivery_date, color: '#111FF0', textColor: '#FFFFFF'
      }))
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
