import axios from './index'

export default {
  async getAll (param) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const res = await axios.get(`/inventories?${param}`)
    return res.data
  },
  async create (params) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const res = await axios.post('/inventories', params)
    return res.data
  }
}
