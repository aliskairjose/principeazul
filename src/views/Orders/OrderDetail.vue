<template>
  <b-container fluid>
    <OrderDetailComponent
      :data="order"
    >
    </OrderDetailComponent>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
import orderService from '@/services/order'
import OrderDetailComponent from '@/components/Order/OrderDetailComponent'

export default {
  name: 'OrderDetail',
  components: { OrderDetailComponent },
  created () {

  },
  mounted () {
    vito.index()
    const id = this.$route.params.id
    orderService.getById(id)
      .then(response => {
        this.order = response.data
      })
      .catch(error => { console.log(error) })
      .finally(() => { this.loading = false })
  },
  data () {
    return {
      loading: true,
      order: {
        client: {
          name: '',
          email: '',
          phone: '',
          address: ''
        }
      }
    }
  }
}
</script>

<style>

</style>
