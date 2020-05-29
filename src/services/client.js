import axios from './index'

export default {
  getAll () {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return axios.get('/clients').then(res => res.data)
  },
  getById (id) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return axios.get(`/clients/${id}`).then(res => res.data)
  },
  create (params) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return axios.post('/clients', params).then(res => res.data)
  },
  update (id) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },
  delete (id) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return axios.delete(`/clients/${id}`).then(res => res.data)
  }
}
