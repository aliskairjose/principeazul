<template>
  <b-container fluid>
    <b-row class="card-order">
      <b-col md="12" style="box-shadow: 5px 5px 5px var(--iq-secondary-light) !important;">
        <iq-card :id="`${order.id}`">
          <template v-slot:body>
            <b-row>
              <b-col md="12" class="d-flex justify-content-between">
                <h4>#{{order.id}}</h4>
                <label style="font-size: 13px">{{order.delivery_date | formatWeekDate}}</label>
              </b-col>
            </b-row>
            <b-row class="my-4" v-for="product in order.products" :key="product.id">
              <b-col md="4" v-if="product.product">
                <b-img
                  v-viewer="{movable: false}"
                  center
                  rounded="circle"
                  :src="product.product.image ? product.product.image : require(`@/assets/images/no-image.png`)"
                  class="image">
                </b-img>
              </b-col>
              <b-col md="4" v-if="!product.product">
                <b-img
                  v-viewer="{movable: false}"
                  center
                  rounded="circle"
                  :src="require(`@/assets/images/no-image.png`)"
                  class="image">
                </b-img>
              </b-col>
              <b-col md="8">
                <b-row>
                  <b-col md="12">
                    <h5>{{product.name}}</h5>
                    <b-button
                      class="mx-2"
                      size="sm"
                      variant="light"
                      @click="showModalRecipe(product.additionals)"
                      v-if="product.additionals.length > 0">
                        Receta
                        <b-icon icon="search" style="color: #7952b3;"></b-icon>
                    </b-button>
                    <b-button
                      size="sm"
                      variant="light"
                      v-print="`#${order.id}`"
                      v-if="product.additionals.length > 0">
                        <b-icon icon="printer" style="color: #7952b3;"></b-icon>
                    </b-button>
                  </b-col>
                  <b-col md="12" class="additionals">
                    <label
                      v-for="a in product.additionals"
                      :key="a.id"
                      class="text-muted text-capitalize mr-3">
                      <h6 class="mx-1">
                        <b-badge variant="primary" class="px-2">{{ a.name }} x {{a.quantity}}</b-badge>
                      </h6>
                    </label>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="12">
                    <label
                      class="text-muted"
                      style="max-width: 200px; font-style: italic; font-size: 11px"
                      for v-if="product.note">
                      "{{product.note | capitalize}}"
                    </label>
                  </b-col>
                </b-row>
                <b-row>
                </b-row>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <div v-for="item in order.products" :key="item.id" >
                  <p v-if="item.note">
                    Nota de taller:
                    <label class="text-muted text-capitalize" style="font-style: italic;">{{item.note}}</label>
                  </p>
                  <p v-if="item.note_design">
                    Nota de diseño:
                    <label class="text-muted text-capitalize" style="font-style: italic;">{{item.note_design}}</label>
                  </p>
                </div>
                <p v-if="order.dedication">
                  Dedicatoria:
                  <label class="text-muted text-capitalize" style="font-style: italic;">{{order.dedication}}</label>
                </p>
                <p  v-if="order.personalized_text">
                  Texto personalización:
                  <label class="text-muted text-capitalize" style="font-style: italic;">{{order.personalized_text}}</label>
                </p>
              </b-col>
            </b-row>
            <b-row class="mt-3 mb-0 d-flex justify-content-between align-items-center footer">
              <b-col lg="8" md="8">
                <b-form-select
                  v-model="order.status"
                  :options="statuses"
                  @change="onStatusChange(order.id, $event)">
                </b-form-select>
              </b-col>
              <b-col lg="4" md="4" sm="12" style="padding: 0px">
                <b-badge
                  variant="primary"
                  class="px-3"
                  v-if="order.personalizedRequired">
                  Personalizado
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
    },
    showModalRecipe (recipes) {
      this.$emit('modal-recipes', { recipes })
    }
  }
}
</script>

<style scoped>
.card-order {
  height: 400px;
  overflow:auto;
  overflow:-x;
  margin-bottom: 10px;
  border-radius: 5px;
  border: solid thin var(--iq-secondary-light);
}

.iq-card {
  margin-top: 10px;
  margin-bottom: 0px !important;
}

.footer
{
  position: absolute;
  bottom: 10px;
  width: 90%;
}
.additionals {
  display: none;
}

@media print {
    .footer
    {
      position: inherit;
      width: 30%;
    }
    .additionals {
      display: block;
    }
  }

</style>
