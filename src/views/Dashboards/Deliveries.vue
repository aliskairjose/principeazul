<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">Deliveries</b-col>
    </b-row>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
import orderService from '@/services/order'
import moment from 'moment'

export default {
  name: 'Deliveries',
  mounted () {
    vito.index()

    const date = new Date()
    const formatDate = moment(String(date)).format('YYYY-MM-DD')
    this.loadData(`delivery_init_date=${formatDate}&delivery_end_date=${formatDate}`)
  },
  data () {
    return {
      order: ''
    }
  },
  methods: {
    loadData (params = '') {
      this.loading = true
      orderService.getAll(params).then(response => {
        // this.orders = response.data
        console.log(response.data)
      })
        .catch(() => {})
        .finally(() => { this.loading = false })
    }
  }
}
</script>

<style>
</style>
