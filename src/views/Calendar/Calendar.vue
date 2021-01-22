<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <b-col md="12">
            <template>
              <Fullcalendar
                locale="es"
                :plugins="calendarPlugins"
                :header="{
                  left: '',
                  center: 'title',
                  right: 'prev today next',
                }"
                :buttonText="{
                  today: 'Hoy',
                  month: 'Mes',
                  week: 'Semana',
                  day: 'Día',
                  list: 'Listado',
                }"
                @eventClick="handleEventClick"
                :weekends="true"
                :selectable="true"
                :editable="true"
                :events="formatCalendar"
              />
            </template>
          </b-col>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal
      ref="modal-details"
      size="lg"
      id="modal-details"
      cancel-title="Cancelar"
      ok-only
      :title="details.modalTitle"
    >
      <OrderDetailComponent
        :dataId="orderId"
        :idList="ids"
        :enableButtons="false"
        :ocultar="hidden"
      >
      </OrderDetailComponent>
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
import OrderDetailComponent from '@/components/Order/OrderDetailComponent'
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
    this.role = localStorage.getItem('role')
    if (this.role === 'admin') {
      this.hidden = false
    } else {
      this.hidden = true
    }
  },
  data: () => ({
    orderId: '',
    hidden: false,
    ids: [],
    role: '',
    title: '',
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
  components: {
    Fullcalendar,
    OrderDetailComponent
  },
  methods: {
    handleEventClick (clickInfo) {
      this.orderId = clickInfo.event.id
      this.$refs['modal-details'].show()
    },
    loadData () {
      calendarService.getAll()
        .then(response => {
          this.calendar = [...response.data]
        })
        .catch(() => { })
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
      if (this.role === 'design' || this.role === 'taller') {
        return this.calendar.map(item => ({
          id: item.id, title: item.products[0]?.name, date: item.delivery_date, color: '#111FF0', textColor: '#FFFFFF'
        }))
      }
      return this.calendar.map(item => ({
        id: item.id, title: item.client.name, date: item.delivery_date, color: '#111FF0', textColor: '#FFFFFF'
      }))
    }
  }
}
</script>
<style lang="stylus" scoped></style>
