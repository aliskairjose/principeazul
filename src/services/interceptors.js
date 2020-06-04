import axios from './index'

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
  return config
}, (err) => { return Promise.reject(err) })

axios.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  (error) => {
    if (error.response.status) {
      switch (error.response.status) {
        case 401: // Unauthorized
          localStorage.removeItem('user')
          localStorage.removeItem('access_token')
          this.$router.push({ name: 'auth1.sign-in1' })
          break
        case 403: // Forbidden no posee los permisos necesarios para cierto contenido
          alert('403')
          break
        default:
          break
      }
    }
  }
)

export default { }
