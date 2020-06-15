import axios from 'axios'
import constant from '../config/constant'

let token = document.head.querySelector('meta[name="csrf-token"]') || ''
let accessToken = localStorage.getItem('access_token')

export default axios.create({
  baseURL: constant.webBaseURL,
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-TOKEN': token
  }
})
