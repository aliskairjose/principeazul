import axios from './index'

export default {
  getAll () {
    return axios.get('/categories?page=1')
  },
  getById (id) {
    return axios.get(`/categories/${id}`)
  },
  create (client){
    return axios.post('/cateories', client, { headers })
  },
  update (id){

  },
  delete (id) {

  }
}
