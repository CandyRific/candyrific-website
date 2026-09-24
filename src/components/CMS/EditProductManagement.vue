<script setup>
import {
  onMounted,
  ref,
  watch
} from 'vue'

/* ========================================
   PROPS / EMITS
======================================== */

const props = defineProps({
  productId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits([
  'close'
])

/* ========================================
   PRODUCT STATE
======================================== */

const product = ref(null)

const editableItemNumber = ref('')
const editableProductName = ref('')
const editableProductDescription = ref('')

/* ========================================
   LOADING STATE
======================================== */

const isLoadingProduct = ref(false)
const productLoadMessage = ref('')

/* ========================================
   INDIVIDUAL SAVE STATE
======================================== */

const isSavingItemNumber = ref(false)
const isSavingName = ref(false)
const isSavingDescription = ref(false)

const itemNumberMessage = ref('')
const nameMessage = ref('')
const descriptionMessage = ref('')

/* ========================================
   LOAD PRODUCT
======================================== */

const loadProduct = async () => {
  isLoadingProduct.value = true
  productLoadMessage.value = ''

  try {
    const response = await fetch(
      `/.netlify/functions/product?id=${encodeURIComponent(
        props.productId
      )}`
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
        `Unable to load product. HTTP ${response.status}`
      )
    }

    if (!data) {
      throw new Error(
        'Product was not found.'
      )
    }

    product.value = data

    editableItemNumber.value =
      data.item_number ?? ''

    editableProductName.value =
      data.name ?? ''

    editableProductDescription.value =
      data.description ?? ''
  } catch (error) {
    console.error(
      'Unable to load product:',
      error
    )

    productLoadMessage.value =
      error.message
  } finally {
    isLoadingProduct.value = false
  }
}

/* ========================================
   SAVE ITEM NUMBER
======================================== */

const saveItemNumber = async () => {
  itemNumberMessage.value = ''

  const itemNumber =
    editableItemNumber.value.trim()

  if (!itemNumber) {
    itemNumberMessage.value =
      'Item number is required.'

    return
  }

  isSavingItemNumber.value = true

  try {
    const response = await fetch(
      '/.netlify/functions/product-number-update',
      {
        method: 'PATCH',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          productId: props.productId,
          itemNumber
        })
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
        `Unable to update item number. HTTP ${response.status}`
      )
    }

    editableItemNumber.value =
      data.product.item_number

    if (product.value) {
      product.value.item_number =
        data.product.item_number
    }

    itemNumberMessage.value =
      data.message ||
      'Item number updated successfully.'
  } catch (error) {
    console.error(
      'Unable to update item number:',
      error
    )

    itemNumberMessage.value =
      error.message
  } finally {
    isSavingItemNumber.value = false
  }
}

/* ========================================
   SAVE PRODUCT NAME
======================================== */

const saveProductName = async () => {
  nameMessage.value = ''

  const name =
    editableProductName.value.trim()

  if (!name) {
    nameMessage.value =
      'Product name is required.'

    return
  }

  isSavingName.value = true

  try {
    const response = await fetch(
      '/.netlify/functions/product-name-update',
      {
        method: 'PATCH',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          productId: props.productId,
          name
        })
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
        `Unable to update product name. HTTP ${response.status}`
      )
    }

    editableProductName.value =
      data.product.name

    if (product.value) {
      product.value.name =
        data.product.name
    }

    nameMessage.value =
      data.message ||
      'Product name updated successfully.'
  } catch (error) {
    console.error(
      'Unable to update product name:',
      error
    )

    nameMessage.value =
      error.message
  } finally {
    isSavingName.value = false
  }
}

/* ========================================
   SAVE PRODUCT DESCRIPTION
======================================== */

const saveProductDescription = async () => {
  descriptionMessage.value = ''

  isSavingDescription.value = true

  try {
    const response = await fetch(
      '/.netlify/functions/product-description-update',
      {
        method: 'PATCH',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          productId: props.productId,

          description:
            editableProductDescription.value
        })
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
        `Unable to update product description. HTTP ${response.status}`
      )
    }

    editableProductDescription.value =
      data.product.description ?? ''

    if (product.value) {
      product.value.description =
        data.product.description ?? ''
    }

    descriptionMessage.value =
      data.message ||
      'Product description updated successfully.'
  } catch (error) {
    console.error(
      'Unable to update product description:',
      error
    )

    descriptionMessage.value =
      error.message
  } finally {
    isSavingDescription.value = false
  }
}

/* ========================================
   CLOSE
======================================== */

const closeEditor = () => {
  emit('close')
}

/* ========================================
   WATCH PRODUCT ID
======================================== */

watch(
  () => props.productId,
  () => {
    loadProduct()
  }
)

/* ========================================
   INITIAL LOAD
======================================== */

onMounted(() => {
  loadProduct()
})
</script>

<template>
  <section class="edit-product-management">

    <!-- ========================================
         HEADER
    ========================================= -->

    <div class="edit-product-header">
      <div>
        <p class="edit-label">
          Editing Product
        </p>

        <h3 class="edit-product-title">
          {{
            product?.name ||
            'Product'
          }}
        </h3>
      </div>

      <button
        type="button"
        class="back-button"
        @click="closeEditor"
      >
        Back to Products
      </button>
    </div>

    <!-- ========================================
         LOADING
    ========================================= -->

    <p
      v-if="isLoadingProduct"
      class="product-status"
    >
      Loading product...
    </p>

    <!-- ========================================
         ERROR
    ========================================= -->

    <p
      v-else-if="productLoadMessage"
      class="product-error"
    >
      {{ productLoadMessage }}
    </p>

    <!-- ========================================
         PRODUCT FIELDS
    ========================================= -->

    <div
      v-else-if="product"
      class="product-fields"
    >

      <!-- ========================================
           ITEM NUMBER
      ========================================= -->

      <div class="product-field-card">
        <div class="field-heading">
          Item Number
        </div>

        <div class="field-editor">
          <input
            v-model="editableItemNumber"
            type="text"
            class="field-input"
          >

          <button
            type="button"
            class="save-button"
            :disabled="isSavingItemNumber"
            @click="saveItemNumber"
          >
            {{
              isSavingItemNumber
                ? 'Saving...'
                : 'Save'
            }}
          </button>
        </div>

        <p
          v-if="itemNumberMessage"
          class="field-message"
        >
          {{ itemNumberMessage }}
        </p>
      </div>

      <!-- ========================================
           PRODUCT NAME
      ========================================= -->

      <div class="product-field-card">
        <div class="field-heading">
          Product Name
        </div>

        <div class="field-editor">
          <input
            v-model="editableProductName"
            type="text"
            class="field-input"
          >

          <button
            type="button"
            class="save-button"
            :disabled="isSavingName"
            @click="saveProductName"
          >
            {{
              isSavingName
                ? 'Saving...'
                : 'Save'
            }}
          </button>
        </div>

        <p
          v-if="nameMessage"
          class="field-message"
        >
          {{ nameMessage }}
        </p>
      </div>

      <!-- ========================================
           PRODUCT DESCRIPTION
      ========================================= -->

      <div class="product-field-card">
        <div class="field-heading">
          Product Description
        </div>

        <div class="description-editor">
          <textarea
            v-model="editableProductDescription"
            class="field-textarea"
            rows="6"
          ></textarea>

          <button
            type="button"
            class="save-button"
            :disabled="isSavingDescription"
            @click="saveProductDescription"
          >
            {{
              isSavingDescription
                ? 'Saving...'
                : 'Save'
            }}
          </button>
        </div>

        <p
          v-if="descriptionMessage"
          class="field-message"
        >
          {{ descriptionMessage }}
        </p>
      </div>

    </div>

  </section>
</template>

<style scoped>
.edit-product-management {
  width: 100%;

  padding: clamp(1rem, 3vw, 2rem);

  background: white;

  border-radius: 10px;

  box-sizing: border-box;

  font-family: 'Fredoka', sans-serif;
}

/* ========================================
   HEADER
======================================== */

.edit-product-header {
  margin-bottom: 1.5rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;
}

.edit-label {
  margin: 0 0 0.2rem;

  color: #777;

  font-size: 0.85rem;
}

.edit-product-title {
  margin: 0;

  color: #703795;

  font-size: 1.6rem;
  font-weight: 600;
}

.back-button {
  padding: 0.6rem 1rem;

  background: white;

  color: #703795;

  border: 2px solid #703795;
  border-radius: 6px;

  font: inherit;
  font-weight: 500;

  cursor: pointer;
}

.back-button:hover {
  background: #f5eff8;
}

/* ========================================
   FIELD LIST
======================================== */

.product-fields {
  display: flex;
  flex-direction: column;

  gap: 1rem;
}

.product-field-card {
  padding: 1.25rem;

  border: 1px solid #ddd;
  border-radius: 8px;
}

.field-heading {
  margin-bottom: 0.65rem;

  color: #703795;

  font-weight: 600;
}

/* ========================================
   STANDARD FIELD
======================================== */

.field-editor {
  display: flex;
  align-items: center;

  gap: 0.75rem;
}

.field-input {
  min-width: 0;
  flex: 1;

  padding: 0.75rem;

  border: 1px solid #ccc;
  border-radius: 6px;

  box-sizing: border-box;

  font: inherit;
}

/* ========================================
   DESCRIPTION
======================================== */

.description-editor {
  display: flex;
  align-items: flex-start;

  gap: 0.75rem;
}

.field-textarea {
  min-width: 0;
  flex: 1;

  padding: 0.75rem;

  border: 1px solid #ccc;
  border-radius: 6px;

  box-sizing: border-box;

  resize: vertical;

  font: inherit;
}

/* ========================================
   SAVE BUTTON
======================================== */

.save-button {
  flex-shrink: 0;

  padding: 0.7rem 1.1rem;

  background: #703795;

  color: white;

  border: none;
  border-radius: 6px;

  font: inherit;
  font-weight: 500;

  cursor: pointer;
}

.save-button:hover {
  opacity: 0.9;
}

.save-button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* ========================================
   MESSAGES
======================================== */

.field-message {
  margin: 0.65rem 0 0;

  color: #703795;

  font-size: 0.9rem;
}

.product-status {
  margin: 0;

  color: #703795;
}

.product-error {
  margin: 0;

  color: #c62828;
}

/* ========================================
   MOBILE
======================================== */

@media (max-width: 600px) {
  .edit-product-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .field-editor,
  .description-editor {
    flex-direction: column;
    align-items: stretch;
  }

  .save-button {
    width: 100%;
  }
}
</style>