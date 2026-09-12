<script setup>
import { onMounted, ref } from 'vue'

const brandName = ref('')

const brandImage = ref(null)
const brandImageName = ref('')

const brands = ref([])

const formMessage = ref('')

const isSubmitting = ref(false)
const isLoading = ref(false)


const getBrandImageUrl = (imageKey) => {
  if (!imageKey) {
    return ''
  }

  return `/.netlify/functions/brand-image?key=${encodeURIComponent(imageKey)}`
}


const handleBrandImageChange = (event) => {
  const file = event.target.files?.[0] || null

  brandImage.value = file
  brandImageName.value = file?.name || ''
}


const loadBrands = async () => {
  isLoading.value = true

  try {
    const response = await fetch(
      '/.netlify/functions/brands'
    )

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
    isLoading.value = false
  }
}


const addBrand = async () => {
  formMessage.value = ''

  const trimmedBrandName =
    brandName.value.trim()

  if (!trimmedBrandName) {
    formMessage.value =
      'Brand name is required.'

    return
  }

  isSubmitting.value = true

  try {
    const formData = new FormData()

    formData.append(
      'name',
      trimmedBrandName
    )

    if (brandImage.value) {
      formData.append(
        'image',
        brandImage.value
      )
    }

    const response = await fetch(
      '/.netlify/functions/brands',
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
        `Unable to add brand. HTTP ${response.status}`
      )
    }

    formMessage.value =
      `Added "${data.name}" successfully.`

    brandName.value = ''
    brandImage.value = null
    brandImageName.value = ''

    const imageInput =
      document.getElementById(
        'brand-image'
      )

    if (imageInput) {
      imageInput.value = ''
    }

    await loadBrands()
  } catch (error) {
    console.error(
      'Unable to add brand:',
      error
    )

    formMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}


onMounted(() => {
  loadBrands()
})
</script>

<template>
  <section class="brand-management">

    <h2 class="section-title">
      Brand Management
    </h2>

    <form
      class="add-brand-form"
      @submit.prevent="addBrand"
    >

      <div class="form-group">
        <label for="brand-name">
          Brand Name
        </label>

        <input
          id="brand-name"
          v-model="brandName"
          type="text"
          placeholder="Brand name"
          required
        >
      </div>


      <div class="form-group">
        <label for="brand-image">
          Brand Logo
        </label>

        <input
          id="brand-image"
          type="file"
          accept="image/*"
          @change="handleBrandImageChange"
        >

        <p
          v-if="brandImageName"
          class="selected-file"
        >
          {{ brandImageName }}
        </p>
      </div>


      <button
        type="submit"
        :disabled="isSubmitting"
      >
        {{
          isSubmitting
            ? 'Adding...'
            : 'Add Brand'
        }}
      </button>

      <p
        v-if="formMessage"
        class="form-message"
      >
        {{ formMessage }}
      </p>

    </form>


    <div class="existing-brands">

      <h3 class="existing-brands-title">
        Existing Brands
      </h3>

      <p
        v-if="isLoading"
        class="brand-status-message"
      >
        Loading brands...
      </p>

      <p
        v-else-if="brands.length === 0"
        class="brand-status-message"
      >
        No brands have been added yet.
      </p>

      <div
        v-else
        class="brand-list"
      >

        <div
          v-for="brand in brands"
          :key="brand.id"
          class="brand-list-item"
        >

          <div class="brand-logo-wrapper">

            <img
              v-if="brand.image_key"
              :src="
                getBrandImageUrl(
                  brand.image_key
                )
              "
              :alt="`${brand.name} logo`"
              class="brand-logo"
            >

            <div
              v-else
              class="brand-logo-placeholder"
            >
              No logo
            </div>

          </div>

          <span class="brand-name">
            {{ brand.name }}
          </span>

        </div>

      </div>

    </div>

  </section>
</template>

<style scoped>
.brand-management {
  width: min(90%, 50rem);

  margin: 0 auto;
  padding: 2rem 0;

  font-family: 'Fredoka', sans-serif;
}


/* ========================================
   TITLE
======================================== */

.section-title {
  margin: 0 0 1.5rem;

  color: #703795;

  font-size: clamp(2rem, 3vw, 3rem);
  font-weight: 600;
}


/* ========================================
   FORM
======================================== */

.add-brand-form {
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

.form-group input {
  width: 100%;

  padding: 0.75rem;

  font: inherit;

  border: 1px solid #ccc;
  border-radius: 6px;

  box-sizing: border-box;
}

.form-group input[type="file"] {
  background: white;

  color: black;

  cursor: pointer;
}

.selected-file {
  margin: 0.25rem 0 0;

  color: #703795;

  font-size: 0.9rem;
}

.add-brand-form button {
  padding: 0.75rem 1.25rem;

  background: #703795;

  color: white;

  border: none;
  border-radius: 6px;

  font: inherit;
  font-weight: 500;

  cursor: pointer;
}

.add-brand-form button:hover {
  opacity: 0.9;
}

.add-brand-form button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

.form-message {
  margin-top: 1rem;

  color: #703795;
}


/* ========================================
   EXISTING BRANDS
======================================== */

.existing-brands {
  margin-top: 2rem;
}

.existing-brands-title {
  margin: 0 0 1rem;

  color: #703795;

  font-size: 1.5rem;
  font-weight: 600;
}

.brand-status-message {
  color: #703795;
}

.brand-list {
  display: grid;

  grid-template-columns: 1fr;

  gap: 0.75rem;
}

.brand-list-item {
  display: flex;
  align-items: center;

  gap: 1rem;

  padding: 1rem;

  background: #f7f4fa;

  border-radius: 6px;
}

.brand-logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 70px;
  height: 70px;

  flex-shrink: 0;

  background: white;

  border-radius: 6px;

  overflow: hidden;
}

.brand-logo {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: contain;
}

.brand-logo-placeholder {
  color: #777;

  font-size: 0.75rem;
}

.brand-name {
  color: #703795;

  font-weight: 500;
}


/* ========================================
   TABLET / DESKTOP
======================================== */

@media (min-width: 600px) {
  .brand-list {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}
</style>