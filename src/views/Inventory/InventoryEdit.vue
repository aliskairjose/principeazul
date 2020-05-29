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
                        <b-button block v-b-modal.modal-lg variant="primary" @click="addSubproduct" v-b-modal.modal-1>Agregar subproductos</b-button>
                    </b-form-group>
                    <b-form-group class="col-md-12" >
                      <vue-dropzone :options="dropzoneOptions" :useCustomSlot=true>
                        <div class="dropzone-custom-content">
                          <h3 class="dropzone-custom-title">Arrastra y suelta para subir contenido!</h3>
                          <div class="subtitle">...o haga clic para seleccionar un archivo de su computadora</div>
                        </div>
                        </vue-dropzone>
                    </b-form-group>
                  </b-row>
                  <hr />
                  <b-modal size="lg" id="modal-1" title="Lista de subproductos">
                    <sub-product-table
                      :items="subProducts"
                      :titems="titles"
                      v-on:add-item="addSub"
                      >
                    </sub-product-table>
                  </b-modal>
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
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import SubProductTable from '@/views/Inventory/SubProductTable'
export default {
  name: 'InventoryEdit',
  subs: [],
  components: {
    vueDropzone: vue2Dropzone,
    SubProductTable
  },
  mounted () {
    vito.index()
  },
  created () {
    if (this.getStatus() === 'add') {
      this.title = 'Agregar nuevo producto'
      this.btnTitle = 'Nuevo producto'
    }
    if (this.getStatus() === 'edit') {
      this.loading = true
      this.title = 'Editar producto'
      this.btnTitle = 'Guardar cambios'
      client.getById(this.$route.params.id)
        .then(response => {
          const data = response.data.data
          this.client = data
        })
        .catch((error) => { console.log(error) })
        .finally(() => { this.loading = false })
    }
  },
  data () {
    return {
      isShow: false,
      selectedType: null,
      selectedCategory: null,
      subs: [],
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
      },
      titles: [
        { label: 'Id', key: 'id', class: 'text-left', sortable: true },
        { label: 'Foto', key: 'photo', class: 'text-left', sortable: true },
        { label: 'Nombre', key: 'name', class: 'text-left', sortable: true },
        { label: 'Acción', key: 'action', class: 'text-center' }
      ],
      subProducts: [
        {
          id: 1,
          photo: 'Trendy Royal',
          name: 'Trendy Royal Queen'
        },
        {
          id: 2,
          photo: 'Trendy Royal',
          name: 'Trendy Royal Prince'
        },
        {
          id: 3,
          photo: 'Trendy Royal',
          name: 'Trendy Royal King'
        },
        {
          id: 4,
          photo: 'Trendy Royal',
          name: 'Trendy Royal Junior'
        }
      ],
      dropzoneOptions: {
        url: 'https://httpbin.org/post',
        thumbnailWidth: 150,
        maxFilesize: 0.5,
        headers: { 'My-Awesome-Header': 'My-Awesome-Header' }
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
      // alert('agregar subproducto')
    },
    onChange () {
      if (this.selectedType === '1') {
        this.isShow = true
      } else {
        this.isShow = false
      }
    },
    addSub (item) {
      // Captura el item del componente hijo SubProductTable
      this.subs.push(item)
    },
    onSubmit () {
      this.loading = true
      client.product(this.product)
        .then(response => { console.log(response) })
        .catch((error) => { console.log(error) })
        .finally(() => {
          this.loading = false
          this.$router.push({ name: 'inventory.list' })
        })
    }
  }

}
</script>
