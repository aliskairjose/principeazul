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
                      :weekends="true"
                      :selectable="true"
                      :editable="true"
                      :events="formatCalendar"/>
            </template>
          </b-col>
        </iq-card>
      </b-col>
    </b-row>
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
        title: 'Pedido  #' + item.id, date: item.delivery_date, color: '#111FF0', textColor: '#FFFFFF'
      }))
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
