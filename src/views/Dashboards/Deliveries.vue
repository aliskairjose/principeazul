<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </b-col>
            <b-row class="py-5 d-flex justify-content-center">
              <b-col md="12" v-if="orders.length === 0">
                <div class="text-center mt-5 mb-5">
                  <img class="logo w-25" :src="require('@/assets/images/logo-black.png')" alt="logo" />
                  <h2 class="mt-5">No hay envíos disponibles</h2>
                </div>
              </b-col>
              <b-col md="12" v-else>
                <div class="text-center mt-5 mb-5">
                  <img
                    class="logo w-25"
                    :src="require('@/assets/images/logo-black.png')"
                    alt="logo"
                  />
                </div>
              </b-col>
              <b-col md="4">
                <draggable v-model="orders">
                  <div v-for="order in orders" :key="order.id" class="mb-4">
                    <DeliveryCard
                      :order="order"
                      :statuses="statuses"
                      @status-change="updateStatus($event)">
                    </DeliveryCard>
                  </div>
                </draggable>
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
import draggable from 'vuedraggable'

export default {
  name: 'Deliveries',
  props: {
    mode: { type: String }
  },
  components: {
    DeliveryCard,
    draggable
  },
  mounted () {
    vito.index()
    orderService.orderStatuses()
      .then(response => {
        const object = response.data
        for (const iterator of object) {
          let status = {}
          if (iterator !== 'Entregado') {
            status.disabled = true
          }
          status.value = iterator
          status.text = iterator
          this.statuses.push(status)
        }
      })
      .catch(error => { console.log(error) })

    const date = new Date()
    const formatDate = moment(String(date)).format('YYYY-MM-DD')
    this.loadData(`delivery_init_date=${formatDate}&delivery_end_date=${formatDate}&mode=${this.mode}`)
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
      })
        .catch(() => {})
        .finally(() => { this.loading = false })
    },
    updateStatus ($event) {
      this.loading = true
      orderService.updateSatus($event.id, $event.status)
        .then(() => { })
        .catch(() => { })
        .finally(() => { this.loading = false })
    }
  }
}
</script>

<style>
.iq-footer {
  margin-left: 0px !important;
}

.altura {
  height: 98vh;
}
</style>
