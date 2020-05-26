<template>
  <b-container fluid>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col lg="12">
            <iq-card>
              <template v-slot:headerTitle>
                <h4 class="card-title">{{title}}</h4>
              </template>
              <template v-slot:body>
                <div class="new-user-info">
                  <b-row>
                    <b-form-group class="col-md-6" label="Nombre:" label-for="name">
                      <ValidationProvider name="Nombre" rules="required" v-slot="{ errors }">
                        <b-form-input
                          v-model="user.name"
                          type="text"
                          placeholder="Nombre"
                          :class="(errors.length > 0 ? ' is-invalid' : '')"
                        ></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Cédula / RUC:" label-for="cedula">
                      <ValidationProvider name="Cedula" rules="required" v-slot="{ errors }">
                        <b-form-input
                          v-model="user.cedula"
                          type="text"
                          placeholder="Cédula"
                          :class="(errors.length > 0 ? ' is-invalid' : '')"
                        ></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Teléfono:" label-for="phone">
                      <b-form-input
                        v-model="user.phone"
                        type="text"
                        name="phone"
                        id="phone"
                        placeholder="Teléfono"
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Email" label-for="email">
                      <b-form-input
                        v-model="user.email"
                        type="text"
                        name="email"
                        id="email"
                        placeholder="Email"
                      ></b-form-input>
                    </b-form-group>
                  </b-row>
                  <hr />
                  <b-button variant="primary" type="submit">{{btnTitle}}</b-button>
                </div>
              </template>
            </iq-card>
          </b-col>
        </b-row>
      </form>
    </ValidationObserver>
  </b-container>
</template>
<script>
import { vito } from '../../config/pluginInit'
import { db } from '../../config/firebase'
export default {
  name: 'ClientEdit',
  title: '',
  btnTitle: '',
  status: '',
  mounted () {
    vito.index()
  },
  created () {
    if (this.getStatus() === 'add') {
      this.title = 'Agregar nuevo cliente'
      this.btnTitle = 'Crear cliente'
    }
    if (this.getStatus() === 'edit') {
      this.title = 'Editar Cliente'
      this.btnTitle = 'Guardar cambios'
    }
  },
  data () {
    return {
      user: {
        name: '',
        cedula: '',
        phone: '',
        email: ''
      },
      roles: [
        { text: 'Web Designer', value: 'Web Designer' },
        { text: 'Web Developer', value: 'Web Developer' },
        { text: 'Tester', value: 'Tester' },
        { text: 'Php Developer', value: 'Php Developer' },
        { text: 'Ios Developer', value: 'Ios Developer' }
      ],
      countries: [
        { value: 'Canada', text: 'Canada' },
        { value: 'Niada', text: 'Niada' },
        { value: 'USA', text: 'USA' },
        { value: 'India', text: 'India' },
        { value: 'Africa', text: 'Africa' }
      ],
      users: []
    }
  },
  computed: {
    fullName: function () {
      return this.user.name
    }
  },
  methods: {
    getStatus () {
      const id = this.$route.params.id
      if (id) return 'edit'
      if (!id) return 'add'
    },
    onSubmit () {
      this.user.name = this.fullName
      db.collection('users').add(this.user)
      vito.showSnackbar('success', 'User has been updated successfully.')
      this.$router.replace('/user/user-list')
    },
    previewImage: function (event) {
      const input = event.target

      if (input.files && input.files[0]) {
        const reader = new FileReader()

        reader.onload = (e) => {
          this.user.profile_image = e.target.result
        }

        reader.readAsDataURL(input.files[0])
      }
    }
  }
}
</script>
