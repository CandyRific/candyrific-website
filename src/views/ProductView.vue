<script setup>
import {
  computed,
  ref,
  watch
} from 'vue'

import {
  useRoute
} from 'vue-router'

const route = useRoute()

const product = ref(null)
const selectedImage = ref(null)

const isLoading = ref(true)
const errorMessage = ref('')


/* ========================================
   PRODUCT ID
======================================== */

const productId = computed(() => {
  return route.params.id
})


/* ========================================
   PRODUCT IMAGE
======================================== */

const getProductImageUrl = (imageKey) => {
  if (!imageKey) {
    return ''
  }

  return `/.netlify/functions/product-image?key=${encodeURIComponent(
    imageKey
  )}`
}


/* ========================================
   LOAD PRODUCT
======================================== */

const loadProduct = async () => {
  isLoading.value = true
  errorMessage.value = ''

  product.value = null
  selectedImage.value = null

  try {
    const response = await fetch(
      `/.netlify/functions/product?id=${encodeURIComponent(
        productId.value
      )}`
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.error ||
        'Unable to load product.'
      )
    }

    product.value = data

    if (data.images?.length) {
      selectedImage.value =
        data.images[0].image_key
    }
  } catch (error) {
    console.error(
      'Error loading product:',
      error
    )

    errorMessage.value =
      error.message ||
      'Unable to load this product.'
  } finally {
    isLoading.value = false
  }
}


/* ========================================
   IMAGE SELECTION
======================================== */

const selectImage = (imageKey) => {
  selectedImage.value = imageKey
}


/* ========================================
   PRODUCT ID CHANGE
======================================== */

watch(
  productId,
  () => {
    loadProduct()
  },
  {
    immediate: true
  }
)
</script>

<template>
  <main class="individual-product-page">

    <div class="product-page-content">

      <!-- ========================================
           LOADING
      ========================================= -->

      <div
        v-if="isLoading"
        class="product-state-message"
      >
        Loading product...
      </div>


      <!-- ========================================
           ERROR
      ========================================= -->

      <div
        v-else-if="errorMessage"
        class="product-state-message product-error-message"
      >
        {{ errorMessage }}
      </div>


      <!-- ========================================
           PRODUCT
      ========================================= -->

      <article
        v-else-if="product"
        class="individual-product-card"
      >

        <!-- ========================================
             IMAGES
        ========================================= -->

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


          <!-- Thumbnails -->

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
              :aria-pressed="
                selectedImage === image.image_key
              "
              @click="selectImage(image.image_key)"
            >
              <img
                :src="getProductImageUrl(image.image_key)"
                :alt="`${product.name} thumbnail`"
              >
            </button>

          </div>

        </section>


        <!-- ========================================
             PRODUCT INFORMATION
        ========================================= -->

        <section class="product-information-section">

          <div class="product-heading-group">

            <h1 class="individual-product-name">
              {{ product.name }}
            </h1>

            <div class="individual-product-number">
              Item # {{ product.item_number }}
            </div>

          </div>


          <p
            v-if="product.description"
            class="individual-product-description"
          >
            {{ product.description }}
          </p>


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

  </main>
</template>

<style scoped>
/* ========================================
   PAGE
======================================== */

.individual-product-page {
  width: 100%;
  min-height: 70vh;

  font-family:
    'Fredoka',
    sans-serif;

  background:
    linear-gradient(
      180deg,
      #eef9fd 0%,
      #e6f7fc 50%,
      #f7fcfe 100%
    );
}


/* ========================================
   PAGE CONTENT
======================================== */

.product-page-content {
  width: 100%;
  max-width: 1400px;

  margin: 0 auto;

  padding:
    clamp(2rem, 5vw, 4.5rem)
    clamp(1rem, 4vw, 3rem)
    clamp(3rem, 6vw, 6rem);
}


/* ========================================
   LOADING / ERROR
======================================== */

.product-state-message {
  padding:
    4rem
    1rem;

  text-align: center;

  color: #078fc9;

  font-size: 1.1rem;
  font-weight: 600;
}

.product-error-message {
  color: #703795;
}


/* ========================================
   PRODUCT CARD
======================================== */

.individual-product-card {
  display: flex;

  flex-direction: column;

  gap:
    clamp(
      2rem,
      5vw,
      4rem
    );

  width: 100%;

  padding:
    clamp(
      1rem,
      4vw,
      3rem
    );

  background: #ffffff;

  border:
    1px solid
    rgba(112, 55, 149, 0.08);

  border-radius: 1.5rem;

  box-shadow:
    0
    14px
    36px
    rgba(
      53,
      36,
      84,
      0.09
    );
}


/* ========================================
   IMAGE SECTION
======================================== */

.product-images-section {
  width: 100%;
}


/* ========================================
   MAIN PRODUCT IMAGE
======================================== */

.main-product-image-container {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;

  aspect-ratio: 1 / 1;

  padding:
    clamp(
      1.25rem,
      4vw,
      2.5rem
    );

  background: #ffffff;

  border:
    1px solid
    rgba(112, 55, 149, 0.12);

  border-radius: 1.25rem;

  overflow: hidden;

  box-shadow:
    inset
    0
    0
    0
    1px
    rgba(
      255,
      255,
      255,
      0.6
    ),
    0
    6px
    18px
    rgba(
      53,
      36,
      84,
      0.05
    );
}

.main-product-image {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: contain;
}


/* ========================================
   NO IMAGE
======================================== */

.no-product-image {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  color: #078fc9;

  font-size: 1rem;

  font-weight: 600;

  text-align: center;
}


/* ========================================
   THUMBNAILS
======================================== */

.individual-product-thumbnails {
  display: flex;

  flex-wrap: wrap;

  gap: 0.75rem;

  margin-top: 1rem;
}


/* ========================================
   THUMBNAIL BUTTON
======================================== */

.individual-product-thumbnail {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 72px;
  height: 72px;

  padding: 0.4rem;

  border:
    2px solid
    rgba(112, 55, 149, 0.1);

  border-radius: 0.75rem;

  background: #ffffff;

  cursor: pointer;

  overflow: hidden;

  box-shadow:
    0
    3px
    8px
    rgba(
      53,
      36,
      84,
      0.05
    );

  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.individual-product-thumbnail:hover {
  transform:
    translateY(-2px);

  border-color:
    rgba(1, 174, 240, 0.5);

  box-shadow:
    0
    6px
    12px
    rgba(
      53,
      36,
      84,
      0.1
    );
}

.individual-product-thumbnail:active {
  transform:
    translateY(0);
}

.individual-product-thumbnail.selected-thumbnail {
  border-color: #01aef0;

  box-shadow:
    0
    0
    0
    2px
    rgba(
      1,
      174,
      240,
      0.12
    );
}

.individual-product-thumbnail:focus-visible {
  outline:
    3px solid
    rgba(
      112,
      55,
      149,
      0.35
    );

  outline-offset: 3px;
}


/* ========================================
   THUMBNAIL IMAGE
======================================== */

.individual-product-thumbnail img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: contain;
}


/* ========================================
   PRODUCT INFORMATION
======================================== */

.product-information-section {
  display: flex;

  flex-direction: column;

  width: 100%;
}


/* ========================================
   PRODUCT HEADING GROUP
======================================== */

.product-heading-group {
  padding-bottom: 1.5rem;

  margin-bottom: 1.5rem;

  border-bottom:
    1px solid
    rgba(
      112,
      55,
      149,
      0.1
    );
}


/* ========================================
   PRODUCT NAME
======================================== */

.individual-product-name {
  margin: 0;

  color: #078fc9;

  font-size:
    clamp(
      2rem,
      6vw,
      3rem
    );

  line-height: 1.05;

  font-weight: 600;

  letter-spacing: -0.025em;
}


/* ========================================
   ITEM NUMBER
======================================== */

.individual-product-number {
  margin-top: 0.7rem;

  color:
    rgba(
      53,
      36,
      84,
      0.65
    );

  font-size: 0.95rem;

  font-weight: 500;
}


/* ========================================
   DESCRIPTION
======================================== */

.individual-product-description {
  margin: 0;

  max-width: 42rem;

  color: #352454;

  font-size:
    clamp(
      1rem,
      1.6vw,
      1.25rem
    );

  line-height: 1.65;

  font-weight: 300;

  white-space: pre-line;
}


/* ========================================
   AMAZON BUTTON
======================================== */

.individual-product-amazon-link {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  align-self: flex-start;

  margin-top: 2rem;

  padding:
    0.9rem
    1.5rem;

  color: #ffffff;

  background:
    linear-gradient(
      90deg,
      #703795 0%,
      #4f5eab 45%,
      #01aef0 100%
    );

  border-radius: 0.85rem;

  text-decoration: none;

  font-size: 1.05rem;

  font-weight: 500;

  box-shadow:
    0
    5px
    14px
    rgba(
      53,
      36,
      84,
      0.18
    );

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.individual-product-amazon-link:hover {
  transform:
    translateY(-2px);

  box-shadow:
    0
    8px
    18px
    rgba(
      53,
      36,
      84,
      0.24
    );

  filter:
    brightness(1.03);
}

.individual-product-amazon-link:active {
  transform:
    translateY(0);

  box-shadow:
    0
    3px
    8px
    rgba(
      53,
      36,
      84,
      0.18
    );
}

.individual-product-amazon-link:focus-visible {
  outline:
    4px solid
    rgba(
      250,
      209,
      65,
      0.85
    );

  outline-offset: 3px;
}


/* ========================================
   TABLET
======================================== */

@media (min-width: 600px) {

  .individual-product-thumbnail {
    width: 86px;
    height: 86px;
  }

}


/* ========================================
   DESKTOP
======================================== */

@media (min-width: 900px) {

  .individual-product-card {
    display: grid;

    grid-template-columns:
      minmax(0, 1.05fr)
      minmax(320px, 0.95fr);

    align-items: start;

    gap:
      clamp(
        3rem,
        5vw,
        5rem
      );
  }

  .product-information-section {
    justify-content: flex-start;

    padding-top: 0.5rem;
  }

  .individual-product-name {
    font-size:
      clamp(
        2.25rem,
        3vw,
        3.25rem
      );
  }

  .individual-product-amazon-link {
    margin-top: 2.5rem;
  }

}


/* ========================================
   LARGE DESKTOP
======================================== */

@media (min-width: 1200px) {

  .individual-product-card {
    padding: 3.5rem;
  }

}


/* ========================================
   MOBILE
======================================== */

@media (max-width: 599px) {

  .individual-product-card {
    border-radius: 1.25rem;
  }

  .main-product-image-container {
    border-radius: 1rem;
  }

  .individual-product-amazon-link {
    width: 100%;
  }

}
</style>