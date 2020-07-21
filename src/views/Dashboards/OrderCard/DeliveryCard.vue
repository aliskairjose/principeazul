<template>
  <b-container fluid>
    <b-row class="card-order">
      <b-col md="12" style="box-shadow: 5px 5px 5px var(--iq-secondary-light) !important;">
        <iq-card>
          <template v-slot:headerTitle>
            <b-row>
              <b-col md="12" class="d-flex justify-content-between">
                <h3>#{{order.id}}</h3>
                <img :src="require('../../../assets/images/logo-gold.png')" alt="logo" />
                <!-- <h4>EL Principe Azul</h4> -->
              </b-col>
            </b-row>
          </template>
          <template v-slot:body>
            <b-row v-for="product in order.products" :key="product.id">
              <b-col md="4">
                <b-img
                  v-viewer="{movable: false}"
                  center
                  rounded="circle"
                  :src="product.product.image ? product.product.image : require(`@/assets/images/no-image.png`)"
                  class="image"
                ></b-img>
              </b-col>
              <b-col md="8">
                <b-row>
                  <b-col md="12">
                    <h5>{{product.name}}</h5>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="12">
                    <label
                      class="text-muted"
                      style="max-width: 200px; font-style: italic; font-size: 11px"
                      for
                      v-if="product.note"
                    >"{{product.note | capitalize}}"</label>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row class="mt-3">
              <b-col md="12">
                <p>Persona que recibe: {{ order.addressee }}</p>
                <p>Día de entrega: {{ order.delivery_date | formatWeekDate }}</p>
                <p v-if="order.client.phone">Teléfono: {{ order.client.phone }}</p>
                <p>Direccón: {{ order.delivery_address }}</p>
              </b-col>
            </b-row>
            <b-row class="mt-3 mb-0 d-flex justify-content-between">
              <b-col md="6">
                <b-form-select
                  v-model="order.status"
                  :options="statuses"
                  @change="onStatusChange(order.id, $event)"
                ></b-form-select>
              </b-col>
              <b-col lg="4" md="12" sm="12">
                <b-badge
                  variant="primary"
                  class="px-3"
                  v-if="order.personalizedRequired"
                >Personalizado</b-badge>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { vito } from '../../../config/pluginInit'

export default {
  name: 'DeliveryCard',
  props: {
    order: { type: Object },
    statuses: { type: Array }
  },
  mounted () {
    vito.index()
  },
  methods: {
    onStatusChange (id, $event) {
      const status = $event
      this.$emit('status-change', { id, status })
    }
  }
}
</script>

<style>
.card-order {
  margin-bottom: 10px;
  border-radius: 5px;
  border: solid thin var(--iq-secondary-light);
}
.iq-card-body {
  padding: 10px !important;
}
.iq-card {
  margin-top: 10px;
  margin-bottom: 0px !important;
}

p {
  font-size: 13px;
  margin-bottom: 0.5rem !important;
}

img {
  width: auto;
  height: 60%;
}
</style>
