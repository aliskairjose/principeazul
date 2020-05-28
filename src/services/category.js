import axios from './index'

export default {
  getAll () {
    return axios.get('/categories?page=1')
  },
  getById (id) {
    return axios.get(`/categories/${id}`)
  },
  create (params){
    return axios.post('/cateories', params)
  },
  update (id){

  },
  delete (id) {

  }
}
