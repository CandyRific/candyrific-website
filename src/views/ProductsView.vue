<script setup>
import { onMounted, ref } from 'vue'

const products = ref([])
const selectedImages = ref({})

const isLoading = ref(true)
const loadError = ref('')

const getProductImageUrl = (imageKey) => {
  if (!imageKey) {
    return ''
  }

  return `/.netlify/functions/product-image?key=${encodeURIComponent(imageKey)}`
}

const selectProductImage = (productId, imageKey) => {
  selectedImages.value[productId] = imageKey
}

const getSelectedProductImage = (product) => {
  if (selectedImages.value[product.id]) {
    return selectedImages.value[product.id]
  }

  return product.images?.[0]?.image_key || ''
}

const loadProducts = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const response = await fetch('/.netlify/functions/products')

    if (!response.ok) {
      throw new Error(
        `Unable to load products. HTTP ${response.status}`
      )
    }

    products.value = await response.json()

    /*
      Set the first image for each product
      as its initial main image.
    */
    for (const product of products.value) {
      if (product.images?.length) {
        selectedImages.value[product.id] =
          product.images[0].image_key
      }
    }
  } catch (error) {
    console.error('Unable to load products:', error)

    loadError.value =
      error.message || 'Unable to load products.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div class="product-div">

    <div class="title-div">
      Products
    </div>

    <div class="products-update-message">
      We're actively adding more products and features to this page.
      Check back soon for more CandyRific products and updates.
    </div>

    <div
      v-if="isLoading"
      class="products-status"
    >
      Loading products...
    </div>

    <div
      v-else-if="loadError"
      class="products-status products-error"
    >
      {{ loadError }}
    </div>

    <div
      v-else
      class="product-section"
    >

      <div
        v-for="product in products"
        :key="product.id"
        class="product-card-parent"
      >

        <!-- ========================================
             MAIN IMAGE
        ========================================= -->

        <div class="product-card">

          <img
            v-if="getSelectedProductImage(product)"
            :src="getProductImageUrl(
              getSelectedProductImage(product)
            )"
            :alt="product.name"
          >

        </div>


        <!-- ========================================
             SECONDARY IMAGES
        ========================================= -->

        <div
          v-if="product.images?.length > 1"
          class="product-thumbnail-section"
        >

          <button
            v-for="image in product.images"
            :key="image.id"
            type="button"
            class="product-thumbnail"
            :class="{
              'product-thumbnail-selected':
                getSelectedProductImage(product) === image.image_key
            }"
            @click="
              selectProductImage(
                product.id,
                image.image_key
              )
            "
          >

            <img
              :src="getProductImageUrl(image.image_key)"
              :alt="`${product.name} alternate view`"
            >

          </button>

        </div>


        <!-- ========================================
             PRODUCT NAME
        ========================================= -->

        <div class="product-text-div">
          {{ product.name }}
        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>

.product-div {
  background: #e6f4fd;
  color: #1c8bc3;

  font-family: 'Fredoka', sans-serif;
}


/* ========================================
   PAGE TITLE
======================================== */

.title-div {
  padding: clamp(1.5rem, 3vw, 3rem);

  text-align: center;

  font-size: clamp(3.25rem, 5vw, 6rem);
  line-height: 1;
  font-weight: 600;
}


/* ========================================
   UPDATE MESSAGE
======================================== */

.products-update-message {
  width: min(90%, 50rem);

  margin: 0 auto clamp(1.5rem, 3vw, 2.5rem);
  padding: 0 1rem;

  text-align: center;

  color: #703795;

  font-size: clamp(1rem, 1.35vw, 1.3rem);
  line-height: clamp(1.5rem, 2vw, 1.9rem);
  font-weight: 300;
}


/* ========================================
   LOADING / ERROR
======================================== */

.products-status {
  padding: 2rem;

  text-align: center;

  color: #703795;

  font-size: 1.1rem;
}

.products-error {
  color: #b42318;
}


/* ========================================
   PRODUCT GRID
======================================== */

.product-section {
  padding: clamp(1rem, 4vw, 4rem);

  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: clamp(0.5rem, 1.5vw, 1rem);
}


/* ========================================
   PRODUCT CARD
======================================== */

.product-card-parent {
  min-width: 0;

  border-radius: 10px;
}

.product-card {
  height: clamp(10rem, 22vw, 15rem);

  background: white;

  border-radius: 10px;

  overflow: hidden;
}

.product-card img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: contain;
}


/* ========================================
   PRODUCT THUMBNAILS
======================================== */

.product-thumbnail-section {
  display: flex;

  gap: 0.4rem;

  padding-top: 0.5rem;

  overflow-x: auto;
}

.product-thumbnail {
  flex: 0 0 3.5rem;

  width: 3.5rem;
  height: 3.5rem;

  padding: 0.2rem;

  background: white;

  border: 1px solid transparent;
  border-radius: 6px;

  cursor: pointer;
}

.product-thumbnail img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: contain;
}

.product-thumbnail-selected {
  border-color: #703795;
}


/* ========================================
   PRODUCT TEXT
======================================== */

.product-text-div {
  padding: clamp(0.5rem, 1vw, 0.85rem);

  text-align: center;

  color: black;

  font-size: clamp(0.9rem, 1.25vw, 1.2rem);
  line-height: clamp(1.25rem, 1.7vw, 1.65rem);
  font-weight: 400;
}


/* ========================================
   DESKTOP
======================================== */

@media (min-width: 768px) {

  .product-section {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

}

</style>