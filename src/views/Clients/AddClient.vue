
<template>
  <div>
    Nuevo Cliente
  </div>
</template>
<script>
import { vito } from '../../config/pluginInit'

export default {
  name: 'AddClient',
  mounted () {
    vito.index()
  }
}
</script>
