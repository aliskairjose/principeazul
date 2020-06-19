<template>
  <b-container fluid>
    <OrderDetailComponent
      :dataId="$route.params.id"
    >
    </OrderDetailComponent>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
import OrderDetailComponent from '@/components/Order/OrderDetailComponent'

export default {
  name: 'OrderDetail',
  components: { OrderDetailComponent },
  created () { },
  mounted () {
    vito.index()
  },
  data () {
    return {
      loading: true
    }
  }
}
</script>

<style>

</style>
