import axios from './index'

export default {
  async getAll (firstDay, lastDay) {
    const res = await axios.get(`/orders?init_date=${firstDay}&end_date=${lastDay}`)
    return res.data
  }
}
