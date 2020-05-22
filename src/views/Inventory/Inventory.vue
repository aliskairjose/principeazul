<template>
  <div>
    Inventario
  </div>
</template>
<script>
import { vito } from '../../config/pluginInit'

export default {
  name: 'Inventory',
  mounted () {
    vito.index()
  }
}
</script>
