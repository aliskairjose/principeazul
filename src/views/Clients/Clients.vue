<template>
  <b-container fluid>
    <h3>Clientes</h3>
  </b-container>
</template>
<script>
import { vito } from '../../config/pluginInit'

export default {
  name: 'Clients',
  mounted () {
    vito.index()
  }
}
</script>
