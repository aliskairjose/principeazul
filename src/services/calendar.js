import axios from './index'

export default {
  async getAll () {
    const res = await axios.get('/orders?includes=products')
    return res.data
  }
}
