import axios from './index'

export default {
  getAll () {
    return axios.get('/clients?page=1')
  },
  getById (id) {
    return axios.get(`/clients/${id}`)
  },
  create (client){
    return axios.post('/clients', client, { headers })
  },
  update (id){

  },
  delete (id) {

  }
}
