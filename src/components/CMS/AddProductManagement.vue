<script setup>
import { onMounted, ref } from 'vue'

/* ========================================
   PRODUCT STATE
======================================== */

const productNumber = ref('')
const productName = ref('')
const productDescription = ref('')
const productImages = ref([])
const productImageNames = ref([])
const amazonLink = ref('')

/* ========================================
   BRAND STATE
======================================== */

const brands = ref([])
const selectedBrandIds = ref([])
const isLoadingBrands = ref(false)

/* ========================================
   SEASON STATE
======================================== */

const seasons = ref([])
const selectedSeasonIds = ref([])
const isLoadingSeasons = ref(false)

/* ========================================
   FORM STATE
======================================== */

const formMessage = ref('')
const isSubmitting = ref(false)

/* ========================================
   IMAGE CHANGE
======================================== */

const handleImageChange = (event) => {
  productImages.value = Array.from(
    event.target.files || []
  )

  productImageNames.value =
    productImages.value.map(
      (file) => file.name
    )
}

/* ========================================
   LOAD BRANDS
======================================== */

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

/* ========================================
   LOAD SEASONS
======================================== */

const loadSeasons = async () => {
  isLoadingSeasons.value = true

  try {
    const response = await fetch(
      '/.netlify/functions/seasons'
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
        `Unable to load seasons. HTTP ${response.status}`
      )
    }

    seasons.value = data
  } catch (error) {
    console.error(
      'Unable to load seasons:',
      error
    )
  } finally {
    isLoadingSeasons.value = false
  }
}

/* ========================================
   ADD PRODUCT
======================================== */

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
      'amazonLink',
      amazonLink.value
    )

    /* ========================================
       BRANDS
    ======================================== */

    for (
      const brandId of
      selectedBrandIds.value
    ) {
      formData.append(
        'brandIds',
        brandId
      )
    }

    /* ========================================
       SEASONS
    ======================================== */

    for (
      const seasonId of
      selectedSeasonIds.value
    ) {
      formData.append(
        'seasonIds',
        seasonId
      )
    }

    /* ========================================
       IMAGES
    ======================================== */

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

    /* ========================================
       RESET FORM
    ======================================== */

    productNumber.value = ''
    productName.value = ''
    productDescription.value = ''
    productImages.value = []
    productImageNames.value = []
    amazonLink.value = ''

    selectedBrandIds.value = []
    selectedSeasonIds.value = []

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

/* ========================================
   INITIAL LOAD
======================================== */

onMounted(() => {
  loadBrands()
  loadSeasons()
})
</script>

<template>
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

    <!-- ========================================
         SEASONS
    ========================================= -->

    <div class="form-group">
      <label for="product-seasons">
        Seasons
      </label>

      <p
        v-if="isLoadingSeasons"
        class="season-status"
      >
        Loading seasons...
      </p>

      <select
        v-else
        id="product-seasons"
        v-model="selectedSeasonIds"
        multiple
        class="season-multi-select"
      >
        <option
          v-for="season in seasons"
          :key="season.id"
          :value="season.id"
        >
          {{ season.name }}
        </option>
      </select>

      <p class="season-help-text">
        Hold Ctrl on Windows or Cmd on Mac to select multiple seasons.
      </p>
    </div>

    <!-- ========================================
         BRANDS
    ========================================= -->

    <div class="form-group">
      <label for="product-brands">
        Brands
      </label>

      <p
        v-if="isLoadingBrands"
        class="brand-status"
      >
        Loading brands...
      </p>

      <select
        v-else
        id="product-brands"
        v-model="selectedBrandIds"
        multiple
        class="brand-multi-select"
      >
        <option
          v-for="brand in brands"
          :key="brand.id"
          :value="brand.id"
        >
          {{ brand.name }}
        </option>
      </select>

      <p class="brand-help-text">
        Hold Ctrl on Windows or Cmd on Mac to select multiple brands.
      </p>
    </div>

    <!-- ========================================
         IMAGES
    ========================================= -->

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
          v-for="(
            imageName,
            index
          ) in productImageNames"
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
</template>

<style scoped>
.add-product-form {
  padding: clamp(1rem, 3vw, 2rem);

  background: white;

  border-radius: 10px;

  font-family: 'Fredoka', sans-serif;
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
}

.brand-multi-select,
.season-multi-select {
  min-height: 10rem;

  cursor: pointer;
}

.brand-status,
.season-status {
  margin: 0;

  color: #703795;
}

.brand-help-text,
.season-help-text {
  margin: 0;

  color: #666;

  font-size: 0.85rem;
}

.selected-images {
  margin-top: 0.5rem;
}

.selected-images p {
  margin: 0.2rem 0;

  color: #703795;

  font-size: 0.9rem;
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
</style>