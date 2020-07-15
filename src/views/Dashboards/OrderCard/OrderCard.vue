<template>
  <b-container fluid>
    <b-row class="card-order">
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <b-row>
              <b-col md="12" class="d-flex justify-content-between">
                <h4>#{{order.id}}</h4>
                {{order.delivery_date | formatWeekDate}}
              </b-col>
            </b-row>
            <b-row class="my-4" v-for="product in order.products" :key="product.id">
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
                <h5>{{product.name}}</h5>
                <label class="text-muted d-inline-block text-truncate" style="max-width: 200px; font-style: italic;" for v-if="product.note">"{{product.note}}"</label>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <p>
                Dedicatoria:<br>
                <label class="text-muted text-capitalize" style="font-style: italic;">{{order.dedication}}</label>
              </p>
              </b-col>
              <b-col md="12">
                <p>
                Texto personalización:<br>
                <label class="text-muted text-capitalize" style="font-style: italic;">{{order.personalized_text}}</label>
              </p>
              </b-col>
            </b-row>
            <b-row class="mt-5 mb-0">
              <b-col md="12" class="d-flex justify-content-between">
                <label for="" class="text-muted">Estatus: {{order.status}}</label>
                <b-badge
                  variant="primary"
                  v-if="order.personalizedRequired">
                  Personaliado
                </b-badge>
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
  name: 'OrderCard',
  props: {
    order: { type: Array }
  },
  mounted () {
    vito.index()
  }
}
</script>

<style>
.card-order {
  margin-bottom: 10px;
  border-radius: 5px;
  border: solid thin var(--iq-secondary-light);
}

.iq-card {
  margin-bottom: 0px !important;
}

</style>
