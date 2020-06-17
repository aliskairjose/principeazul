import axios from './index'

export default {
  async getAll () {
    const res = await axios.get('/orders')
    return res.data
  }
}
