<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const product = ref(null)
const selectedImage = ref(null)

const isLoading = ref(true)
const errorMessage = ref('')

const itemNumber = computed(() => route.params.itemNumber)

const getProductImageUrl = (imageKey) => {
  if (!imageKey) {
    return ''
  }

  return `/.netlify/functions/product-image?key=${encodeURIComponent(imageKey)}`
}

const loadProduct = async () => {
  isLoading.value = true
  errorMessage.value = ''
  product.value = null
  selectedImage.value = null

  try {
    const response = await fetch(
      `/.netlify/functions/product?itemNumber=${encodeURIComponent(itemNumber.value)}`
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Unable to load product.')
    }

    product.value = data

    if (data.images?.length) {
      selectedImage.value = data.images[0].image_key
    }
  } catch (error) {
    console.error('Error loading product:', error)

    errorMessage.value =
      error.message || 'Unable to load this product.'
  } finally {
    isLoading.value = false
  }
}

const selectImage = (imageKey) => {
  selectedImage.value = imageKey
}

watch(itemNumber, () => {
  loadProduct()
})

onMounted(() => {
  loadProduct()
})
</script>

<template>
  <div class="individual-product-page">

    <div class="product-page-content">

      <div class="product-breadcrumb">
        <RouterLink
          to="/products"
          class="breadcrumb-link"
        >
          Products
        </RouterLink>

        <span
          class="breadcrumb-arrow"
          aria-hidden="true"
        >
          &gt;
        </span>

        <span v-if="product">
          {{ product.name }}
        </span>
      </div>

      <div
        v-if="isLoading"
        class="product-state-message"
      >
        Loading product...
      </div>

      <div
        v-else-if="errorMessage"
        class="product-state-message product-error-message"
      >
        {{ errorMessage }}
      </div>

      <article
        v-else-if="product"
        class="individual-product-card"
      >

        <section class="product-images-section">

          <div class="main-product-image-container">
            <img
              v-if="selectedImage"
              class="main-product-image"
              :src="getProductImageUrl(selectedImage)"
              :alt="product.name"
            >

            <div
              v-else
              class="no-product-image"
            >
              Image coming soon
            </div>
          </div>

          <div
            v-if="product.images?.length > 1"
            class="individual-product-thumbnails"
          >
            <button
              v-for="image in product.images"
              :key="image.id"
              type="button"
              class="individual-product-thumbnail"
              :class="{
                'selected-thumbnail':
                  selectedImage === image.image_key
              }"
              :aria-label="`View another image of ${product.name}`"
              @click="selectImage(image.image_key)"
            >
              <img
                :src="getProductImageUrl(image.image_key)"
                :alt="`${product.name} thumbnail`"
              >
            </button>
          </div>

        </section>

        <section class="product-information-section">

          <h1 class="individual-product-name">
            {{ product.name }}
          </h1>

          <p
            v-if="product.description"
            class="individual-product-description"
          >
            {{ product.description }}
          </p>

          <div class="individual-product-number">
            Item # {{ product.item_number }}
          </div>

          <a
            v-if="product.amazon_link"
            class="individual-product-amazon-link"
            :href="product.amazon_link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy on Amazon
          </a>

        </section>

      </article>

    </div>

  </div>
</template>

<style scoped>
.individual-product-page {
  width: 100%;
  min-height: 70vh;
  background: #e6f7fc;
}

.product-page-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.25rem 1rem 3rem;
}


/* ------------------------
   Breadcrumb
------------------------- */

.product-breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;

  margin-bottom: 1.5rem;

  color: #078fc9;
  font-size: 0.95rem;
  font-weight: 600;
}

.breadcrumb-link {
  color: #078fc9;
  text-decoration: none;
  text-transform: uppercase;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-arrow {
  font-size: 1.1rem;
  font-weight: 700;
}


/* ------------------------
   Loading / errors
------------------------- */

.product-state-message {
  padding: 3rem 1rem;
  text-align: center;

  color: #078fc9;
  font-size: 1.1rem;
  font-weight: 600;
}

.product-error-message {
  color: #703795;
}


/* ------------------------
   Product container
------------------------- */

.individual-product-card {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  width: 100%;
  padding: 1rem;

  background: #ffffff;
  border-radius: 1rem;
}


/* ------------------------
   Images
------------------------- */

.product-images-section {
  width: 100%;
}

.main-product-image-container {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  aspect-ratio: 1 / 1;

  padding: 1.5rem;

  background: #e6f7fc;
  border-radius: 1rem;

  overflow: hidden;
}

.main-product-image {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: contain;
}

.no-product-image {
  color: #078fc9;
  font-weight: 600;
}

.individual-product-thumbnails {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  margin-top: 1rem;
}

.individual-product-thumbnail {
  width: 72px;
  height: 72px;

  padding: 0.35rem;

  border: 2px solid transparent;
  border-radius: 0.5rem;

  background: #e6f7fc;

  cursor: pointer;
  overflow: hidden;

  transition:
    border-color 0.15s ease,
    transform 0.15s ease;
}

.individual-product-thumbnail:hover {
  transform: translateY(-2px);
}

.individual-product-thumbnail.selected-thumbnail {
  border-color: #01aef0;
}

.individual-product-thumbnail img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: contain;
}


/* ------------------------
   Product text
------------------------- */

.product-information-section {
  display: flex;
  flex-direction: column;

  width: 100%;
}

.individual-product-name {
  margin: 0 0 1rem;

  color: #078fc9;

  font-size: clamp(1.8rem, 7vw, 2.6rem);
  line-height: 1.1;
  font-weight: 700;
}

.individual-product-description {
  margin: 0;

  color: #078fc9;

  font-size: clamp(1rem, 4.5vw, 1.3rem);
  line-height: 1.5;
  white-space: pre-line;
}

.individual-product-number {
  margin-top: 2rem;

  color: #078fc9;

  font-size: 1.1rem;
  font-weight: 700;
}

.individual-product-amazon-link {
  align-self: flex-start;

  margin-top: 1.5rem;
  padding: 0.8rem 1.4rem;

  color: #ffffff;
  background: #078fc9;

  border-radius: 0.55rem;

  text-decoration: none;
  font-weight: 600;

  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}

.individual-product-amazon-link:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}


/* ------------------------
   Tablet
------------------------- */

@media (min-width: 600px) {
  .product-page-content {
    padding: 1.5rem 2rem 4rem;
  }

  .individual-product-card {
    padding: 2rem;
  }

  .individual-product-thumbnail {
    width: 86px;
    height: 86px;
  }
}


/* ------------------------
   Desktop
------------------------- */

@media (min-width: 900px) {
  .product-page-content {
    padding-top: 1.25rem;
    padding-bottom: 6rem;
  }

  .product-breadcrumb {
    margin-bottom: 3rem;
    font-size: 1rem;
  }

  .individual-product-card {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(300px, 0.9fr);
    gap: 3rem;

    padding: 4rem;
  }

  .product-information-section {
    justify-content: flex-start;
    padding-top: 0.25rem;
  }

  .individual-product-name {
    margin-bottom: 1.5rem;
    font-size: clamp(2rem, 3vw, 3rem);
  }

  .individual-product-description {
    font-size: clamp(1.1rem, 1.8vw, 1.45rem);
    line-height: 1.5;
  }

  .individual-product-number {
    margin-top: 3rem;
    font-size: 1.25rem;
  }
}


/* ------------------------
   Large Desktop
------------------------- */

@media (min-width: 1200px) {
  .individual-product-card {
    gap: 4rem;
  }
}
</style>