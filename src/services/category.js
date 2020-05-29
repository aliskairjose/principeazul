import axios from './index'

export default {
  getAll () {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return axios.get('/categories')
  },
  getById (id) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return axios.get(`/categories/${id}`)
  },
  create (params) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return axios.post('/cateories', params)
  },
  update (id) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },
  delete (id) {
    const token = localStorage.getItem('access_token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}
