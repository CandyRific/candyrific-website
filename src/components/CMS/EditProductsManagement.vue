
<script setup>
import { computed, onMounted, ref } from 'vue'

import EditProductManagement from './EditProductManagement.vue'

/* ========================================
   PRODUCT LIST STATE
======================================== */

const products = ref([])
const isLoadingProducts = ref(false)
const productLoadMessage = ref('')

/* ========================================
   SELECTED PRODUCT STATE
======================================== */

const selectedProductId = ref(null)

/* ========================================
   DRAG AND DROP STATE
======================================== */

const draggedProductId = ref(null)
const isDragging = ref(false)

const originalProductIds = ref([])

/* ========================================
   SAVE ORDER STATE
======================================== */

const isSavingOrder = ref(false)
const orderSaveMessage = ref('')
const orderSaveError = ref(false)

const hasOrderChanges = computed(() => {
  const currentIds = products.value.map(
    (product) => product.id
  )

  return (
    JSON.stringify(currentIds) !==
    JSON.stringify(originalProductIds.value)
  )
})

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
        `Unable to load products. HTTP ${response.status}`
      )
    }

    if (!Array.isArray(data)) {
      throw new Error(
        'Products response was not an array.'
      )
    }

    products.value = data

    originalProductIds.value = data.map(
      (product) => product.id
    )

    orderSaveMessage.value = ''
    orderSaveError.value = false
  } catch (error) {
    console.error(
      'Unable to load products:',
      error
    )

    productLoadMessage.value = error.message
  } finally {
    isLoadingProducts.value = false
  }
}

/* ========================================
   MOVE PRODUCT
======================================== */

const moveProduct = (fromIndex, toIndex) => {
  if (
    isSavingOrder.value ||
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= products.value.length ||
    toIndex >= products.value.length
  ) {
    return
  }

  const updatedProducts = [...products.value]

  const [movedProduct] = updatedProducts.splice(
    fromIndex,
    1
  )

  updatedProducts.splice(
    toIndex,
    0,
    movedProduct
  )

  products.value = updatedProducts

  orderSaveMessage.value = ''
  orderSaveError.value = false
}

/* ========================================
   DRAG START
======================================== */

const handleDragStart = (event, productId) => {
  if (isSavingOrder.value) {
    event.preventDefault()
    return
  }

  draggedProductId.value = productId
  isDragging.value = true

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'

    event.dataTransfer.setData(
      'text/plain',
      String(productId)
    )
  }
}

/* ========================================
   DRAG OVER
======================================== */

const handleDragOver = (event, targetProductId) => {
  if (draggedProductId.value === null) {
    return
  }

  event.preventDefault()

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }

  const fromIndex = products.value.findIndex(
    (product) => product.id === draggedProductId.value
  )

  const toIndex = products.value.findIndex(
    (product) => product.id === targetProductId
  )

  if (fromIndex === -1 || toIndex === -1) {
    return
  }

  moveProduct(fromIndex, toIndex)
}

/* ========================================
   DROP / DRAG END
======================================== */

const handleDrop = (event) => {
  event.preventDefault()

  draggedProductId.value = null
  isDragging.value = false
}

const handleDragEnd = () => {
  draggedProductId.value = null
  isDragging.value = false
}

/* ========================================
   MOVE UP / DOWN
======================================== */

const moveProductUp = (index) => {
  moveProduct(index, index - 1)
}

const moveProductDown = (index) => {
  moveProduct(index, index + 1)
}

/* ========================================
   RESET ORDER
======================================== */

const resetProductOrder = () => {
  if (isSavingOrder.value) {
    return
  }

  const productMap = new Map(
    products.value.map(
      (product) => [product.id, product]
    )
  )

  products.value = originalProductIds.value
    .map((id) => productMap.get(id))
    .filter(Boolean)

  orderSaveMessage.value = ''
  orderSaveError.value = false
}

/* ========================================
   SAVE PRODUCT ORDER
======================================== */

const saveProductOrder = async () => {
  if (
    isSavingOrder.value ||
    !hasOrderChanges.value
  ) {
    return
  }

  isSavingOrder.value = true
  orderSaveMessage.value = ''
  orderSaveError.value = false

  const updatedOrder = products.value.map(
    (product, index) => ({
      id: product.id,
      display_order: index + 1
    })
  )

  try {
    const response = await fetch(
      '/.netlify/functions/product-order-update',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          products: updatedOrder
        })
      }
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
        'Unable to save product order.'
      )
    }

    originalProductIds.value = products.value.map(
      (product) => product.id
    )

    products.value = products.value.map(
      (product, index) => ({
        ...product,
        display_order: index + 1
      })
    )

    orderSaveMessage.value =
      'Product order saved successfully!'

  } catch (error) {
    console.error(
      'Unable to save product order:',
      error
    )

    orderSaveError.value = true

    orderSaveMessage.value =
      error.message
  } finally {
    isSavingOrder.value = false
  }
}

/* ========================================
   OPEN PRODUCT
======================================== */

const editProduct = (productId) => {
  if (hasOrderChanges.value) {
    const confirmed = window.confirm(
      'You have unsaved product order changes. Continue editing without saving these changes?'
    )

    if (!confirmed) {
      return
    }

    resetProductOrder()
  }

  selectedProductId.value = productId
}

/* ========================================
   CLOSE PRODUCT
======================================== */

const closeProduct = () => {
  selectedProductId.value = null
  loadProducts()
}

/* ========================================
   INITIAL LOAD
======================================== */

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div class="edit-products-management">

    <!-- ========================================
         SINGLE PRODUCT EDITOR
    ========================================= -->

    <EditProductManagement
      v-if="selectedProductId !== null"
      :product-id="selectedProductId"
      @close="closeProduct"
    />

    <!-- ========================================
         PRODUCT LIST
    ========================================= -->

    <div
      v-else
      class="edit-product-section"
    >
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

      <template v-else>

        <!-- ORDER INSTRUCTIONS -->

        <div class="order-instructions">
          <div class="order-instructions-content">
            <span class="order-instructions-title">
              Arrange Products
            </span>

            <span class="order-instructions-description">
              Drag products into your preferred order.
              Changes will appear on the Products page
              after saving.
            </span>
          </div>

          <span
            v-if="hasOrderChanges"
            class="unsaved-badge"
          >
            Unsaved Changes
          </span>
        </div>

        <!-- PRODUCT LIST -->

        <div
          class="product-list"
          :class="{ 'is-dragging': isDragging }"
        >
          <div
            v-for="(product, index) in products"
            :key="product.id"
            class="product-list-item"
            :class="{
              'dragging-item':
                draggedProductId === product.id
            }"
            @dragover="handleDragOver($event, product.id)"
            @drop="handleDrop"
          >

            <!-- DRAG HANDLE -->

            <span
              class="drag-handle"
              role="img"
              aria-label="Drag to reorder"
              title="Drag to reorder"
              :draggable="!isSavingOrder"
              @dragstart="handleDragStart($event, product.id)"
              @dragend="handleDragEnd"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <circle cx="9" cy="5" r="1.7"/>
                <circle cx="15" cy="5" r="1.7"/>
                <circle cx="9" cy="12" r="1.7"/>
                <circle cx="15" cy="12" r="1.7"/>
                <circle cx="9" cy="19" r="1.7"/>
                <circle cx="15" cy="19" r="1.7"/>
              </svg>
            </span>

            <!-- POSITION -->

            <span class="product-position">
              {{ index + 1 }}
            </span>

            <!-- PRODUCT INFORMATION -->

            <div class="product-list-info">
              <span class="product-item-number">
                {{ product.item_number }}
              </span>

              <span class="product-list-name">
                {{ product.name }}
              </span>
            </div>

            <!-- ACTIONS -->

            <div class="product-list-actions">

              <div class="reorder-buttons">
                <button
                  type="button"
                  class="reorder-arrow"
                  aria-label="Move product up"
                  title="Move up"
                  :disabled="index === 0 || isSavingOrder"
                  @click="moveProductUp(index)"
                >
                  ↑
                </button>

                <button
                  type="button"
                  class="reorder-arrow"
                  aria-label="Move product down"
                  title="Move down"
                  :disabled="
                    index === products.length - 1 ||
                    isSavingOrder
                  "
                  @click="moveProductDown(index)"
                >
                  ↓
                </button>
              </div>

              <button
                type="button"
                class="edit-product-button"
                :disabled="isSavingOrder"
                @click="editProduct(product.id)"
              >
                Edit
              </button>
            </div>

          </div>
        </div>

        <!-- SAVE ORDER -->

        <div class="product-order-footer">

          <div class="product-order-status">
            <span
              v-if="orderSaveMessage"
              :class="
                orderSaveError
                  ? 'order-error'
                  : 'order-success'
              "
              role="status"
            >
              {{ orderSaveMessage }}
            </span>

            <span
              v-else-if="hasOrderChanges"
              class="order-pending"
            >
              Your new order is ready to save.
            </span>
          </div>

          <div class="product-order-buttons">

            <button
              v-if="hasOrderChanges"
              type="button"
              class="reset-order-button"
              :disabled="isSavingOrder"
              @click="resetProductOrder"
            >
              Reset
            </button>

            <button
              type="button"
              class="save-order-button"
              :disabled="
                !hasOrderChanges ||
                isSavingOrder
              "
              @click="saveProductOrder"
            >
              {{
                isSavingOrder
                  ? 'Saving...'
                  : 'Save Product Order'
              }}
            </button>

          </div>
        </div>

      </template>
    </div>

  </div>
</template>

<style scoped>
.edit-products-management {
  width: 100%;
  font-family: 'Fredoka', sans-serif;
}

.edit-product-section {
  padding: clamp(1rem, 3vw, 2rem);
  background: white;
  border-radius: 10px;
}

/* ========================================
   ORDER INSTRUCTIONS
======================================== */

.order-instructions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  margin-bottom: 1.25rem;
  padding: 1rem 1.25rem;

  background: #f7f2fa;
  border: 1px solid #e9dff0;
  border-radius: 10px;
}

.order-instructions-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-instructions-title {
  color: #703795;
  font-size: 1.1rem;
  font-weight: 600;
}

.order-instructions-description {
  color: #666;
  font-size: 0.9rem;
}

.unsaved-badge {
  padding: 0.4rem 0.75rem;

  background: #fff0f5;
  color: #c52f70;

  border-radius: 50px;

  font-size: 0.8rem;
  font-weight: 600;
}

/* ========================================
   PRODUCT LIST
======================================== */

.product-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.product-list-item {
  width: 100%;

  padding: 0.85rem 1rem;

  display: flex;
  align-items: center;
  gap: 1rem;

  background: white;

  border: 1px solid #ddd;
  border-radius: 10px;

  box-sizing: border-box;

  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    box-shadow 0.15s ease;
}

.product-list-item:hover {
  border-color: #cbb2df;
  background: #fdfbff;
}

.dragging-item {
  border: 2px dashed #703795;
  background: #f3ebf9;
  opacity: 0.65;
}

/* ========================================
   DRAG HANDLE
======================================== */

.drag-handle {
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0.35rem;

  color: #aaa;

  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
}

.drag-handle:hover {
  color: #703795;
}

.drag-handle:active {
  cursor: grabbing;
}

/* ========================================
   POSITION
======================================== */

.product-position {
  flex-shrink: 0;

  width: 2rem;
  height: 2rem;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f0e7f7;
  color: #703795;

  border-radius: 8px;

  font-size: 0.85rem;
  font-weight: 600;
}

/* ========================================
   PRODUCT INFORMATION
======================================== */

.product-list-info {
  min-width: 0;
  flex: 1;

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
  min-width: 0;

  color: #222;
  font-weight: 500;

  overflow-wrap: anywhere;
}

/* ========================================
   ACTIONS
======================================== */

.product-list-actions {
  flex-shrink: 0;

  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.reorder-buttons {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.reorder-arrow {
  width: 2rem;
  height: 2rem;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f7f2fa;
  color: #703795;

  border: 1px solid #e9dff0;
  border-radius: 6px;

  font: inherit;
  font-size: 1.1rem;

  cursor: pointer;
}

.reorder-arrow:hover:not(:disabled) {
  background: #e9dff0;
}

.reorder-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
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

  transition:
    background-color 0.15s ease,
    transform 0.15s ease;
}

.edit-product-button:hover:not(:disabled) {
  background: #5e2d80;
  transform: translateY(-1px);
}

.edit-product-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ========================================
   SAVE ORDER FOOTER
======================================== */

.product-order-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  margin-top: 1.5rem;
  padding-top: 1.5rem;

  border-top: 1px solid #e5e5e5;
}

.product-order-status {
  flex: 1;
  min-width: 0;

  font-size: 0.9rem;
}

.order-pending {
  color: #703795;
}

.order-success {
  color: #237a49;
}

.order-error {
  color: #c62828;
}

.product-order-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  margin-left: auto;
}

.reset-order-button {
  padding: 0.75rem 1rem;

  background: white;
  color: #703795;

  border: 1px solid #703795;
  border-radius: 8px;

  font: inherit;
  font-weight: 500;

  cursor: pointer;
}

.reset-order-button:hover:not(:disabled) {
  background: #f7f2fa;
}

.save-order-button {
  padding: 0.8rem 1.5rem;

  background: linear-gradient(
    110deg,
    #703795,
    #f04d86
  );

  color: white;

  border: none;
  border-radius: 8px;

  font: inherit;
  font-weight: 600;

  cursor: pointer;

  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.save-order-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.save-order-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.product-list-status {
  margin: 0;
  color: #703795;
}

.product-list-error {
  margin: 0;
  color: #c62828;
}

/* ========================================
   MOBILE
======================================== */

@media (max-width: 600px) {
  .product-list-item {
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .product-list-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .product-item-number {
    min-width: 0;
  }

  .product-list-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .product-order-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .product-order-buttons {
    width: 100%;
    margin-left: 0;
  }

  .save-order-button {
    flex: 1;
  }
}
</style>
