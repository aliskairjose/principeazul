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
                    <div class="text-center" id="spinner" v-show="loading">
                      <b-spinner variant="primary" type="grow" label="Spinning" style="width: 3rem; height: 3rem;"></b-spinner>
                    </div>
                  </b-row>
                  <b-row>
                    <b-form-group class="col-md-6" label="Nombre:" label-for="name">
                      <ValidationProvider name="Nombre" rules="required" v-slot="{ errors }">
                        <b-form-input
                          v-model="client.name"
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
                          v-model="client.dni"
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
                        v-model="client.phone"
                        type="text"
                        name="phone"
                        id="phone"
                        placeholder="Teléfono"
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Email" label-for="email">
                      <b-form-input
                        v-model="client.email"
                        type="text"
                        name="email"
                        id="email"
                        placeholder="Email"
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-12" label="Dirección" label-for="address">
                      <b-form-textarea
                        rows="3"
                        max-rows="6"
                        v-model="client.address"
                        type="text"
                        name="address"
                        id="address"
                        placeholder="Dirección"
                      ></b-form-textarea>
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
import client from '@/services/client'
// import { db } from '../../config/firebase'
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
      this.btnTitle = 'Nuevo cliente'
    }
    if (this.getStatus() === 'edit') {
      this.title = 'Editar cliente'
      this.btnTitle = 'Guardar cambios'
      client.getById(this.$route.params.id)
        .then(response => {
          const data = response.data.data
          this.client = data
        })
        .catch((error) => { console.log(error) })
        .finally(() => { console.log('finally') })
    }
  },
  data () {
    return {
      client: {
        name: '',
        last_name: 'Default',
        dni: '',
        phone: '',
        email: '',
        address: ''
      },
      loading: false,
      clients: []
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
      this.loading = true
      client.create(this.client)
        .then(response => { console.log(response) })
        .catch((error) => { console.log(error) })
        .finally(() => {
          this.loading = false
          this.$router.push({ name: 'client.list' })
        })
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

<style scoped>
  #spinner {
    z-index: 1000;
    position: absolute;
    left: 40vw;
  }
</style>
