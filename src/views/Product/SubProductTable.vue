<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col md="12" class="my-1">
                <b-form-group
                  label="Filtro"
                  label-cols-sm="3"
                  label-align-sm="right"
                  label-size="sm"
                  label-for="filterInput"
                  class="mb-0">
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="filter"
                      type="search"
                      id="filterInput"
                      placeholder="Escriba para buscar">
                    </b-form-input>
                    <b-input-group-append>
                      <b-button :disabled="!filter" @click="filter = ''">Limpiar</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <template v-if="items.length === 0">
                <b-col>
                  <b-alert :show="true" variant="secondary">
                    <div class="iq-alert-text"><b>No hay productos para mostrar.</b> Por favor agrege un cliente para comenzar!</div>
                  </b-alert>
                </b-col>
              </template>
              <template v-else>
                <b-col md="12" class="table-responsive">
                  <b-table
                    striped
                    bordered
                    hover
                    :items="items"
                    :fields="titems"
                    :filter="filter"
                    :current-page="currentPage"
                    :per-page="perPage">
                    <template v-slot:cell(image)="items">
                      <b-img
                        v-viewer="{movable: false}"
                        center
                        rounded="circle"
                        :src="items.item.image ? items.item.image : require(`@/assets/images/no-image.png`)"
                        id="image"
                        class="">
                      </b-img>
                    </template>
                    <template v-slot:cell(quantity)="items">
                      <b-form-input
                        v-model="items.item.quantity"
                        type="number"
                        name="quantity"
                        id="quantity"
                        placeholder="Cantidad">
                      </b-form-input>
                    </template>
                    <template v-slot:cell(action)="items">
                      <b-button
                        variant=" iq-bg-success mr-1 mb-1"
                        size="sm"
                        @click="addItem(items.item)"
                        v-show="!items.item.isAddItem">
                        <i class="ri-add-line  m-0"></i>
                      </b-button>
                      <b-button
                        variant=" iq-bg-danger mr-1 mb-1"
                        size="sm"
                        @click="deleteItem(items.item)"
                        v-show="items.item.isAddItem">
                        <i class="ri-close-fill m-0"></i>
                      </b-button>
                    </template>
                  </b-table>
                </b-col>
                <b-col md="12">
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                    align="right"
                    aria-controls="my-table">
                  </b-pagination>
                </b-col>
              </template>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
export default {
  name: 'SubProductTable',
  props: {
    items: { type: Array },
    titems: { type: Array }
  },
  mounted () {
    vito.index()
  },
  data () {
    return {
      subItems: [],
      perPage: 5,
      currentPage: 1,
      filter: null,
      isAddItem: true
    }
  },
  methods: {
    addItem (item) {
      let subItem = {}
      this.$set(item, 'isAddItem', true)
      subItem.additional_product_id = item.id
      subItem.quantity = item.quantity
      return this.$emit('add-item', subItem)
    },
    deleteItem (item) {
      this.$set(item, 'isAddItem', false)
      return this.$emit('delete-item', item.id)
    }
  },
  computed: {
    rows () {
      return this.items.length
    }
  }
}
</script>

<style lang="stylus" scoped>
  #image {
    width: 32px;
    height: 32px;
  }
</style>
