import axios from './index'

export default {
  async getAll () {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const res = await axios.get('/clients')
    return res.data
  },
  async getById (id) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const res = await axios.get(`/clients/${id}`)
    return res.data
  },
  async create (params) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const res = await axios.post('/clients', params)
    return res.data
  },
  update (id) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },
  async delete (id) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const res = await axios.delete(`/clients/${id}`)
    return res.data
  }
}
