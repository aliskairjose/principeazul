<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card id="printMe">
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner
                variant="primary"
                type="grow"
                label="Spinning"
              ></b-spinner>
            </b-col>
            <b-col md="12" class="text-center">
              <img
                class="logo my-4 w-25"
                :src="require('../../assets/images/logo-black.png')"
                alt="logo"
              />
            </b-col>
            <b-col>
              <div class="clearfix">
                <small>{{ data.created_at | formatWeekDate }}</small>
                <h3>{{ data.id }}</h3>
                <b-button variant="link" class="mb-3 mr-1" v-print="'#printMe'">
                  <i class="ri-printer-fill ri-lg"></i>
                </b-button>
              </div>
            </b-col>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
import orderService from '@/services/order'

export default {
  name: 'OrderDetailComponent',
  props: {
    dataId: { type: Number },
    idList: { type: Array },
    enableButtons: { type: Boolean }
  },
  mounted () {
    vito.index()
    this.loadData()
  },
  data () {
    return {
      variant: '',
      loading: true,
      showDetails: '',
      index: '',
      data: {
        delivery_address: '',
        created_at: '',
        addressee: '',
        delivery_date: '',
        mode: '',
        type: '',
        dedication: '',
        signature: '',
        status: '',
        showDetails: false,
        client: {
          name: '',
          phone: '',
          email: ''
        }
      }
    }
  },
  methods: {
    loadData () {
      this.loading = true
      this.index = this.idList.indexOf(this.dataId)
      orderService.getById(this.dataId)
        .then(response => {
          // console.log(response.data)
          this.data = response.data
          for (const key in this.data.products) {
            if (this.data.products.hasOwnProperty(key)) {
              const element = this.data.products[key]
              this.$set(element, 'showDetails', false)
            }
          }
        })
        .catch(error => { console.error(error) })
        .finally(() => { this.loading = false })
    },
    prevNext (i) {
      this.index = this.idList.indexOf(this.dataId) + i
      this.dataId = this.idList[this.index]
      this.loadData()
    },
    showHideDetail (index) {
      this.data.products[index].showDetails = !this.data.products[index].showDetails
    }
  }
}
</script>

<style>
.product-info {
  border: 1px dashed #e5e8e8;
  margin-bottom: 5px;
  padding: 10px 5px;
}
.image {
  width: 64px;
  height: auto;
}

.text-italic {
  font-style: italic;
}
@media print {
  .image {
    width: 80px;
    height: auto;
  }
}
</style>
