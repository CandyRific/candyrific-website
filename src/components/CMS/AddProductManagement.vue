<script setup>
import {
  onBeforeUnmount,
  onMounted,
  ref
} from 'vue'

/* ========================================
   PRODUCT STATE
======================================== */

const productNumber = ref('')
const productName = ref('')
const productDescription = ref('')
const amazonLink = ref('')

/* ========================================
   IMAGE STATE
======================================== */

const productImages = ref([])

const draggedImageIndex = ref(null)
const dragOverImageIndex = ref(null)

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
  const files = Array.from(
    event.target.files || []
  )

  for (const file of files) {
    productImages.value.push({
      id: crypto.randomUUID(),
      file,
      previewUrl:
        URL.createObjectURL(file)
    })
  }

  /*
   * Reset the native input.
   *
   * This lets the user select the same
   * file again if they remove it first.
   */
  event.target.value = ''
}

/* ========================================
   REMOVE IMAGE
======================================== */

const removeImage = (index) => {
  const image =
    productImages.value[index]

  if (image?.previewUrl) {
    URL.revokeObjectURL(
      image.previewUrl
    )
  }

  productImages.value.splice(
    index,
    1
  )

  draggedImageIndex.value = null
  dragOverImageIndex.value = null
}

/* ========================================
   DRAG START
======================================== */

const handleDragStart = (
  event,
  index
) => {
  draggedImageIndex.value = index

  event.dataTransfer.effectAllowed =
    'move'

  /*
   * Firefox requires data to be set
   * for draggable elements.
   */
  event.dataTransfer.setData(
    'text/plain',
    String(index)
  )
}

/* ========================================
   DRAG ENTER
======================================== */

const handleDragEnter = (
  index
) => {
  if (
    draggedImageIndex.value === null
  ) {
    return
  }

  dragOverImageIndex.value = index
}

/* ========================================
   DRAG OVER
======================================== */

const handleDragOver = (event) => {
  event.preventDefault()

  event.dataTransfer.dropEffect =
    'move'
}

/* ========================================
   DROP IMAGE
======================================== */

const handleDrop = (
  event,
  dropIndex
) => {
  event.preventDefault()

  const fromIndex =
    draggedImageIndex.value

  if (
    fromIndex === null ||
    fromIndex === dropIndex
  ) {
    resetDragState()
    return
  }

  const reorderedImages = [
    ...productImages.value
  ]

  const [movedImage] =
    reorderedImages.splice(
      fromIndex,
      1
    )

  reorderedImages.splice(
    dropIndex,
    0,
    movedImage
  )

  productImages.value =
    reorderedImages

  resetDragState()
}

/* ========================================
   DRAG END
======================================== */

const handleDragEnd = () => {
  resetDragState()
}

/* ========================================
   RESET DRAG STATE
======================================== */

const resetDragState = () => {
  draggedImageIndex.value = null
  dragOverImageIndex.value = null
}

/* ========================================
   CLEAR IMAGES
======================================== */

const clearProductImages = () => {
  for (
    const image of productImages.value
  ) {
    if (image.previewUrl) {
      URL.revokeObjectURL(
        image.previewUrl
      )
    }
  }

  productImages.value = []

  resetDragState()
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
    const formData =
      new FormData()

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

       Images are appended in the same order
       they currently appear in productImages.
    ======================================== */

    for (
      const image of
      productImages.value
    ) {
      formData.append(
        'image',
        image.file
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
      data =
        JSON.parse(responseText)
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
    amazonLink.value = ''

    selectedBrandIds.value = []
    selectedSeasonIds.value = []

    clearProductImages()
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

/* ========================================
   CLEANUP PREVIEW URLS
======================================== */

onBeforeUnmount(() => {
  clearProductImages()
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
        Hold Ctrl on Windows or Cmd on Mac
        to select multiple seasons.
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
        Hold Ctrl on Windows or Cmd on Mac
        to select multiple brands.
      </p>
    </div>

    <!-- ========================================
         IMAGES
    ========================================= -->

    <div class="form-group image-form-group">

      <label for="product-image">
        Product Images
      </label>

      <p class="image-help-text">
        Add one or more images, then drag
        them into the order you want.
      </p>

      <label
        for="product-image"
        class="image-upload-area"
      >
        <span class="upload-icon">
          +
        </span>

        <span class="upload-title">
          Add Product Images
        </span>

        <span class="upload-subtitle">
          Select one or multiple image files
        </span>
      </label>

      <input
        id="product-image"
        type="file"
        accept="image/*"
        multiple
        class="image-file-input"
        @change="handleImageChange"
      >

      <!-- ========================================
           IMAGE PREVIEW / SORTING
      ========================================= -->

      <div
        v-if="productImages.length > 0"
        class="selected-images"
      >

        <div class="image-order-header">
          <span>
            Image Display Order
          </span>

          <span class="image-count">
            {{ productImages.length }}
            image{{
              productImages.length === 1
                ? ''
                : 's'
            }}
          </span>
        </div>

        <div class="image-sort-grid">

          <div
            v-for="(
              image,
              index
            ) in productImages"
            :key="image.id"
            class="sortable-image-card"
            :class="{
              dragging:
                draggedImageIndex === index,

              'drag-over':
                dragOverImageIndex === index &&
                draggedImageIndex !== index
            }"
            draggable="true"
            @dragstart="
              handleDragStart(
                $event,
                index
              )
            "
            @dragenter="
              handleDragEnter(
                index
              )
            "
            @dragover="
              handleDragOver(
                $event
              )
            "
            @drop="
              handleDrop(
                $event,
                index
              )
            "
            @dragend="
              handleDragEnd
            "
          >

            <!-- DRAG HANDLE -->

            <div
              class="drag-handle"
              title="Drag to reorder"
            >
              <span>⋮⋮</span>
            </div>

            <!-- ORDER -->

            <div class="image-order-number">
              {{ index + 1 }}
            </div>

            <!-- IMAGE -->

            <div class="image-preview">
              <img
                :src="image.previewUrl"
                :alt="image.file.name"
              >
            </div>

            <!-- FILE INFO -->

            <div class="image-info">
              <div class="image-file-name">
                {{ image.file.name }}
              </div>

              <div class="image-position">
                Display position
                {{ index + 1 }}
              </div>
            </div>

            <!-- REMOVE -->

            <button
              type="button"
              class="remove-image-button"
              @click="removeImage(index)"
            >
              Remove
            </button>

          </div>

        </div>

      </div>

    </div>

    <!-- ========================================
         SUBMIT
    ========================================= -->

    <button
      type="submit"
      class="add-product-button"
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

/* ========================================
   FORM GROUPS
======================================== */

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

.form-group select {
  background: white;

  color: black;
}

/* ========================================
   BRANDS / SEASONS
======================================== */

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

/* ========================================
   IMAGE AREA
======================================== */

.image-form-group {
  margin-top: 1.5rem;
}

.image-help-text {
  margin:
    0
    0
    0.5rem;

  color: #666;

  font-size: 0.9rem;
}

/* ========================================
   IMAGE UPLOAD
======================================== */

.image-file-input {
  position: absolute;

  width: 1px;
  height: 1px;

  overflow: hidden;

  opacity: 0;

  pointer-events: none;
}

.image-upload-area {
  min-height: 115px;

  padding: 1.25rem;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  gap: 0.25rem;

  background: #faf7fc;

  border: 2px dashed #b99acb;
  border-radius: 8px;

  box-sizing: border-box;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.image-upload-area:hover {
  background: #f5eff8;

  border-color: #703795;
}

.upload-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #703795;

  color: white;

  border-radius: 50%;

  font-size: 1.45rem;
  line-height: 1;
}

.upload-title {
  margin-top: 0.2rem;

  color: #703795;

  font-weight: 600;
}

.upload-subtitle {
  color: #777;

  font-size: 0.82rem;
}

/* ========================================
   SELECTED IMAGES
======================================== */

.selected-images {
  margin-top: 1rem;
}

.image-order-header {
  margin-bottom: 0.7rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;

  color: #444;

  font-weight: 600;
}

.image-count {
  color: #777;

  font-size: 0.82rem;
  font-weight: 400;
}

/* ========================================
   SORTABLE IMAGE GRID
======================================== */

.image-sort-grid {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fill,
      minmax(170px, 1fr)
    );

  gap: 0.9rem;
}

.sortable-image-card {
  position: relative;

  min-width: 0;

  padding: 0.65rem;

  background: #fafafa;

  border: 2px solid transparent;
  border-radius: 8px;

  box-shadow:
    0 2px 8px
    rgba(0, 0, 0, 0.06);

  cursor: grab;

  transition:
    opacity 0.15s ease,
    transform 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.sortable-image-card:hover {
  box-shadow:
    0 4px 12px
    rgba(0, 0, 0, 0.1);
}

.sortable-image-card.dragging {
  opacity: 0.35;

  cursor: grabbing;
}

.sortable-image-card.drag-over {
  border-color: #703795;

  transform: scale(1.02);

  box-shadow:
    0 6px 18px
    rgba(112, 55, 149, 0.18);
}

/* ========================================
   DRAG HANDLE
======================================== */

.drag-handle {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;

  width: 28px;
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    rgba(255, 255, 255, 0.92);

  color: #703795;

  border-radius: 5px;

  font-size: 1rem;
  font-weight: 700;

  z-index: 2;
}

/* ========================================
   ORDER NUMBER
======================================== */

.image-order-number {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;

  width: 28px;
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #703795;

  color: white;

  border-radius: 50%;

  font-size: 0.8rem;
  font-weight: 600;

  z-index: 2;
}

/* ========================================
   IMAGE PREVIEW
======================================== */

.image-preview {
  width: 100%;
  aspect-ratio: 1 / 1;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  background: white;

  border-radius: 6px;
}

.image-preview img {
  width: 100%;
  height: 100%;

  object-fit: contain;

  pointer-events: none;

  user-select: none;
}

/* ========================================
   IMAGE INFO
======================================== */

.image-info {
  margin-top: 0.55rem;

  min-width: 0;
}

.image-file-name {
  overflow: hidden;

  color: #444;

  font-size: 0.8rem;
  font-weight: 500;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-position {
  margin-top: 0.15rem;

  color: #888;

  font-size: 0.72rem;
}

/* ========================================
   REMOVE IMAGE
======================================== */

.remove-image-button {
  width: 100%;

  margin-top: 0.55rem;
  padding: 0.5rem;

  background: white;

  color: #c62828;

  border: 1px solid #c62828;
  border-radius: 5px;

  font: inherit;
  font-size: 0.82rem;

  cursor: pointer;
}

.remove-image-button:hover {
  background: #fff1f1;
}

/* ========================================
   ADD PRODUCT BUTTON
======================================== */

.add-product-button {
  padding: 0.75rem 1.25rem;

  background: #703795;

  color: white;

  border: none;
  border-radius: 6px;

  font: inherit;
  font-weight: 500;

  cursor: pointer;
}

.add-product-button:hover {
  opacity: 0.9;
}

.add-product-button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* ========================================
   MESSAGE
======================================== */

.form-message {
  margin-top: 1rem;

  color: #703795;
}

/* ========================================
   MOBILE
======================================== */

@media (max-width: 600px) {
  .image-sort-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }
}

@media (max-width: 400px) {
  .image-sort-grid {
    grid-template-columns: 1fr;
  }
}
</style>