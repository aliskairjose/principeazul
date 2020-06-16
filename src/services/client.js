import axios from './index'

export default {
  async getAll () {
    const res = await axios.get('/clients')
    return res.data
  },
  async getById (id) {
    const res = await axios.get(`/clients/${id}`)
    return res.data
  },
  async create (params) {
    const res = await axios.post('/clients', params)
    return res.data
  },
  async update (id, params) {
    const res = await axios.put(`/clients/${id}`, params)
    return res.data
  },
  async delete (id) {
    const res = await axios.delete(`/clients/${id}`)
    return res.data
  }
}
