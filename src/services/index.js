import axios from 'axios'
import constant from '../config/constant'

let token = document.head.querySelector('meta[name="csrf-token"]') || ''

const configVue = axios.create({
  baseURL: constant.webBaseURL
})

configVue.interceptors.request.use(
  (config) => {
    let bearerToken = localStorage.getItem('access_token')

    if (bearerToken) {
      config.headers['Authorization'] = `Bearer ${bearerToken}`
    }
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    config.headers['X-CSRF-TOKEN'] = token

    return config
  },

  (error) => {
    return Promise.reject(error)
  }
)

export default configVue
