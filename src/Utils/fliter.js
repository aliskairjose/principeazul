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
