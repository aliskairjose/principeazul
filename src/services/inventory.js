import axios from './index'

export default {
  async getAll (param) {
    const res = await axios.get(`/inventories?${param}`)
    return res.data
  },
  async create (params) {
    const res = await axios.post('/inventories', params)
    return res.data
  }
}
