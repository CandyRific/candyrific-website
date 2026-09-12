<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import sideArt from '../assets/se_long_design.png'

const router = useRouter()

const products = ref([])
const selectedImages = ref({})

const isLoading = ref(false)
const loadError = ref('')

const getProductImageUrl = (imageKey) => {
  if (!imageKey) {
    return ''
  }

  return `/.netlify/functions/product-image?key=${encodeURIComponent(imageKey)}`
}

const loadProducts = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const response = await fetch(
      '/.netlify/functions/products'
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data?.error ||
        'Unable to load products.'
      )
    }

    products.value = data
  } catch (error) {
    console.error(
      'Unable to load products:',
      error
    )

    loadError.value =
      error.message ||
      'Unable to load products.'
  } finally {
    isLoading.value = false
  }
}

const getSelectedImage = (product) => {
  return (
    selectedImages.value[product.id] ||
    product.images?.[0]?.image_key
  )
}

const selectImage = (
  productId,
  imageKey
) => {
  selectedImages.value[productId] =
    imageKey
}

const navigateToIndividualProduct = (
  itemNumber
) => {
  if (!itemNumber) {
    return
  }

  router.push({
    name: 'product',
    params: {
      itemNumber
    }
  })
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <main class="products-page">

    <div class="products-page-inner">

      <h1 class="products-title">
        Products
      </h1>

      <div class="products-layout">

        <!-- ==============================
             FILTER AREA
        =============================== -->

        <aside class="products-sidebar">

          <div class="item-count">
            SHOWING {{ products.length }} ITEMS
          </div>

          <div class="filter-heading">
            <span>
              FILTER BY
            </span>

            <span class="filter-result-count">
              {{ products.length }} RESULTS
            </span>
          </div>

          <button
            type="button"
            class="filter-button"
          >
            <span>
              BRAND
            </span>

            <span class="filter-plus">
              +
            </span>
          </button>

        </aside>


        <!-- ==============================
             PRODUCT AREA
        =============================== -->

        <section class="products-content">

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

            <article
              v-for="product in products"
              :key="product.id"
              class="product-card-parent"
              @click="
                navigateToIndividualProduct(
                  product.item_number
                )
              "
            >

              <!-- Main product image -->

              <div class="product-card">

                <img
                  v-if="product.images?.length"
                  :src="
                    getProductImageUrl(
                      getSelectedImage(product)
                    )
                  "
                  :alt="product.name"
                  class="product-main-image"
                >

                <div
                  v-else
                  class="product-image-placeholder"
                >
                  Image coming soon
                </div>

              </div>


              <!-- Thumbnails -->

              <div
                v-if="
                  product.images?.length > 1
                "
                class="product-thumbnails"
              >

                <button
                  v-for="image in product.images"
                  :key="image.id"
                  type="button"
                  class="product-thumbnail"
                  :class="{
                    active:
                      getSelectedImage(product) ===
                      image.image_key
                  }"
                  @click.stop="
                    selectImage(
                      product.id,
                      image.image_key
                    )
                  "
                >
                  <img
                    :src="
                      getProductImageUrl(
                        image.image_key
                      )
                    "
                    :alt="
                      `${product.name} thumbnail`
                    "
                  >
                </button>

              </div>


              <!-- Product name -->

              <div class="product-text-div">
                {{ product.name }}
              </div>


              <!-- Item number -->

              <div
                v-if="product.item_number"
                class="product-item-number"
              >
                Item # {{ product.item_number }}
              </div>


              <!-- Amazon -->

              <div
                v-if="product.amazon_link"
                class="amazon-link-wrapper"
              >
                <a
                  class="amazon-link"
                  :href="product.amazon_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click.stop
                >
                  Buy on Amazon
                </a>
              </div>

            </article>

          </div>

        </section>

      </div>

    </div>


    <!-- Decorative artwork -->

    <img
      :src="sideArt"
      alt=""
      class="side-art"
      aria-hidden="true"
    >

  </main>
</template>

<style scoped>
/* ========================================
   PAGE
======================================== */

.products-page {
  position: relative;

  min-height: 100vh;

  padding: 1.25rem 0 4rem;

  overflow: hidden;

  background: #e6f4fd;

  font-family: 'Fredoka', sans-serif;
}

.products-page-inner {
  position: relative;

  z-index: 2;

  width: min(94%, 78rem);

  margin: 0 auto;
}


/* ========================================
   TITLE
======================================== */

.products-title {
  margin: 0 0 1.5rem;

  text-align: center;

  color: #078fc9;

  font-size: clamp(2.75rem, 8vw, 5rem);
  line-height: 1;
  font-weight: 600;
}


/* ========================================
   MAIN LAYOUT
======================================== */

.products-layout {
  display: flex;
  flex-direction: column;

  gap: 1.25rem;
}


/* ========================================
   FILTER AREA
======================================== */

.products-sidebar {
  width: 100%;
}

.item-count {
  margin-bottom: 0.5rem;

  color: #078fc9;

  font-size: 0.7rem;
  letter-spacing: 0.04em;
  font-weight: 500;
}

.filter-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 0.5rem;

  margin-bottom: 0.4rem;
  padding: 0.7rem 0.8rem;

  background: #078fc9;

  color: white;

  border-radius: 5px;

  font-size: 0.85rem;
  font-weight: 500;
}

.filter-result-count {
  font-size: 0.55rem;
  font-weight: 400;
}

.filter-button {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;

  padding: 0.7rem 0.8rem;

  background: white;

  color: #078fc9;

  border: none;
  border-radius: 5px;

  font: inherit;
  font-size: 0.85rem;
  font-weight: 500;

  cursor: pointer;
}

.filter-button:hover {
  background: #f7fbfe;
}

.filter-plus {
  font-size: 1.2rem;
  line-height: 1;
  font-weight: 600;
}


/* ========================================
   PRODUCT CONTENT
======================================== */

.products-content {
  min-width: 0;
}

.products-status {
  padding: 3rem 1rem;

  text-align: center;

  color: #078fc9;

  font-size: 1.1rem;
  font-weight: 500;
}

.products-error {
  color: #703795;
}


/* ========================================
   GRID
======================================== */

.product-section {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 1rem 0.65rem;
}


/* ========================================
   PRODUCT CARD
======================================== */

.product-card-parent {
  min-width: 0;

  cursor: pointer;
}

.product-card {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  aspect-ratio: 1 / 1;

  padding: 0.75rem;

  box-sizing: border-box;

  background: white;

  border-radius: 8px;

  overflow: hidden;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.product-card-parent:hover .product-card {
  transform: translateY(-2px);

  box-shadow:
    0 4px 14px
    rgba(0, 0, 0, 0.06);
}

.product-main-image {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: contain;
}

.product-image-placeholder {
  color: #999;

  text-align: center;

  font-size: 0.75rem;
}


/* ========================================
   THUMBNAILS
======================================== */

.product-thumbnails {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  gap: 0.3rem;

  margin-top: 0.4rem;
}

.product-thumbnail {
  width: 32px;
  height: 32px;

  padding: 0.15rem;

  background: white;

  border: 1px solid transparent;
  border-radius: 4px;

  cursor: pointer;

  overflow: hidden;
}

.product-thumbnail.active {
  border-color: #078fc9;
}

.product-thumbnail img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: contain;
}


/* ========================================
   PRODUCT TEXT
======================================== */

.product-text-div {
  margin-top: 0.45rem;

  color: #2d2d58;

  text-align: center;

  font-size: clamp(
    0.72rem,
    2.5vw,
    0.95rem
  );

  line-height: 1.1;
  font-weight: 600;
}

.product-item-number {
  margin-top: 0.15rem;

  color: #60607c;

  text-align: center;

  font-size: 0.65rem;
}


/* ========================================
   AMAZON
======================================== */

.amazon-link-wrapper {
  margin-top: 0.45rem;

  text-align: center;
}

.amazon-link {
  display: inline-block;

  color: #078fc9;

  font-size: 0.72rem;
  font-weight: 500;

  text-decoration: none;
}

.amazon-link:hover {
  text-decoration: underline;
}


/* ========================================
   DECORATIVE ART
======================================== */

.side-art {
  position: absolute;

  left: 0;
  bottom: 0;

  z-index: 1;

  width: clamp(
    70px,
    16vw,
    170px
  );

  height: auto;

  pointer-events: none;
  user-select: none;
}


/* ========================================
   TABLET
======================================== */

@media (min-width: 600px) {
  .products-page {
    padding-top: 1.5rem;
  }

  .product-section {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));

    gap: 1.2rem 0.75rem;
  }

  .product-card {
    padding: 1rem;
  }

  .product-thumbnail {
    width: 38px;
    height: 38px;
  }
}


/* ========================================
   DESKTOP
======================================== */

@media (min-width: 900px) {
  .products-page {
    padding-top: 2rem;
    padding-bottom: 6rem;
  }

  .products-title {
    margin-bottom: 2.5rem;
  }

  .products-layout {
    display: grid;

    grid-template-columns:
      10rem minmax(0, 1fr);

    align-items: start;

    gap: 1.2rem;
  }

  .products-sidebar {
    position: sticky;

    top: 1rem;
  }

  .product-section {
    grid-template-columns:
      repeat(4, minmax(0, 1fr));

    gap: 1.4rem 0.75rem;
  }

  .product-card {
    padding: 1rem;
  }
}


/* ========================================
   LARGE DESKTOP
======================================== */

@media (min-width: 1200px) {
  .products-layout {
    grid-template-columns:
      11rem minmax(0, 1fr);

    gap: 1.5rem;
  }

  .product-section {
    gap: 1.5rem 0.9rem;
  }
}
</style>