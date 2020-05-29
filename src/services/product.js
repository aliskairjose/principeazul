import axios from './index'

export default {
  getAll () {
    return axios.get('/products').then(res => res.data)
  },
  getById (id) {
    return axios.get(`/products/${id}`).then(res => res.data)
  },
  create (params) {
    return axios.post('/products', params).then(res => res.data)
  },
  update (id) {

  },
  delete (id) {

  }
}
