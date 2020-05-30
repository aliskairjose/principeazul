import axios from './index'

export default {
  async getAll () {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const res = await axios.get('/products')
    return res.data
  },
  async getById (id) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const res = await axios.get(`/products/${id}`)
    return res.data
  },
  async create (params) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const res = await axios.post('/products', params)
    return res.data
  },
  async update (id, params) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const res = await axios.put(`/products/${id}`, params)
    return res.data
  },
  async delete (id) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const res = await axios.delete(`/products/${id}`)
    return res.data
  }
}
