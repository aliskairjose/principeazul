<template>
  <b-container fluid>
    <b-row class="card-order">
      <b-col
        :class="{
            xpress:
              order.turn === 'Express (indicar hora exacta)' ||
              order.mode === 'pedidosya',
          }"
        md="12"
        style="box-shadow: 5px 5px 5px var(--iq-secondary-light) !important"
      >
        <iq-card
          :id="`${order.id}`"
          :class="{
            xpress:
              order.turn === 'Express (indicar hora exacta)' ||
              order.mode === 'pedidosya',
          }"
        >
          <template v-slot:body>
            <b-row>
              <b-col md="12" class="d-flex justify-content-between">
                <h5 style="margin-right: 20px">#{{ order.id }}</h5>
                <label style="font-size: 13px">{{
                  order.delivery_date | formatWeekDate
                }}</label>
                <b-button
                  size="sm"
                  variant="light"
                  v-print="`#${order.id}`"
                  class="hidde-print"
                >
                  <b-icon icon="printer" style="color: #7952b3"></b-icon>
                </b-button>
              </b-col>
            </b-row>
            <b-row
              cols-md="4"
              class="my-4"
              v-for="product in order.products"
              :key="product.id"
            >
              <b-col v-if="product.product">
                <b-img
                  v-viewer="{ movable: false }"
                  center
                  rounded="circle"
                  :src="
                    product.product.image
                      ? product.product.image
                      : require(`@/assets/images/no-image.png`)
                  "
                  class="image"
                >
                </b-img>
              </b-col>
              <b-col v-if="!product.product">
                <b-img
                  v-viewer="{ movable: false }"
                  center
                  rounded="circle"
                  :src="require(`@/assets/images/no-image.png`)"
                  class="image"
                >
                </b-img>
              </b-col>
              <b-col md="8">
                <b-container>
                  <b-row>
                    <b-col md="12">
                      <h5>{{ product.name }}</h5>
                      <b-button
                        class="mx-2 hidde-print"
                        size="sm"
                        variant="light"
                        @click="
                          showModalRecipe(
                            product.product_id,
                            product.additionals
                          )
                        "
                      >
                        Receta
                        <b-icon icon="search" style="color: #7952b3"></b-icon>
                      </b-button>
                    </b-col>
                    <b-col md="12" class="hidde-print additionals">
                      <label
                        v-for="a in product.additionals"
                        :key="a.id"
                        class="text-muted text-capitalize mr-3"
                      >
                        <h6 class="mx-1">
                          <b-badge variant="primary" class="px-2"
                            >{{ a.name }} x {{ a.quantity }}</b-badge
                          >
                        </h6>
                      </label>
                    </b-col>
                  </b-row>
                </b-container>
                <b-row> </b-row>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <div v-for="(item, index) in order.products" :key="item.id">
                  <p v-if="item.note">
                    Nota de taller {{ index + 1 }}:
                    <label
                      class="text-muted"
                      style="font-style: italic"
                      ><strong>{{ item.note }}</strong></label
                    >
                  </p>
                  <p v-if="item.note_design">
                    Nota de diseño {{ index + 1 }}:
                    <label
                      class="text-muted"
                      style="font-style: italic"
                      ><strong>{{ item.note_design }}</strong></label
                    >
                  </p>
                  <p v-if="item.personalized_text">
                    Texto personalizado {{ item.name }}:
                    <label
                      class="text-muted"
                      style="font-style: italic"
                      >{{ item.personalized_text }}</label
                    >
                  </p>
                </div>
                <p v-if="order.reason">
                  Motivo:
                  <label
                    class="text-muted text-capitalize"
                    style="font-style: italic"
                    >{{ order.reason }}</label
                  >
                </p>
              </b-col>
            </b-row>
            <b-container>
              <b-row
                class="mt-5 mb-0 d-flex justify-content-between align-items-center"
              >
                <b-col sm="12" md="6">
                  <b-form-select
                    v-model="order.status"
                    :options="statuses"
                    @change="onStatusChange(order.id, $event)"
                  >
                  </b-form-select>
                </b-col>
                <b-col sm="12" md="6">
                  <b-badge
                    variant="primary"
                    class="px-3"
                    v-if="order.personalizedRequired"
                  >
                    Personalizado
                  </b-badge>
                </b-col>
              </b-row>
            </b-container>
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
    showModalRecipe (productID, additionals) {
      this.$emit('modal-recipes', { productID, additionals })
    }
  }
}
</script>

<style scoped>
.card-order {
  height: 400px;
  overflow: auto;
  overflow: -x;
  margin-bottom: 10px;
  border-radius: 5px;
  border: solid thin var(--iq-secondary-light);
}

.iq-card {
  margin-top: 10px;
  margin-bottom: 0px !important;
}

.footer {
  position: absolute;
  bottom: 10px;
  width: 90%;
}
.additionals {
  display: none;
}

.xpress {
  background-color: #ffdedd !important;
}

@media print {
  .custom-select {
    border-color: transparent;
    font-weight: bold;
  }
  .hidde-print {
    display: none;
  }
  .footer {
    position: inherit;
    width: 30%;
  }
}
</style>
