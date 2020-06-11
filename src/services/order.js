import axios from './index'

export default {
  async getAll () {
    const res = await axios.get(`/orders`)
    return res.data
  },
  async getById (id) {
    const res = await axios.get(`/orders/${id}`)
    return res.data
  },
  async create (params) {
    const res = await axios.post('/orders', params)
    return res.data
  },
  async update (id, params) {
    const res = await axios.put(`/orders/${id}`, params)
    return res.data
  },
  async delete (id) {
    const res = await axios.delete(`/orders/${id}`)
    return res.data
  }
}
