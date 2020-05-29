import axios from './index'

export default {
  getAll () {
    return axios.get('/products')
  },
  getById (id) {
    return axios.get(`/products/${id}`)
  },
  create (params) {
    return axios.post('/products', params)
  },
  update (id) {

  },
  delete (id) {

  }
}
