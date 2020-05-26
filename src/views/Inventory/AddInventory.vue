<template>
  <b-container fluid>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col lg="12">
            <iq-card>
              <template v-slot:headerTitle>
                <h4 class="card-title">Agregar Nuevo Producto</h4>
              </template>
              <template v-slot:body>
                <div class="new-user-info">
                  <b-row>
                    <b-form-group class="col-md-6" label="Nombre:" label-for="name">
                      <ValidationProvider name="Nombre" rules="required" v-slot="{ errors }">
                        <b-form-input
                          v-model="product.name"
                          type="text"
                          placeholder="Nombre"
                          :class="(errors.length > 0 ? ' is-invalid' : '')"
                        ></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Descripción:" label-for="description">
                      <ValidationProvider name="Description" rules="required" v-slot="{ errors }">
                        <b-form-input
                          v-model="product.description"
                          type="text"
                          placeholder="Descripción"
                          :class="(errors.length > 0 ? ' is-invalid' : '')"
                        ></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Precio:" label-for="price">
                      <b-form-input
                        v-model="product.price"
                        type="text"
                        name="price"
                        id="price"
                        placeholder="Precio"
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Categoría" label-for="category">
                      <b-form-input
                        v-model="product.category"
                        type="text"
                        name="category"
                        id="category"
                        placeholder="Categoria"
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Categoría" label-for="type">
                      <b-form-input
                        v-model="product.type"
                        type="text"
                        name="type"
                        id="type"
                        placeholder="Tipo"
                      ></b-form-input>
                    </b-form-group>
                  </b-row>
                  <hr />
                  <b-button variant="primary" type="submit">Guardar</b-button>
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

export default {
  name: 'AddInventory',
  mounted () {
    vito.index()
  },
  data () {
    return {
      product: {
        name: '',
        descripcion: '',
        price: '',
        category: '',
        'type': ''
      }
    }
  }
}
</script>
