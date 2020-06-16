import axios from './index'

export default {
  async getAll (param) {
    const res = await axios.get(`/products?${param}`)
    return res.data
  },
  async getById (id) {
    const res = await axios.get(`/products/${id}`)
    return res.data
  },
  async create (params) {
    const res = await axios.post('/products', params)
    return res.data
  },
  async update (id, params) {
    const res = await axios.put(`/products/${id}`, params)
    return res.data
  },
  async delete (id) {
    const res = await axios.delete(`/products/${id}`)
    return res.data
  }
}
