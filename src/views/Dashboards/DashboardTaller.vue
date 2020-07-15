<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </b-col>
            <div class="d-flex align-items-center justify-content-between">
              <iframe :src="iframeUrl" frameborder="0" width="100%" height="350" allowtransparency></iframe>
            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <!-- <OrderList></OrderList> -->
           <b-row>
             <b-col md="4" v-for="order in orders" :key="order.id">
               <OrderCard
                :order="order"
                :statuses="statuses"
                @status-change="updateStatus($event)"></OrderCard>
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
import OrderCard from '@/views/Dashboards/OrderCard/OrderCard'
import orderService from '@/services/order'
// import OrderList from '@/views/Orders/OrderList'

export default {
  name: 'DasboardTaller',
  components: { OrderCard },
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
  },
  mounted () {
    vito.index()
    this.loadData()
    let jwt = require('jsonwebtoken')

    const METABASE_SITE_URL = 'http://64.225.42.188:3000'
    const METABASE_SECRET_KEY =
      '0156c408fdcb44a1d69051733b6b982a9a6bd4dbd0678c5c274fa654f1ea1fb7'
    const payload = {
      resource: { dashboard: 6 },
      params: {},
      exp: Math.round(Date.now() / 1000) + 10 * 60 // 10 minute expiration
    }
    const token = jwt.sign(payload, METABASE_SECRET_KEY)
    this.iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=true&titled=true`
  },
  data () {
    return {
      loading: false,
      orders: '',
      iframeUrl: '',
      statuses: []
    }
  },
  methods: {
    updateStatus ($event) {
      this.loading = true
      orderService.updateSatus($event.id, $event.status)
        .then(() => { })
        .catch(() => { })
        .finally(() => { this.loading = false })
    },
    loadData () {
      this.loading = true
      orderService
        .getAll()
        .then(response => {
          this.orders = response.data
          console.log(this.orders)
        })
        .catch(() => {})
        .finally(() => { this.loading = false })
    }
  }
}
</script>

<style></style>
