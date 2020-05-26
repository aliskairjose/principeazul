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
                      <b-form-select
                        v-model="selectedCategory"
                        :options="categories">
                      </b-form-select>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Tipo" label-for="type">
                      <b-form-select
                        v-model="selectedType"
                        :options="types"
                        @change="onChange()">
                      </b-form-select>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Sub Producto" label-for="type" v-show="isShow">
                        <b-button block variant="primary" @click="addSubproduct">Agregar subproductos</b-button>
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

export default {
  name: 'InventoryEdit',
  mounted () {
    vito.index()
  },
  created () {
    if (this.getStatus() === 'add') {
      this.title = 'Agregar nuevo producto'
      this.btnTitle = 'Nuevo producto'
    }
    if (this.getStatus() === 'edit') {
      this.title = 'Editar producto'
      this.btnTitle = 'Guardar cambios'
    }
  },
  data () {
    return {
      isShow: false,
      selectedType: null,
      selectedCategory: null,
      types: [
        { value: null, text: 'Seleccione un tipo' },
        { value: '1', text: 'Principal' },
        { value: '2', text: 'Secundario' }
      ],
      categories: [
        { value: null, text: 'Seleccione una categoria' },
        { value: '1', text: 'Categoria 1' },
        { value: '2', text: 'Categoria 2' }
      ],
      product: {
        name: '',
        descripcion: '',
        price: '',
        category: '',
        'type': ''
      }
    }
  },
  methods: {
    getStatus () {
      const id = this.$route.params.id
      if (id) return 'edit'
      if (!id) return 'add'
    },
    addSubproduct () {
      alert('agregar subproducto')
    },
    onChange () {
      if (this.selectedType === '1') {
        this.isShow = true
      } else {
        this.isShow = false
      }
    }
  }

}
</script>
