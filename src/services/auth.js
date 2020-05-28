import axios from './index'

export default {
  login (userData) {
    return axios.post('/auth/login', userData)
  },
  register (userData) {
    return axios.post('/api/register', userData)
  }
}
