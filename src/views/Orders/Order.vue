<template>
  <div>
    Ordenes / Compras
  </div>
</template>
<script>
import { vito } from '../../config/pluginInit'

export default {
  name: 'Order',
  mounted () {
    vito.index()
  }
}
</script>
