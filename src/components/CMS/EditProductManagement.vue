<script setup>
import { onMounted, ref } from 'vue'

/* ========================================
   PRODUCT STATE
======================================== */

const products = ref([])
const isLoadingProducts = ref(false)
const productLoadMessage = ref('')

/* ========================================
   SORT PRODUCTS BY ITEM NUMBER
======================================== */

const sortProducts = (productList) => {
  return [...productList].sort(
    (productA, productB) => {
      const itemNumberA =
        productA.item_number ?? ''

      const itemNumberB =
        productB.item_number ?? ''

      return String(itemNumberA).localeCompare(
        String(itemNumberB),
        undefined,
        {
          numeric: true,
          sensitivity: 'base'
        }
      )
    }
  )
}

/* ========================================
   LOAD PRODUCTS
======================================== */

const loadProducts = async () => {
  isLoadingProducts.value = true
  productLoadMessage.value = ''

  try {
    const response = await fetch(
      '/.netlify/functions/products'
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
        `Unable to load products. HTTP ${response.status}`
      )
    }

    if (!Array.isArray(data)) {
      throw new Error(
        'Products response was not an array.'
      )
    }

    products.value =
      sortProducts(data)
  } catch (error) {
    console.error(
      'Unable to load products:',
      error
    )

    productLoadMessage.value =
      error.message
  } finally {
    isLoadingProducts.value = false
  }
}

/* ========================================
   EDIT PRODUCT
======================================== */

const editProduct = (product) => {
  /*
    We'll build the actual editing functionality
    here next.

    For now, this confirms that the Edit component
    owns the selected product action.
  */

  console.log(
    'Edit product:',
    product
  )
}

/* ========================================
   INITIAL LOAD
======================================== */

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div class="edit-product-section">
    <p
      v-if="isLoadingProducts"
      class="product-list-status"
    >
      Loading products...
    </p>

    <p
      v-else-if="productLoadMessage"
      class="product-list-error"
    >
      {{ productLoadMessage }}
    </p>

    <p
      v-else-if="products.length === 0"
      class="product-list-status"
    >
      No products found.
    </p>

    <div
      v-else
      class="product-list"
    >
      <div
        v-for="product in products"
        :key="product.id"
        class="product-list-item"
      >
        <div class="product-list-info">
          <span class="product-item-number">
            {{ product.item_number }}
          </span>

          <span class="product-list-name">
            {{ product.name }}
          </span>
        </div>

        <button
          type="button"
          class="edit-product-button"
          @click="editProduct(product)"
        >
          Edit
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-product-section {
  padding: clamp(1rem, 3vw, 2rem);

  background: white;

  border-radius: 10px;

  font-family: 'Fredoka', sans-serif;
}

.product-list {
  display: flex;
  flex-direction: column;

  gap: 0.75rem;
}

.product-list-item {
  width: 100%;

  padding: 1rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;

  border: 1px solid #ddd;
  border-radius: 8px;

  box-sizing: border-box;
}

.product-list-info {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 1rem;
}

.product-item-number {
  min-width: 5rem;

  color: #703795;

  font-weight: 600;
}

.product-list-name {
  color: #222;

  font-weight: 500;
}

.edit-product-button {
  flex-shrink: 0;

  padding: 0.55rem 1rem;

  background: #703795;

  color: white;

  border: none;
  border-radius: 6px;

  font: inherit;
  font-weight: 500;

  cursor: pointer;
}

.edit-product-button:hover {
  opacity: 0.9;
}

.product-list-status {
  margin: 0;

  color: #703795;
}

.product-list-error {
  margin: 0;

  color: #c62828;
}

@media (max-width: 600px) {
  .product-list-item {
    align-items: flex-start;
  }

  .product-list-info {
    flex-direction: column;
    align-items: flex-start;

    gap: 0.25rem;
  }

  .product-item-number {
    min-width: 0;
  }
}
</style>