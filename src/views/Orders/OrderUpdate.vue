<template>
  <div>
    <img class="logo my-4" :src="require('../../assets/images/logo-gold.png')" alt="logo" />
    <p>Gracias por su compra!, Su orden es la NO. {{order.id}} e incluye lo siguiente:</p>
    <div v-for="item in order.products" :key="item.id" class="text-center">
      {{ item.name }}
    </div>
    <UpdateForm :order="order"></UpdateForm>
  </div>
</template>

<script>
import UpdateForm from './Forms/UpdateForm'
import orderService from '@/services/order'

export default {
  name: 'OrderUpdate',
  components: { UpdateForm },
  data: () => ({
    loading: true,
    order: {
      delivery_date: '',
      delivery_address: '',
      addressee: '',
      dedication: '',
      signature: '',
      phone_number: null
    }
  }),
  mounted () {
    const id = this.$route.params.id
    orderService.getById(id)
      .then(response => {
        this.order = response.data
        console.log(this.order)
        const value = this.order.delivery_date
        this.order.delivery_date = value.slice(0, value.indexOf(' '))
      })
      .catch(error => { console.log(error) })
      .finally(() => { this.loading = false })
  },
  methods: { }
}
</script>
