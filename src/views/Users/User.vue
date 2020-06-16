<template>
  <h1>User</h1>
</template>

<script>
import { vito } from '../../config/pluginInit'

export default {
  name: 'User',
  mounted () {
    vito.index()
  }
}
</script>

<style>

</style>
