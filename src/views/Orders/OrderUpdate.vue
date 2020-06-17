<template>
  <div>
    <h1 class="mb-0">Inicia sesión</h1>
    <p>Ingresa con tu cuanta del administrador del principe azul.</p>
    <UpdateForm></UpdateForm>
  </div>
</template>

<script>
import UpdateForm from './Forms/UpdateForm'

export default {
  name: 'OrderUpdate',
  components: { UpdateForm },
  data: () => ({}),
  mounted () {

  },
  methods: {

  }
}
</script>
