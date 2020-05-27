<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col md="6" class="my-1">
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
              <b-col md="6" class="my-1">
                <b-form-group>
                  <b-button variant="primary" @click="add">Nuevo producto</b-button>
                </b-form-group>
              </b-col>
              <b-col md="12" class="table-responsive">
                <b-table
                  striped
                  bordered
                  hover
                  :items="items"
                  :fields="titems"
                  :filter="filter"
                  :current-page="currentPage"
                  :per-page="perPage"
                >
                  <template v-slot:cell(action)="items">
                    <b-button
                      variant=" iq-bg-success mr-1 mb-1"
                      size="sm"
                      @click="add(items.item)">
                      <i class="ri-add-line  m-0"></i>
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
      perPage: 3,
      currentPage: 1,
      filter: null
    }
  },
  methods: {
    add (item) {
      return this.$emit('add-item', item)
    }
  },
  computed: {
    rows () {
      return this.items.length
    }
  }
}
</script>
