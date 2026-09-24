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
const editableAmazonLink = ref('')

/* ========================================
   BRAND STATE
======================================== */

const allBrands = ref([])

const selectedBrandIds = ref([])
const originalBrandIds = ref([])

const newBrands = ref([])
const deleteBrands = ref([])

const isBrandDropdownOpen = ref(false)

/* ========================================
   SEASON STATE
======================================== */

const allSeasons = ref([])

const selectedSeasonIds = ref([])
const originalSeasonIds = ref([])

const newSeasons = ref([])
const deleteSeasons = ref([])

const isSeasonDropdownOpen = ref(false)

/* ========================================
   LOADING STATE
======================================== */

const isLoadingProduct = ref(false)
const productLoadMessage = ref('')

const isLoadingBrands = ref(false)
const isLoadingSeasons = ref(false)

/* ========================================
   INDIVIDUAL SAVE STATE
======================================== */

const isSavingItemNumber = ref(false)
const isSavingName = ref(false)
const isSavingDescription = ref(false)
const isSavingAmazonLink = ref(false)

const isSavingBrands = ref(false)
const isSavingSeasons = ref(false)

const itemNumberMessage = ref('')
const nameMessage = ref('')
const descriptionMessage = ref('')
const amazonLinkMessage = ref('')

const brandsMessage = ref('')
const seasonsMessage = ref('')

/* ========================================
   RESPONSE HELPER
======================================== */

const readResponse = async (
  response,
  fallbackMessage
) => {
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
      `${fallbackMessage} HTTP ${response.status}`
    )
  }

  return data
}

/* ========================================
   LOAD ALL BRANDS
======================================== */

const loadAllBrands = async () => {
  const response = await fetch(
    '/.netlify/functions/brands'
  )

  const data = await readResponse(
    response,
    'Unable to load brands.'
  )

  allBrands.value =
    Array.isArray(data)
      ? data
      : []
}

/* ========================================
   LOAD CURRENT PRODUCT BRANDS
======================================== */

const loadCurrentProductBrands =
  async () => {
    const response = await fetch(
      `/.netlify/functions/product-update-brands?productId=${encodeURIComponent(
        props.productId
      )}`
    )

    const data = await readResponse(
      response,
      'Unable to load product brands.'
    )

    const currentIds =
      data.map(
        (brand) =>
          Number(brand.id)
      )

    selectedBrandIds.value = [
      ...currentIds
    ]

    originalBrandIds.value = [
      ...currentIds
    ]

    newBrands.value = []
    deleteBrands.value = []
  }

/* ========================================
   LOAD BRAND EDITOR
======================================== */

const loadBrandEditor = async () => {
  isLoadingBrands.value = true
  brandsMessage.value = ''

  try {
    await Promise.all([
      loadAllBrands(),
      loadCurrentProductBrands()
    ])
  } catch (error) {
    console.error(
      'Unable to load brand editor:',
      error
    )

    brandsMessage.value =
      error.message
  } finally {
    isLoadingBrands.value = false
  }
}

/* ========================================
   LOAD ALL SEASONS
======================================== */

const loadAllSeasons = async () => {
  const response = await fetch(
    '/.netlify/functions/seasons'
  )

  const data = await readResponse(
    response,
    'Unable to load seasons.'
  )

  allSeasons.value =
    Array.isArray(data)
      ? data
      : []
}

/* ========================================
   LOAD CURRENT PRODUCT SEASONS
======================================== */

const loadCurrentProductSeasons =
  async () => {
    const response = await fetch(
      `/.netlify/functions/product-update-seasons?productId=${encodeURIComponent(
        props.productId
      )}`
    )

    const data = await readResponse(
      response,
      'Unable to load product seasons.'
    )

    const currentIds =
      data.map(
        (season) =>
          Number(season.id)
      )

    selectedSeasonIds.value = [
      ...currentIds
    ]

    originalSeasonIds.value = [
      ...currentIds
    ]

    newSeasons.value = []
    deleteSeasons.value = []
  }

/* ========================================
   LOAD SEASON EDITOR
======================================== */

const loadSeasonEditor = async () => {
  isLoadingSeasons.value = true
  seasonsMessage.value = ''

  try {
    await Promise.all([
      loadAllSeasons(),
      loadCurrentProductSeasons()
    ])
  } catch (error) {
    console.error(
      'Unable to load season editor:',
      error
    )

    seasonsMessage.value =
      error.message
  } finally {
    isLoadingSeasons.value = false
  }
}

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

    const data = await readResponse(
      response,
      'Unable to load product.'
    )

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

    editableAmazonLink.value =
      data.amazon_link ?? ''

    await Promise.all([
      loadBrandEditor(),
      loadSeasonEditor()
    ])
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
          'Content-Type':
            'application/json'
        },

        body: JSON.stringify({
          productId:
            props.productId,

          itemNumber
        })
      }
    )

    const data = await readResponse(
      response,
      'Unable to update item number.'
    )

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
          'Content-Type':
            'application/json'
        },

        body: JSON.stringify({
          productId:
            props.productId,

          name
        })
      }
    )

    const data = await readResponse(
      response,
      'Unable to update product name.'
    )

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
    nameMessage.value =
      error.message
  } finally {
    isSavingName.value = false
  }
}

/* ========================================
   SAVE PRODUCT DESCRIPTION
======================================== */

const saveProductDescription =
  async () => {
    descriptionMessage.value = ''

    isSavingDescription.value = true

    try {
      const response = await fetch(
        '/.netlify/functions/product-description-update',
        {
          method: 'PATCH',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            productId:
              props.productId,

            description:
              editableProductDescription.value
          })
        }
      )

      const data = await readResponse(
        response,
        'Unable to update product description.'
      )

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
      descriptionMessage.value =
        error.message
    } finally {
      isSavingDescription.value = false
    }
  }

/* ========================================
   SAVE AMAZON LINK
======================================== */

const saveAmazonLink = async () => {
  amazonLinkMessage.value = ''

  isSavingAmazonLink.value = true

  try {
    const response = await fetch(
      '/.netlify/functions/product-amazon-link-update',
      {
        method: 'PATCH',

        headers: {
          'Content-Type':
            'application/json'
        },

        body: JSON.stringify({
          productId:
            props.productId,

          amazonLink:
            editableAmazonLink.value
        })
      }
    )

    const data = await readResponse(
      response,
      'Unable to update Amazon link.'
    )

    editableAmazonLink.value =
      data.product.amazon_link ?? ''

    if (product.value) {
      product.value.amazon_link =
        data.product.amazon_link ?? ''
    }

    amazonLinkMessage.value =
      data.message ||
      'Amazon link updated successfully.'
  } catch (error) {
    amazonLinkMessage.value =
      error.message
  } finally {
    isSavingAmazonLink.value = false
  }
}

/* ========================================
   BRAND DROPDOWN
======================================== */

const toggleBrandDropdown = () => {
  isBrandDropdownOpen.value =
    !isBrandDropdownOpen.value
}

/* ========================================
   BRAND CHANGE
======================================== */

const handleBrandChange = (
  brandId,
  checked
) => {
  const id = Number(brandId)

  const wasOriginallySelected =
    originalBrandIds.value.includes(id)

  if (checked) {
    if (
      !selectedBrandIds.value.includes(id)
    ) {
      selectedBrandIds.value.push(id)
    }

    if (
      !wasOriginallySelected &&
      !newBrands.value.includes(id)
    ) {
      newBrands.value.push(id)
    }

    deleteBrands.value =
      deleteBrands.value.filter(
        (brandId) =>
          brandId !== id
      )

    return
  }

  selectedBrandIds.value =
    selectedBrandIds.value.filter(
      (brandId) =>
        brandId !== id
    )

  if (
    wasOriginallySelected &&
    !deleteBrands.value.includes(id)
  ) {
    deleteBrands.value.push(id)
  }

  newBrands.value =
    newBrands.value.filter(
      (brandId) =>
        brandId !== id
    )
}

const isBrandSelected = (
  brandId
) => {
  return selectedBrandIds.value.includes(
    Number(brandId)
  )
}

/* ========================================
   SAVE BRANDS
======================================== */

const saveBrands = async () => {
  brandsMessage.value = ''

  if (
    newBrands.value.length === 0 &&
    deleteBrands.value.length === 0
  ) {
    brandsMessage.value =
      'No brand changes to save.'

    return
  }

  isSavingBrands.value = true

  try {
    if (
      deleteBrands.value.length > 0
    ) {
      const deleteResponse =
        await fetch(
          '/.netlify/functions/product-update-brands',
          {
            method: 'DELETE',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              productId:
                props.productId,

              brandIds:
                deleteBrands.value
            })
          }
        )

      await readResponse(
        deleteResponse,
        'Unable to remove brands.'
      )
    }

    if (
      newBrands.value.length > 0
    ) {
      const postResponse =
        await fetch(
          '/.netlify/functions/product-update-brands',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              productId:
                props.productId,

              brandIds:
                newBrands.value
            })
          }
        )

      await readResponse(
        postResponse,
        'Unable to add brands.'
      )
    }

    await loadCurrentProductBrands()

    brandsMessage.value =
      'Brands updated successfully.'

    isBrandDropdownOpen.value = false
  } catch (error) {
    console.error(
      'Unable to update product brands:',
      error
    )

    try {
      await loadCurrentProductBrands()
    } catch (reloadError) {
      console.error(
        'Unable to reload product brands:',
        reloadError
      )
    }

    brandsMessage.value =
      error.message
  } finally {
    isSavingBrands.value = false
  }
}

/* ========================================
   SEASON DROPDOWN
======================================== */

const toggleSeasonDropdown = () => {
  isSeasonDropdownOpen.value =
    !isSeasonDropdownOpen.value
}

/* ========================================
   SEASON CHANGE
======================================== */

const handleSeasonChange = (
  seasonId,
  checked
) => {
  const id = Number(seasonId)

  const wasOriginallySelected =
    originalSeasonIds.value.includes(id)

  if (checked) {
    if (
      !selectedSeasonIds.value.includes(id)
    ) {
      selectedSeasonIds.value.push(id)
    }

    if (
      !wasOriginallySelected &&
      !newSeasons.value.includes(id)
    ) {
      newSeasons.value.push(id)
    }

    deleteSeasons.value =
      deleteSeasons.value.filter(
        (seasonId) =>
          seasonId !== id
      )

    return
  }

  selectedSeasonIds.value =
    selectedSeasonIds.value.filter(
      (seasonId) =>
        seasonId !== id
    )

  if (
    wasOriginallySelected &&
    !deleteSeasons.value.includes(id)
  ) {
    deleteSeasons.value.push(id)
  }

  newSeasons.value =
    newSeasons.value.filter(
      (seasonId) =>
        seasonId !== id
    )
}

const isSeasonSelected = (
  seasonId
) => {
  return selectedSeasonIds.value.includes(
    Number(seasonId)
  )
}

/* ========================================
   SAVE SEASONS
======================================== */

const saveSeasons = async () => {
  seasonsMessage.value = ''

  if (
    newSeasons.value.length === 0 &&
    deleteSeasons.value.length === 0
  ) {
    seasonsMessage.value =
      'No season changes to save.'

    return
  }

  isSavingSeasons.value = true

  try {

    /* REMOVE SEASONS */

    if (
      deleteSeasons.value.length > 0
    ) {
      const deleteResponse =
        await fetch(
          '/.netlify/functions/product-update-seasons',
          {
            method: 'DELETE',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              productId:
                props.productId,

              seasonIds:
                deleteSeasons.value
            })
          }
        )

      await readResponse(
        deleteResponse,
        'Unable to remove seasons.'
      )
    }

    /* ADD SEASONS */

    if (
      newSeasons.value.length > 0
    ) {
      const postResponse =
        await fetch(
          '/.netlify/functions/product-update-seasons',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              productId:
                props.productId,

              seasonIds:
                newSeasons.value
            })
          }
        )

      await readResponse(
        postResponse,
        'Unable to add seasons.'
      )
    }

    await loadCurrentProductSeasons()

    seasonsMessage.value =
      'Seasons updated successfully.'

    isSeasonDropdownOpen.value = false
  } catch (error) {
    console.error(
      'Unable to update product seasons:',
      error
    )

    try {
      await loadCurrentProductSeasons()
    } catch (reloadError) {
      console.error(
        'Unable to reload product seasons:',
        reloadError
      )
    }

    seasonsMessage.value =
      error.message
  } finally {
    isSavingSeasons.value = false
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
    isBrandDropdownOpen.value = false
    isSeasonDropdownOpen.value = false

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

      <!-- ========================================
           AMAZON LINK
      ========================================= -->

      <div class="product-field-card">
        <div class="field-heading">
          Amazon Link
        </div>

        <div class="field-editor">
          <input
            v-model="editableAmazonLink"
            type="url"
            class="field-input"
            placeholder="https://www.amazon.com/..."
          >

          <button
            type="button"
            class="save-button"
            :disabled="isSavingAmazonLink"
            @click="saveAmazonLink"
          >
            {{
              isSavingAmazonLink
                ? 'Saving...'
                : 'Save'
            }}
          </button>
        </div>

        <p
          v-if="amazonLinkMessage"
          class="field-message"
        >
          {{ amazonLinkMessage }}
        </p>
      </div>

      <!-- ========================================
           BRANDS
      ========================================= -->

      <div class="product-field-card">
        <div class="field-heading">
          Brands
        </div>

        <p
          v-if="isLoadingBrands"
          class="brand-loading"
        >
          Loading brands...
        </p>

        <template v-else>

          <div class="brand-editor">

            <div class="brand-dropdown">

              <button
                type="button"
                class="brand-dropdown-button"
                @click="toggleBrandDropdown"
              >
                <span>
                  {{
                    selectedBrandIds.length
                  }}
                  brand{{
                    selectedBrandIds.length === 1
                      ? ''
                      : 's'
                  }}
                  selected
                </span>

                <span
                  class="brand-dropdown-arrow"
                  :class="{
                    open:
                      isBrandDropdownOpen
                  }"
                >
                  ▼
                </span>
              </button>

              <div
                v-if="isBrandDropdownOpen"
                class="brand-dropdown-menu"
              >
                <label
                  v-for="brand in allBrands"
                  :key="brand.id"
                  class="brand-option"
                >
                  <input
                    type="checkbox"
                    :checked="
                      isBrandSelected(
                        brand.id
                      )
                    "
                    @change="
                      handleBrandChange(
                        brand.id,
                        $event.target.checked
                      )
                    "
                  >

                  <span>
                    {{ brand.name }}
                  </span>
                </label>

                <p
                  v-if="
                    allBrands.length === 0
                  "
                  class="brand-empty"
                >
                  No brands available.
                </p>
              </div>

            </div>

            <button
              type="button"
              class="save-button"
              :disabled="isSavingBrands"
              @click="saveBrands"
            >
              {{
                isSavingBrands
                  ? 'Saving...'
                  : 'Save'
              }}
            </button>

          </div>

          <div
            v-if="
              selectedBrandIds.length > 0
            "
            class="selected-brand-list"
          >
            <span
              v-for="brand in allBrands.filter(
                (brand) =>
                  selectedBrandIds.includes(
                    Number(brand.id)
                  )
              )"
              :key="brand.id"
              class="selected-brand-pill"
            >
              {{ brand.name }}
            </span>
          </div>

        </template>

        <p
          v-if="brandsMessage"
          class="field-message"
        >
          {{ brandsMessage }}
        </p>
      </div>

      <!-- ========================================
           SEASONS
      ========================================= -->

      <div class="product-field-card">
        <div class="field-heading">
          Seasons
        </div>

        <p
          v-if="isLoadingSeasons"
          class="brand-loading"
        >
          Loading seasons...
        </p>

        <template v-else>

          <div class="brand-editor">

            <div class="brand-dropdown">

              <button
                type="button"
                class="brand-dropdown-button"
                @click="toggleSeasonDropdown"
              >
                <span>
                  {{
                    selectedSeasonIds.length
                  }}
                  season{{
                    selectedSeasonIds.length === 1
                      ? ''
                      : 's'
                  }}
                  selected
                </span>

                <span
                  class="brand-dropdown-arrow"
                  :class="{
                    open:
                      isSeasonDropdownOpen
                  }"
                >
                  ▼
                </span>
              </button>

              <div
                v-if="isSeasonDropdownOpen"
                class="brand-dropdown-menu"
              >
                <label
                  v-for="season in allSeasons"
                  :key="season.id"
                  class="brand-option"
                >
                  <input
                    type="checkbox"
                    :checked="
                      isSeasonSelected(
                        season.id
                      )
                    "
                    @change="
                      handleSeasonChange(
                        season.id,
                        $event.target.checked
                      )
                    "
                  >

                  <span>
                    {{ season.name }}
                  </span>
                </label>

                <p
                  v-if="
                    allSeasons.length === 0
                  "
                  class="brand-empty"
                >
                  No seasons available.
                </p>
              </div>

            </div>

            <button
              type="button"
              class="save-button"
              :disabled="isSavingSeasons"
              @click="saveSeasons"
            >
              {{
                isSavingSeasons
                  ? 'Saving...'
                  : 'Save'
              }}
            </button>

          </div>

          <div
            v-if="
              selectedSeasonIds.length > 0
            "
            class="selected-brand-list"
          >
            <span
              v-for="season in allSeasons.filter(
                (season) =>
                  selectedSeasonIds.includes(
                    Number(season.id)
                  )
              )"
              :key="season.id"
              class="selected-brand-pill"
            >
              {{ season.name }}
            </span>
          </div>

        </template>

        <p
          v-if="seasonsMessage"
          class="field-message"
        >
          {{ seasonsMessage }}
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
   BRANDS
======================================== */

.brand-editor {
  display: flex;
  align-items: flex-start;

  gap: 0.75rem;
}

.brand-dropdown {
  position: relative;

  min-width: 0;
  flex: 1;
}

.brand-dropdown-button {
  width: 100%;

  padding: 0.75rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: white;

  color: #333;

  border: 1px solid #ccc;
  border-radius: 6px;

  font: inherit;
  text-align: left;

  cursor: pointer;
}

.brand-dropdown-button:hover {
  border-color: #703795;
}

.brand-dropdown-arrow {
  margin-left: 1rem;

  color: #703795;

  font-size: 0.75rem;

  transition: transform 0.2s ease;
}

.brand-dropdown-arrow.open {
  transform: rotate(180deg);
}

.brand-dropdown-menu {
  position: absolute;
  top: calc(100% + 0.35rem);
  left: 0;

  width: 100%;
  max-height: 250px;

  overflow-y: auto;

  padding: 0.4rem;

  background: white;

  border: 1px solid #ccc;
  border-radius: 6px;

  box-sizing: border-box;

  box-shadow:
    0 6px 18px
    rgba(0, 0, 0, 0.12);

  z-index: 20;
}

.brand-option {
  padding: 0.65rem;

  display: flex;
  align-items: center;

  gap: 0.6rem;

  border-radius: 5px;

  cursor: pointer;
}

.brand-option:hover {
  background: #f5eff8;
}

.brand-option input {
  width: 17px;
  height: 17px;

  accent-color: #703795;

  cursor: pointer;
}

.selected-brand-list {
  margin-top: 0.8rem;

  display: flex;
  flex-wrap: wrap;

  gap: 0.45rem;
}

.selected-brand-pill {
  padding: 0.35rem 0.65rem;

  background: #f5eff8;

  color: #703795;

  border-radius: 999px;

  font-size: 0.85rem;
  font-weight: 500;
}

.brand-loading,
.brand-empty {
  margin: 0;

  color: #777;

  font-size: 0.9rem;
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
  .description-editor,
  .brand-editor {
    flex-direction: column;
    align-items: stretch;
  }

  .save-button {
    width: 100%;
  }
}
</style>