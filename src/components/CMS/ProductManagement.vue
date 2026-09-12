<script setup>
import { onMounted, ref } from 'vue'

const productNumber = ref('')
const productName = ref('')
const productDescription = ref('')
const productImages = ref([])
const productImageNames = ref([])
const amazonLink = ref('')

const productSeason = ref('')

const brands = ref([])
const selectedBrandIds = ref([])
const isLoadingBrands = ref(false)

const formMessage = ref('')
const isSubmitting = ref(false)

const handleImageChange = (event) => {
  productImages.value = Array.from(
    event.target.files || []
  )

  productImageNames.value =
    productImages.value.map(
      (file) => file.name
    )
}

const loadBrands = async () => {
  isLoadingBrands.value = true

  try {
    const response = await fetch(
      '/.netlify/functions/brands'
    )

    const responseText =
      await response.text()

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
        `Unable to load brands. HTTP ${response.status}`
      )
    }

    brands.value = data
  } catch (error) {
    console.error(
      'Unable to load brands:',
      error
    )
  } finally {
    isLoadingBrands.value = false
  }
}

const addProduct = async () => {
  formMessage.value = ''

  if (!productName.value.trim()) {
    formMessage.value =
      'Product name is required.'

    return
  }

  isSubmitting.value = true

  try {
    const formData = new FormData()

    formData.append(
      'productNumber',
      productNumber.value
    )

    formData.append(
      'name',
      productName.value
    )

    formData.append(
      'description',
      productDescription.value
    )

    formData.append(
      'season',
      productSeason.value
    )

    formData.append(
      'amazonLink',
      amazonLink.value
    )

    for (
      const brandId of
      selectedBrandIds.value
    ) {
      formData.append(
        'brandIds',
        brandId
      )
    }

    for (
      const file of
      productImages.value
    ) {
      formData.append(
        'image',
        file
      )
    }

    const response = await fetch(
      '/.netlify/functions/products',
      {
        method: 'POST',
        body: formData
      }
    )

    const responseText =
      await response.text()

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

    formMessage.value =
      `Added "${data.name}" successfully.`

    productNumber.value = ''
    productName.value = ''
    productDescription.value = ''
    productImages.value = []
    productImageNames.value = []
    productSeason.value = ''
    amazonLink.value = ''
    selectedBrandIds.value = []

    const imageInput =
      document.getElementById(
        'product-image'
      )

    if (imageInput) {
      imageInput.value = ''
    }
  } catch (error) {
    console.error(
      'Unable to add product:',
      error
    )

    formMessage.value =
      error.message
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadBrands()
})
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
        <label for="product-number">
          Product Number
        </label>

        <input
          id="product-number"
          v-model="productNumber"
          type="text"
          placeholder="Product number"
        >
      </div>

      <div class="form-group">
        <label for="amazon-link">
          Amazon Link
        </label>

        <input
          id="amazon-link"
          v-model="amazonLink"
          type="url"
          placeholder="https://www.amazon.com/..."
        >
      </div>

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

      <fieldset class="brand-selection">

        <legend>
          Brands
        </legend>

        <p
          v-if="isLoadingBrands"
          class="brand-status"
        >
          Loading brands...
        </p>

        <p
          v-else-if="brands.length === 0"
          class="brand-status"
        >
          No brands are currently available.
        </p>

        <div
          v-else
          class="brand-checklist"
        >

          <label
            v-for="brand in brands"
            :key="brand.id"
            class="brand-checkbox"
          >
            <input
              v-model="selectedBrandIds"
              type="checkbox"
              :value="brand.id"
            >

            <span>
              {{ brand.name }}
            </span>
          </label>

        </div>

      </fieldset>

      <div class="form-group">
        <label for="product-image">
          Product Images
        </label>

        <input
          id="product-image"
          type="file"
          accept="image/*"
          multiple
          @change="handleImageChange"
        >

        <div class="selected-images">
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
        {{
          isSubmitting
            ? 'Adding...'
            : 'Add Product'
        }}
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


/* ========================================
   BRAND CHECKLIST
======================================== */

.brand-selection {
  margin: 0 0 1.5rem;

  padding: 0;

  border: none;
}

.brand-selection legend {
  margin-bottom: 0.75rem;

  color: #703795;

  font-weight: 500;
}

.brand-checklist {
  display: grid;

  grid-template-columns: 1fr;

  gap: 0.5rem;

  max-height: 18rem;

  padding: 1rem;

  overflow-y: auto;

  background: #f7f4fa;

  border: 1px solid #ddd;
  border-radius: 6px;
}

.brand-checkbox {
  display: flex;
  align-items: center;

  gap: 0.6rem;

  padding: 0.65rem;

  background: white;

  color: #703795;

  border-radius: 5px;

  cursor: pointer;

  transition: background 0.15s ease;
}

.brand-checkbox:hover {
  background: #eee7f4;
}

.brand-checkbox input {
  width: auto;

  margin: 0;

  cursor: pointer;
}

.brand-status {
  margin: 0;

  color: #703795;
}


/* ========================================
   SELECTED IMAGES
======================================== */

.selected-images {
  margin-top: 0.5rem;
}

.selected-images p {
  margin: 0.2rem 0;

  color: #703795;

  font-size: 0.9rem;
}


/* ========================================
   SUBMIT BUTTON
======================================== */

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


/* ========================================
   DESKTOP
======================================== */

@media (min-width: 768px) {
  .brand-checklist {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}
</style>