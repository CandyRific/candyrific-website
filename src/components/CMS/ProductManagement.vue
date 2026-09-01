<script setup>
import { ref } from 'vue'

const productName = ref('')
const productDescription = ref('')
const productImages = ref([])
const productImageNames = ref([])

const productSeason = ref('')
const productBrand = ref('')

const formMessage = ref('')
const isSubmitting = ref(false)

const handleImageChange = (event) => {
  productImages.value = Array.from(event.target.files || [])
  productImageNames.value = productImages.value.map((file) => file.name)
  console.log(productImages.value)
}

const addProduct = async () => {
  formMessage.value = ''

  if (!productName.value.trim()) {
    formMessage.value = 'Product name is required.'
    return
  }

  isSubmitting.value = true

  try {
    const formData = new FormData()

    formData.append('name', productName.value)
    formData.append('description', productDescription.value)
    formData.append('season', productSeason.value)
    formData.append('brand', productBrand.value)

    if (productImages.value) {
      for (const file of productImages.value) {
        formData.append('image', file)
      }
    }

    const response = await fetch('/.netlify/functions/products', {
      method: 'POST',
      body: formData
    })

    const responseText = await response.text()

    let data = null

    try {
      data = JSON.parse(responseText)
    } catch {
      // Response was not JSON.
    }

    if (!response.ok) {
      throw new Error(
        data?.error ||
        responseText ||
        `Unable to add product. HTTP ${response.status}`
      )
    }

    formMessage.value = `Added "${data.name}" successfully.`

    productName.value = ''
    productDescription.value = ''
    productImages.value = []
    productImageNames.value = []
    productSeason.value = ''
    productBrand.value = ''

    const imageInput = document.getElementById('product-image')

    if (imageInput) {
      imageInput.value = ''
    }
  } catch (error) {
    console.error('Unable to add product:', error)

    formMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="product-management">

    <h2 class="section-title">
      Product Management
    </h2>

    <form
      class="add-product-form"
      @submit.prevent="addProduct"
    >

      <div class="form-group">
        <label for="product-name">
          Product Name
        </label>

        <input
          id="product-name"
          v-model="productName"
          type="text"
          placeholder="Product name"
          required
        >
      </div>

      <div class="form-group">
        <label for="product-description">
          Description
        </label>

        <textarea
          id="product-description"
          v-model="productDescription"
          placeholder="Product description"
          rows="4"
        ></textarea>
      </div>

      <div class="form-select-row">

        <div class="form-group">
          <label for="product-season">
            Season
          </label>

          <select
            id="product-season"
            v-model="productSeason"
          >
            <option value="">
              Select season
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="product-brand">
            Brand
          </label>

          <select
            id="product-brand"
            v-model="productBrand"
          >
            <option value="">
              Select brand
            </option>
          </select>
        </div>

      </div>

      <div class="form-group">
        <label for="product-image">
          Product Images
        </label>

        <input
          id="product-image"
          type="file"
          accept="image/*"
          @change="handleImageChange"
          multiple
        >

        <div>
            <p
                v-for="(imageName, index) in productImageNames"
                :key="index"
            >
                {{ imageName }}
            </p>
        </div>
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Adding...' : 'Add Product' }}
      </button>

      <p
        v-if="formMessage"
        class="form-message"
      >
        {{ formMessage }}
      </p>

    </form>

  </section>
</template>

<style scoped>
.product-management {
  width: min(90%, 50rem);

  margin: 0 auto;
  padding: 2rem 0;

  font-family: 'Fredoka', sans-serif;
}

.section-title {
  margin: 0 0 1.5rem;

  color: #703795;

  font-size: clamp(2rem, 3vw, 3rem);
  font-weight: 600;
}

.add-product-form {
  padding: clamp(1rem, 3vw, 2rem);

  background: white;

  border-radius: 10px;
}

.form-group {
  margin-bottom: 1rem;

  display: flex;
  flex-direction: column;

  gap: 0.4rem;
}

.form-select-row {
  display: grid;
  grid-template-columns: 1fr;

  gap: 1rem;
}

.form-group label {
  color: #703795;

  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;

  padding: 0.75rem;

  font: inherit;

  border: 1px solid #ccc;
  border-radius: 6px;

  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
}

.form-group input[type="file"] {
  background: white;

  color: black;

  cursor: pointer;
}

.form-group select {
  background: white;

  color: black;

  cursor: pointer;
}

.add-product-form button {
  padding: 0.75rem 1.25rem;

  background: #703795;

  color: white;

  border: none;
  border-radius: 6px;

  font: inherit;
  font-weight: 500;

  cursor: pointer;
}

.add-product-form button:hover {
  opacity: 0.9;
}

.add-product-form button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

.form-message {
  margin-top: 1rem;

  color: #703795;
}

@media (min-width: 768px) {
  .form-select-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>