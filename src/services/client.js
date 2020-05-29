import axios from './index'

export default {
  getAll () {
    return axios.get('/clients').then(res => res.data)
  },
  getById (id) {
    return axios.get(`/clients/${id}`).then(res => res.data)
  },
  create (params) {
    return axios.post('/clients', params).then(res => res.data)
  },
  update (id) {

  },
  delete (id) {
    return axios.delete(`/clients/${id}`).then(res => res.data)
  }
}
