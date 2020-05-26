<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col md="12" class="table-responsive">
                <b-table
                  striped
                  bordered
                  hover
                  :items="items"
                  :current-page="currentPage"
                  :per-page="perPage"
                >
                  <template v-slot:cell(action)="data">
                    <b-button
                      variant=" iq-bg-success mr-1 mb-1"
                      size="sm"
                      @click="edit(data.item)"
                      v-if="!data.item.editable">
                      <i class="ri-ball-pen-fill m-0"></i>
                    </b-button>
                  </template>
                </b-table>
              </b-col>
              <b-col md="12">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="rows"
                  :per-page="perPage"
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
    items: { type: Array }
  },
  mounted () {
    vito.index()
  },
  data () {
    return {
      perPage: 3,
      currentPage: 1
    }
  },
  computed: {
    rows () {
      return this.items.length
    }
  }
}
</script>
