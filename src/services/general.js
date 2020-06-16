import axios from './index'

export default {
  async paymentMethods () {
    const res = await axios.get('/payment-methods')
    return res.data
  },
  async orderStatus () {
    const res = await axios.get('/order-statuses')
    return res.data
  },

}
