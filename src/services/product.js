import axios from './index'

export default {
  test () {
    return axios.get('https://api.coincap.io/v2/assets?limit=20')
  }
}
