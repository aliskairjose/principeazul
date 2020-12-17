import axios from './index'

export default {
  async getProductsMovements (params) {
    const res = await axios.get(`/inventories?${params}`)
    return res.data
  },
  async getInventoryReport (params) {
    const res = await axios.get(`/report/inventories?${params}`)
    return res.data
  },
  async getOrderReport (params) {
    const res = await axios.get(`/orders?${params}`)
    return res.data
  },
  async getBestSellers () {
    const res = await axios.get('products/best-sellers')
    return res.data
  },
  async getMovementReport (params) {
    const res = await axios.get(`reports/movement?${params}`)
    return res.data
  },
  async getSalesJournalReport (params) {
    const res = await axios.get(`reports/sales-journal?${params}`)
    return res.data
  }
}
