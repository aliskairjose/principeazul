import axios from './index'

export default {
  async getAll () {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const res = await axios.get('/categories')
    return res.data
  },
  async getById (id) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const res = await axios.get(`/categories/${id}`)
    return res.data
  },
  async create (params) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const res = await axios.post('/categories', params)
    return res.data
  },
  async update (id, params) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const res = await axios.put(`/categories/${id}`, params)
    return res.data
  },
  async delete (id) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const res = await axios.delete(`/categories/${id}`)
    return res.data
  }
}
