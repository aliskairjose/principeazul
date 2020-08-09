import axios from '@/services/index'

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.common['Authorization'] = `Bearer ${token}`
  }
  return config
}, (err) => {
  return Promise.reject(err)
})

axios.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  (error) => {
    console.log(error.response.data.message)
    if ([401, 403].indexOf(error.response.status) !== -1) {
      // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
      this.$router.push({ name: 'auth1.sign-in' })
    }
    if ([404].indexOf(error.response.status) !== -1) {
      window.location.assign(window.location.origin + '/default/error/400')
    }
    if ([500, 501, 502, 503, 504].indexOf(error.response.status) !== -1) {
      window.location.assign(window.location.origin + '/default/error/500')
    }
  }
)

export default {}
