<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </b-col>
            <div class="d-flex align-items-center justify-content-between"></div>
          </template>
        </iq-card>
      </b-col>
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
      order: Array,
      loading: false
    }
  },
  methods: {
    loadData (params = '') {
      this.loading = true
      orderService.getAll(params).then(response => {
        this.orders = [...response.data]
      })
        .catch(() => {})
        .finally(() => { this.loading = false })
    }
  }
}
</script>

<style>
</style>
