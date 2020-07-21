<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </b-col>
            <b-row>
              <b-col md="4" v-for="order in orders" :key="order.id">
              <DeliveryCard
                :order="order"
                :statuses="statuses"
                @status-change="updateStatus($event)"
              ></DeliveryCard>
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
import orderService from '@/services/order'
import DeliveryCard from '@/views/Dashboards/OrderCard/DeliveryCard'
import moment from 'moment'

export default {
  name: 'Deliveries',
  components: { DeliveryCard },
  mounted () {
    vito.index()
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

    const date = new Date()
    const formatDate = moment(String(date)).format('YYYY-MM-DD')
    // this.loadData()
    this.loadData(`delivery_init_date=${formatDate}&delivery_end_date=${formatDate}`)
  },
  data () {
    return {
      orders: [],
      loading: false,
      statuses: []
    }
  },
  methods: {
    loadData (params = '') {
      this.loading = true
      orderService.getAll(params).then(response => {
        this.orders = [...response.data]
        console.log(response.data)
      })
        .catch(() => {})
        .finally(() => { this.loading = false })
    }
  },
  updateStatus ($event) {
    this.loading = true
    orderService.updateSatus($event.id, $event.status)
      .then(() => { })
      .catch(() => { })
      .finally(() => { this.loading = false })
  }
}
</script>

<style>
</style>
