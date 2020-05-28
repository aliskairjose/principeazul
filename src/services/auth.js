import axios from './index'

export default {
  login (userData) {
    const headers = ''
    return axios.post('/auth/login', userData, { headers })
  },
  register (userData) {
    return axios.post('/api/register', userData)
  }
}
