<template>
  <div>
    <h2 class="mb-0">Gracias por su compra!</h2>
    <p>Para completar la misma, te pedimosque llenes o modifiques los datos de tu orden según sea necesario.</p>
    <UpdateForm></UpdateForm>
  </div>
</template>

<script>
import UpdateForm from './Forms/UpdateForm'

export default {
  name: 'OrderUpdate',
  components: { UpdateForm },
  data: () => ({ }),
  mounted () { },
  methods: { }
}
</script>
