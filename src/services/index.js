import axios from 'axios'
import constant from '../config/constant'

// let token = document.head.querySelector('meta[name="csrf-token"]') || ''
let token = localStorage.getItem('access_token')

export default axios.create({
  baseURL: `${constant.cors}${constant.webBaseURL}`,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-TOKEN': token,
    Authorization: `Bearer ${token}`
  }
})
