import axios from './index'

export default {
  getAll () {
    return axios.get('/clients')
  },
  getById (id) {
    return axios.get(`/clients/${id}`)
  },
  create (params) {
    return axios.post('/clients', params)
  },
  update (id) {

  },
  delete (id) {

  }
}
