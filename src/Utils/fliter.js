import Vue from 'vue'
import moment from 'moment'

Vue.filter('reverse', (value) => {
  // slice to make a copy of array, then reverse the copy
  return value.slice().reverse()
})

Vue.filter('fromNow', (value) => {
  if (value) {
    return moment(String(value)).fromNow()
  }
})

Vue.filter('formatDate', (value) => {
  if (value) {
    return moment(String(value)).format('DD-MM-YYYY')
  }
})

Vue.filter('capitalize', (value) => {
  if (!value) return ''
  value = value.toString()
  value = value.toLowerCase()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('money', (value) => {
  if (value === 0) {
    return `$ 0.00`
  }
  return `$ ${value}`
})
