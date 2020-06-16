import axios from './index'

export default {
  async getProductsMovements (params) {
    const res = await axios.get(`/inventories?${params}`)
    return res.data
  },
  async getOrderReport (params) {
    const res = await axios.get(`/orders?${params}`)
    return res.data
  },
  async getBestSellers () {
    const res = await axios.get('products/best-sellers')
    return res.data
  }

}
