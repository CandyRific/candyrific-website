<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  productId: {
    type: [Number, String],
    required: true
  }
})

/* ========================================
   IMAGE STATE
======================================== */

const existingImages = ref([])
const originalImageSnapshot = ref([])
const draggedImageId = ref(null)

// The position in existingImages is the proposed display order.
const remainingImages = computed(() =>
  existingImages.value.filter(
    (image) => !deleteImageIds.value.includes(Number(image.id))
  )
)

const hasOrderChanges = computed(() => {
  const remaining = remainingImages.value
  return remaining.some((image, index) => {
    const original = originalImageSnapshot.value.find(
      (item) => Number(item.id) === Number(image.id)
    )
    return !original || Number(original.display_order) !== index + 1
  })
})


const deleteImageIds = ref([])

const newImages = ref([])
const newImagePreviews = ref([])

const imageInput = ref(null)

const isLoadingImages = ref(false)
const isSavingImages = ref(false)
const imagesMessage = ref('')

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
   PRODUCT IMAGE URL
======================================== */

const getProductImageUrl = (
  imageKey
) => {
  return (
    '/.netlify/functions/product-image?key=' +
    encodeURIComponent(imageKey)
  )
}

/* ========================================
   LOAD PRODUCT IMAGES
======================================== */

const loadProductImages = async () => {
  isLoadingImages.value = true
  imagesMessage.value = ''

  try {
    const response = await fetch(
      `/.netlify/functions/product-images-update?productId=${encodeURIComponent(
        props.productId
      )}`
    )

    const data = await readResponse(
      response,
      'Unable to load product images.'
    )

    existingImages.value = Array.isArray(data) ? data : []
    originalImageSnapshot.value = existingImages.value.map(
      (image) => ({ ...image })
    )
    draggedImageId.value = null

    deleteImageIds.value = []

    clearNewImages()
  } catch (error) {
    console.error(
      'Unable to load product images:',
      error
    )

    imagesMessage.value =
      error.message
  } finally {
    isLoadingImages.value = false
  }
}

/* ========================================
   CLEAR NEW IMAGE PREVIEWS
======================================== */

const clearNewImages = () => {
  for (
    const preview
    of newImagePreviews.value
  ) {
    URL.revokeObjectURL(
      preview.url
    )
  }

  newImages.value = []
  newImagePreviews.value = []

  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

/* ========================================
   SELECT NEW IMAGES
======================================== */

const handleImageSelection = (
  event
) => {
  const files =
    Array.from(
      event.target.files || []
    )

  for (const file of files) {
    newImages.value.push(file)

    newImagePreviews.value.push({
      name: file.name,
      url:
        URL.createObjectURL(file)
    })
  }

  /*
   * Clear native file input so the same
   * file could be selected again later.
   */
  event.target.value = ''
}

/* ========================================
   REMOVE NEW IMAGE BEFORE SAVE
======================================== */

const removeNewImage = (
  index
) => {
  const preview =
    newImagePreviews.value[index]

  if (preview) {
    URL.revokeObjectURL(
      preview.url
    )
  }

  newImages.value.splice(
    index,
    1
  )

  newImagePreviews.value.splice(
    index,
    1
  )
}

/* ========================================
   MARK EXISTING IMAGE FOR DELETE
======================================== */

const toggleExistingImageDelete = (
  imageId
) => {
  const id = Number(imageId)

  if (
    deleteImageIds.value.includes(id)
  ) {
    deleteImageIds.value =
      deleteImageIds.value.filter(
        (existingId) =>
          existingId !== id
      )

    return
  }

  deleteImageIds.value.push(id)
}

/* ========================================
   CHECK IMAGE DELETE STATE
======================================== */

const isImageMarkedForDelete = (
  imageId
) => {
  return deleteImageIds.value.includes(
    Number(imageId)
  )
}

/* ========================================
   REORDER EXISTING IMAGES
======================================== */

const onImageDragStart = (event, imageId) => {
  if (isSavingImages.value || isImageMarkedForDelete(imageId)) {
    event.preventDefault()
    return
  }

  draggedImageId.value = Number(imageId)
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', String(imageId))
}

const onImageDrop = (event, targetId) => {
  event.preventDefault()

  const sourceId = draggedImageId.value
  draggedImageId.value = null

  if (
    sourceId === null ||
    sourceId === Number(targetId) ||
    isImageMarkedForDelete(targetId)
  ) return

  const images = [...existingImages.value]
  const from = images.findIndex((image) => Number(image.id) === sourceId)
  const to = images.findIndex((image) => Number(image.id) === Number(targetId))

  if (from < 0 || to < 0) return

  const [moved] = images.splice(from, 1)
  images.splice(to, 0, moved)
  existingImages.value = images
}

const moveImage = (imageId, direction) => {
  if (isSavingImages.value || isImageMarkedForDelete(imageId)) return

  const ordered = remainingImages.value
  const index = ordered.findIndex((image) => Number(image.id) === Number(imageId))
  const swapIndex = index + direction

  if (index < 0 || swapIndex < 0 || swapIndex >= ordered.length) return

  const firstIndex = existingImages.value.findIndex(
    (image) => Number(image.id) === Number(ordered[index].id)
  )
  const secondIndex = existingImages.value.findIndex(
    (image) => Number(image.id) === Number(ordered[swapIndex].id)
  )
  const images = [...existingImages.value]
  ;[images[firstIndex], images[secondIndex]] = [images[secondIndex], images[firstIndex]]
  existingImages.value = images
}

/* ========================================
   SAVE IMAGES
======================================== */

const saveImages = async () => {
  imagesMessage.value = ''

  if (
    deleteImageIds.value.length === 0 &&
    newImages.value.length === 0 &&
    !hasOrderChanges.value
  ) {
    imagesMessage.value = 'No image changes to save.'
    return
  }

  isSavingImages.value = true

  try {
    // Keep the UI order, excluding images marked for deletion.
    const orderedIds = remainingImages.value.map((image) => Number(image.id))

    if (deleteImageIds.value.length > 0) {
      const response = await fetch('/.netlify/functions/product-images-update', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: props.productId,
          imageIds: deleteImageIds.value
        })
      })
      await readResponse(response, 'Unable to remove images.')
    }

    if (newImages.value.length > 0) {
      const formData = new FormData()
      formData.append('productId', props.productId)
      for (const image of newImages.value) {
        formData.append('images', image)
      }

      const response = await fetch('/.netlify/functions/product-images-update', {
        method: 'POST',
        body: formData
      })
      const data = await readResponse(response, 'Unable to add images.')

      // New images receive their IDs from the server and go after existing ones.
      const currentIds = new Set(orderedIds)
      for (const image of data.images || []) {
        const id = Number(image.id)
        if (!currentIds.has(id)) {
          orderedIds.push(id)
          currentIds.add(id)
        }
      }
    }

    // Always normalize positions to 1..N after a save, even if old values were 0.
    const patchResponse = await fetch('/.netlify/functions/product-images-update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: props.productId,
        imageIds: orderedIds
      })
    })
    await readResponse(patchResponse, 'Unable to update image order.')

    await loadProductImages()
    imagesMessage.value = 'Images updated successfully.'
  } catch (error) {
    console.error('Unable to update product images:', error)
    // A DELETE or POST may already have succeeded; reload real persisted state.
    await loadProductImages()
    imagesMessage.value = error.message
  } finally {
    isSavingImages.value = false
  }
}

/* ========================================
   WATCH PRODUCT / CLEANUP
======================================== */
watch(
  () => props.productId,
  () => {
    clearNewImages()
    existingImages.value = []
    originalImageSnapshot.value = []
    deleteImageIds.value = []
    loadProductImages()
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  clearNewImages()
})
</script>

<template>
      <div class="product-field-card">
        <div class="field-heading">
          Product Images
        </div>

        <p class="image-help-text">
          Drag existing images into the order you want, or use the arrow
          buttons. The first image becomes the main image when you save.
          You can also add or remove images.
        </p>

        <p
          v-if="isLoadingImages"
          class="association-loading"
        >
          Loading images...
        </p>

        <template v-else>

          <!-- EXISTING IMAGES -->

          <div
            v-if="existingImages.length > 0"
            class="image-section"
          >
            <div class="image-section-title">
              Current Images — drag to rearrange
            </div>

            <div class="image-grid">
              <div
                v-for="image in existingImages"
                :key="image.id"
                class="image-card"
                :class="{
                  'marked-for-delete': isImageMarkedForDelete(image.id),
                  'is-dragging': draggedImageId === Number(image.id)
                }"
                :draggable="!isSavingImages && !isImageMarkedForDelete(image.id)"
                @dragstart="onImageDragStart($event, image.id)"
                @dragover.prevent
                @drop="onImageDrop($event, image.id)"
                @dragend="draggedImageId = null"
              >
                <div class="image-position">
                  <span>
                    {{ isImageMarkedForDelete(image.id)
                      ? 'Removing'
                      : `Position ${remainingImages.findIndex(item => Number(item.id) === Number(image.id)) + 1}` }}
                  </span>
                  <span v-if="!isImageMarkedForDelete(image.id) && remainingImages[0]?.id === image.id" class="main-image-label">Main image</span>
                </div>
                <div class="image-preview">
                  <img
                    :src="
                      getProductImageUrl(
                        image.image_key
                      )
                    "
                    alt="Product image"
                  >

                  <div
                    v-if="
                      isImageMarkedForDelete(
                        image.id
                      )
                    "
                    class="delete-overlay"
                  >
                    Will be removed
                  </div>
                </div>

                <div v-if="!isImageMarkedForDelete(image.id)" class="image-move-controls">
                  <button type="button" :disabled="isSavingImages || remainingImages[0]?.id === image.id" @click="moveImage(image.id, -1)" aria-label="Move image earlier">← Earlier</button>
                  <button type="button" :disabled="isSavingImages || remainingImages[remainingImages.length - 1]?.id === image.id" @click="moveImage(image.id, 1)" aria-label="Move image later">Later →</button>
                </div>
                <button
                  type="button"
                  class="image-delete-button"
                  :class="{
                    restore:
                      isImageMarkedForDelete(
                        image.id
                      )
                  }"
                  @click="
                    toggleExistingImageDelete(
                      image.id
                    )
                  "
                >
                  {{
                    isImageMarkedForDelete(
                      image.id
                    )
                      ? 'Keep Image'
                      : 'Remove'
                  }}
                </button>
              </div>
            </div>
          </div>

          <div
            v-else
            class="image-empty-state"
          >
            No product images are currently
            associated with this product.
          </div>

          <!-- NEW IMAGE UPLOAD -->

          <div class="image-upload-section">
            <div class="image-section-title">
              Add Images
            </div>

            <label
              class="image-upload-box"
              for="product-image-upload"
            >
              <span
                class="image-upload-icon"
                aria-hidden="true"
              >
                +
              </span>

              <span class="image-upload-title">
                Choose product images
              </span>

              <span class="image-upload-subtitle">
                Select one or multiple files
              </span>
            </label>

            <input
              id="product-image-upload"
              ref="imageInput"
              type="file"
              accept="image/*"
              multiple
              class="image-file-input"
              @change="handleImageSelection"
            >
          </div>

          <!-- NEW IMAGE PREVIEWS -->

          <div
            v-if="
              newImagePreviews.length > 0
            "
            class="image-section new-image-section"
          >
            <div class="image-section-title">
              New Images
            </div>

            <div class="image-grid">
              <div
                v-for="(
                  preview,
                  index
                ) in newImagePreviews"
                :key="preview.url"
                class="image-card new-image-card"
              >
                <div class="image-preview">
                  <img
                    :src="preview.url"
                    :alt="preview.name"
                  >

                  <span class="new-image-badge">
                    New
                  </span>
                </div>

                <div class="new-image-name">
                  {{ preview.name }}
                </div>

                <button
                  type="button"
                  class="image-delete-button"
                  @click="
                    removeNewImage(
                      index
                    )
                  "
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- IMAGE SAVE SUMMARY -->

          <div class="image-save-row">
            <div class="image-change-summary">
              <span
                v-if="
                  newImages.length > 0
                "
              >
                {{ newImages.length }}
                new
              </span>

              <span
                v-if="
                  deleteImageIds.length > 0
                "
              >
                {{ deleteImageIds.length }}
                to remove
              </span>

              <span v-if="hasOrderChanges">Image positions to save</span>

              <span
                v-if="
                  newImages.length === 0 &&
                  deleteImageIds.length === 0 &&
                  !hasOrderChanges
                "
              >
                No unsaved image changes
              </span>
            </div>

            <button
              type="button"
              class="save-button"
              :disabled="isSavingImages"
              @click="saveImages"
            >
              {{
                isSavingImages
                  ? 'Saving...'
                  : 'Save Images'
              }}
            </button>
          </div>

        </template>

        <p
          v-if="imagesMessage"
          class="field-message"
        >
          {{ imagesMessage }}
        </p>
      </div>
</template>

<style scoped>

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

.association-loading {
  margin: 0;
  color: #777;
  font-size: 0.9rem;
}

/* ========================================
   IMAGES
======================================== */

.image-help-text {
  margin:
    -0.2rem
    0
    1.25rem;

  color: #777;

  font-size: 0.9rem;
  line-height: 1.45;
}

.image-section {
  margin-bottom: 1.5rem;
}

.image-section-title {
  margin-bottom: 0.75rem;

  color: #444;

  font-size: 0.95rem;
  font-weight: 600;
}

.image-grid {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fill,
      minmax(150px, 1fr)
    );

  gap: 0.9rem;
}

.image-card {
  min-width: 0;

  padding: 0.6rem;

  background: #fafafa;

  border: 1px solid #ddd;
  border-radius: 8px;

  transition:
    opacity 0.2s ease,
    border-color 0.2s ease;
}

.image-card.marked-for-delete {
  opacity: 0.55;

  border-color: #c62828;
}

.image-preview {
  position: relative;

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
}

.delete-overlay {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0.5rem;

  background:
    rgba(198, 40, 40, 0.78);

  color: white;

  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
}

.image-delete-button {
  width: 100%;

  margin-top: 0.55rem;
  padding: 0.5rem;

  background: white;

  color: #c62828;

  border: 1px solid #c62828;
  border-radius: 5px;

  font: inherit;
  font-size: 0.85rem;
  font-weight: 500;

  cursor: pointer;
}

.image-delete-button:hover {
  background: #fff1f1;
}

.image-delete-button.restore {
  color: #703795;

  border-color: #703795;
}

.image-delete-button.restore:hover {
  background: #f5eff8;
}

/* ========================================
   IMAGE ORDER CONTROLS
======================================== */

.image-card:not(.marked-for-delete) { cursor: grab; }
.image-card.is-dragging { opacity: 0.45; }
.image-position { display: flex; justify-content: space-between; flex-wrap: wrap; gap: .35rem; margin-bottom: .55rem; color: #703795; font-size: .85rem; font-weight: 600; }
.main-image-label { color: #168047; }
.image-move-controls { display: flex; gap: .4rem; margin-top: .55rem; }
.image-move-controls button { flex: 1; min-width: 0; padding: .45rem .2rem; border: 1px solid #b99acb; border-radius: 5px; background: white; color: #703795; font: inherit; font-size: .78rem; cursor: pointer; }
.image-move-controls button:disabled { opacity: .35; cursor: not-allowed; }
.image-move-controls button:not(:disabled):hover { background: #f5eff8; }

/* ========================================
   IMAGE UPLOAD
======================================== */

.image-upload-section {
  margin-top: 1rem;
}

.image-file-input {
  position: absolute;

  width: 1px;
  height: 1px;

  overflow: hidden;

  opacity: 0;

  pointer-events: none;
}

.image-upload-box {
  min-height: 125px;

  padding: 1.25rem;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  gap: 0.3rem;

  background: #faf7fc;

  border: 2px dashed #b99acb;
  border-radius: 8px;

  box-sizing: border-box;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.image-upload-box:hover {
  background: #f5eff8;

  border-color: #703795;
}

.image-upload-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #703795;

  color: white;

  border-radius: 50%;

  font-size: 1.4rem;
  line-height: 1;
}

.image-upload-title {
  margin-top: 0.25rem;

  color: #703795;

  font-weight: 600;
}

.image-upload-subtitle {
  color: #777;

  font-size: 0.85rem;
}

/* ========================================
   NEW IMAGE
======================================== */

.new-image-section {
  margin-top: 1.4rem;
}

.new-image-card {
  border-color: #b99acb;
}

.new-image-badge {
  position: absolute;
  top: 0.45rem;
  right: 0.45rem;

  padding: 0.25rem 0.45rem;

  background: #703795;

  color: white;

  border-radius: 999px;

  font-size: 0.7rem;
  font-weight: 600;
}

.new-image-name {
  margin-top: 0.45rem;

  overflow: hidden;

  color: #666;

  font-size: 0.78rem;

  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ========================================
   IMAGE SAVE ROW
======================================== */

.image-save-row {
  margin-top: 1.4rem;
  padding-top: 1rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;

  border-top: 1px solid #eee;
}

.image-change-summary {
  display: flex;
  flex-wrap: wrap;

  gap: 0.45rem;

  color: #777;

  font-size: 0.85rem;
}

.image-change-summary span {
  padding: 0.3rem 0.55rem;

  background: #f4f4f4;

  border-radius: 999px;
}

.image-empty-state {
  margin-bottom: 1.25rem;
  padding: 1rem;

  background: #fafafa;

  color: #777;

  border: 1px dashed #ccc;
  border-radius: 6px;

  font-size: 0.9rem;
  text-align: center;
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


@media (max-width: 600px) {
  .save-button { width: 100%; }
  .image-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .image-save-row { align-items: stretch; flex-direction: column; }
}
@media (max-width: 400px) {
  .image-grid { grid-template-columns: 1fr; }
}
</style>
