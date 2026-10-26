
<template>
  <section class="carousel-management">
    <!-- HEADER -->
    <div class="management-header">
      <div>
        <span class="eyebrow">CONTENT MANAGEMENT</span>
        <h2>Homepage Carousel</h2>
        <p>
          Manage carousel slides, links, and images
          for desktop and mobile visitors.
        </p>
      </div>

      <div class="header-count">
        {{ items.length }}
        {{ items.length === 1 ? 'Slide' : 'Slides' }}
      </div>
    </div>

    <!-- GLOBAL MESSAGE -->
    <div
      v-if="pageMessage"
      class="feedback"
      :class="pageMessageType"
      role="status"
    >
      {{ pageMessage }}
    </div>

    <!-- ADD NEW ITEM -->
    <div class="add-panel">
      <div class="panel-heading">
        <div class="panel-icon">+</div>
        <div>
          <h3>Add Carousel Slide</h3>
          <p>
            Create a slide, then upload its images.
          </p>
        </div>
      </div>

      <form
        class="add-form"
        @submit.prevent="addItem"
      >
        <div class="field">
          <label for="new-carousel-link">
            Destination URL
            <span class="optional">(optional)</span>
          </label>

          <input
            id="new-carousel-link"
            v-model.trim="newHyperlink"
            type="url"
            placeholder="https://example.com"
            :disabled="isAdding"
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isAdding || isLoading"
        >
          {{ isAdding ? 'Adding...' : '+ Add Slide' }}
        </button>
      </form>
    </div>

    <!-- CAROUSEL LIST -->
    <div class="list-heading">
      <div>
        <h3>Carousel Slides</h3>
        <p>
          Drag slides to reorder, or use the arrow
          controls. Save positions when finished.
        </p>
      </div>

      <button
        v-if="hasOrderChanges"
        class="btn btn-primary"
        :disabled="isSavingOrder || isBusy"
        @click="saveOrder"
      >
        {{ isSavingOrder ? 'Saving...' : 'Save Positions' }}
      </button>
    </div>

    <!-- LOADING -->
    <div
      v-if="isLoading"
      class="empty-state"
    >
      <div class="loading-spinner"></div>
      <p>Loading carousel slides...</p>
    </div>

    <!-- EMPTY -->
    <div
      v-else-if="items.length === 0"
      class="empty-state"
    >
      <div class="empty-icon">▧</div>
      <h3>No Carousel Slides Yet</h3>
      <p>
        Add your first slide above to get started.
      </p>
    </div>

    <!-- ITEMS -->
    <div
      v-else
      class="carousel-list"
    >
      <article
        v-for="(item, index) in items"
        :key="item.id"
        class="carousel-item"
        :class="{
          dragging: draggedItemId === item.id,
          'drag-target':
            dragOverItemId === item.id &&
            draggedItemId !== item.id
        }"
        :draggable="!isBusy"
        @dragstart="handleDragStart($event, item.id)"
        @dragover.prevent="handleDragOver(item.id)"
        @drop.prevent="handleDrop(item.id)"
        @dragend="handleDragEnd"
      >
        <!-- ITEM HEADER -->
        <div class="item-header">
          <div class="item-identity">
            <span
              class="drag-handle"
              title="Drag to reorder"
              aria-hidden="true"
            >
              ⠿
            </span>

            <span class="position-number">
              {{ index + 1 }}
            </span>

            <div>
              <h4>Slide {{ index + 1 }}</h4>
              <span class="item-id">
                Item ID: {{ item.id }}
              </span>
            </div>
          </div>

          <div class="item-actions">
            <div class="order-controls">
              <button
                type="button"
                class="icon-button"
                aria-label="Move slide up"
                title="Move up"
                :disabled="index === 0 || isBusy"
                @click="moveItem(index, -1)"
              >
                ↑
              </button>

              <button
                type="button"
                class="icon-button"
                aria-label="Move slide down"
                title="Move down"
                :disabled="
                  index === items.length - 1 || isBusy
                "
                @click="moveItem(index, 1)"
              >
                ↓
              </button>
            </div>

            <button
              type="button"
              class="btn btn-danger-outline"
              :disabled="isBusy"
              @click="deleteItem(item)"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- IMAGE UPLOAD GRID -->
        <div class="image-grid">
          <div
            v-for="viewport in viewports"
            :key="viewport.id"
            class="image-panel"
          >
            <div class="image-panel-header">
              <div>
                <span class="viewport-name">
                  {{ viewport.name }}
                </span>

                <span class="viewport-description">
                  {{ viewport.description }}
                </span>
              </div>

              <span
                class="image-status"
                :class="{
                  ready: getImage(item, viewport.id)
                }"
              >
                {{
                  getImage(item, viewport.id)
                    ? 'Uploaded'
                    : 'Missing'
                }}
              </span>
            </div>

            <!-- PREVIEW -->
            <div class="image-preview">
              <img
                v-if="getImage(item, viewport.id)"
                :src="
                  imageUrl(
                    getImage(item, viewport.id).image_key
                  )
                "
                :alt="
                  `${viewport.name} image for slide ${index + 1}`
                "
                loading="lazy"
              />

              <div
                v-else
                class="image-placeholder"
              >
                <span class="placeholder-icon">▧</span>
                <span>
                  No {{ viewport.name.toLowerCase() }}
                  image
                </span>
              </div>
            </div>

            <!-- IMAGE ACTIONS -->
            <div class="image-actions">
              <label
                class="btn btn-secondary upload-button"
                :class="{
                  disabled: isItemBusy(item.id)
                }"
              >
                {{
                  isUploading(item.id, viewport.id)
                    ? 'Uploading...'
                    : getImage(item, viewport.id)
                      ? 'Replace Image'
                      : 'Upload Image'
                }}

                <input
                  type="file"
                  accept="image/webp,image/jpeg,image/png"
                  :disabled="isItemBusy(item.id)"
                  @change="
                    handleFileSelected(
                      $event,
                      item,
                      viewport.id
                    )
                  "
                />
              </label>

              <button
                v-if="getImage(item, viewport.id)"
                type="button"
                class="btn btn-text-danger"
                :disabled="isItemBusy(item.id)"
                @click="
                  deleteImage(
                    item,
                    getImage(item, viewport.id)
                  )
                "
              >
                Remove
              </button>
            </div>

            <p class="image-help">
              WebP, JPG, or PNG · Maximum 500 KB
            </p>
          </div>
        </div>

        <!-- HYPERLINK -->
        <div class="link-section">
          <div class="field">
            <label :for="`carousel-link-${item.id}`">
              Slide Destination URL
              <span class="optional">(optional)</span>
            </label>

            <div class="link-input-row">
              <input
                :id="`carousel-link-${item.id}`"
                v-model.trim="item.hyperlink"
                type="url"
                placeholder="https://example.com"
                :disabled="isItemBusy(item.id)"
              />

              <button
                type="button"
                class="btn btn-primary"
                :disabled="
                  isItemBusy(item.id) ||
                  !hasLinkChanged(item)
                "
                @click="saveHyperlink(item)"
              >
                {{
                  isSavingLink(item.id)
                    ? 'Saving...'
                    : 'Save Link'
                }}
              </button>
            </div>

            <p class="field-hint">
              Leave blank if the slide should not
              redirect anywhere.
            </p>
          </div>
        </div>

        <!-- ITEM FEEDBACK -->
        <div
          v-if="itemMessages[item.id]"
          class="feedback item-feedback"
          :class="itemMessages[item.id].type"
          role="status"
        >
          {{ itemMessages[item.id].text }}
        </div>
      </article>
    </div>

    <!-- BOTTOM SAVE BAR -->
    <div
      v-if="items.length > 0"
      class="bottom-toolbar"
    >
      <div class="toolbar-status">
        <span
          class="status-dot"
          :class="{ unsaved: hasOrderChanges }"
        ></span>

        {{
          hasOrderChanges
            ? 'You have unsaved position changes.'
            : 'Carousel positions are saved.'
        }}
      </div>

      <button
        type="button"
        class="btn btn-primary"
        :disabled="
          !hasOrderChanges ||
          isSavingOrder ||
          isBusy
        "
        @click="saveOrder"
      >
        {{
          isSavingOrder
            ? 'Saving Positions...'
            : 'Save Positions'
        }}
      </button>
    </div>
  </section>
</template>

<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref
} from 'vue'

// ========================================
// CONFIGURATION
// ========================================

const MAX_IMAGE_SIZE = 500 * 1024

const ALLOWED_IMAGE_TYPES = [
  'image/webp',
  'image/jpeg',
  'image/png'
]

const viewports = [
  {
    id: 1,
    name: 'Mobile',
    description: 'Displayed on smaller screens'
  },
  {
    id: 2,
    name: 'Desktop',
    description: 'Displayed on larger screens'
  }
]

// ========================================
// STATE
// ========================================

const items = ref([])
const originalOrder = ref([])

const newHyperlink = ref('')

const isLoading = ref(false)
const isAdding = ref(false)
const isSavingOrder = ref(false)

const savingLinks = ref([])
const uploadingImages = ref([])
const deletingImages = ref([])
const deletingItems = ref([])

const savedHyperlinks = reactive({})
const itemMessages = reactive({})

const pageMessage = ref('')
const pageMessageType = ref('success')

const draggedItemId = ref(null)
const dragOverItemId = ref(null)

// ========================================
// COMPUTED
// ========================================

const currentOrder = computed(() =>
  items.value.map((item) => Number(item.id))
)

const hasOrderChanges = computed(() => {
  return JSON.stringify(currentOrder.value) !==
    JSON.stringify(originalOrder.value)
})

const isBusy = computed(() => {
  return (
    isAdding.value ||
    isSavingOrder.value ||
    savingLinks.value.length > 0 ||
    uploadingImages.value.length > 0 ||
    deletingImages.value.length > 0 ||
    deletingItems.value.length > 0
  )
})

// ========================================
// HELPERS
// ========================================

const imageUrl = (key) => {
  return (
    '/.netlify/functions/carousel-image?key=' +
    encodeURIComponent(key)
  )
}

const getImage = (item, viewportId) => {
  return (item.images || []).find(
    (image) =>
      Number(image.viewport_id) === viewportId
  )
}

const isSavingLink = (itemId) => {
  return savingLinks.value.includes(itemId)
}

const isUploading = (itemId, viewportId) => {
  return uploadingImages.value.includes(
    `${itemId}-${viewportId}`
  )
}

const isItemBusy = (itemId) => {
  return (
    isSavingLink(itemId) ||
    uploadingImages.value.some((key) =>
      key.startsWith(`${itemId}-`)
    ) ||
    deletingImages.value.includes(itemId) ||
    deletingItems.value.includes(itemId)
  )
}

const hasLinkChanged = (item) => {
  return (
    (item.hyperlink || '') !==
    (savedHyperlinks[item.id] || '')
  )
}

const setPageMessage = (text, type = 'success') => {
  pageMessage.value = text
  pageMessageType.value = type
}

const setItemMessage = (
  itemId,
  text,
  type = 'success'
) => {
  itemMessages[itemId] = {
    text,
    type
  }
}

const clearItemMessage = (itemId) => {
  delete itemMessages[itemId]
}

const extractError = async (response) => {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      data?.error ||
      `Request failed (${response.status}).`
    )
  }

  return data
}

// ========================================
// LOAD CAROUSEL ITEMS
// ========================================

const loadItems = async () => {
  isLoading.value = true
  pageMessage.value = ''

  try {
    const response = await fetch(
      '/.netlify/functions/carousel-items'
    )

    const data = await extractError(response)

    items.value = data.map((item) => ({
      ...item,
      images: item.images || [],
      hyperlink: item.hyperlink || ''
    }))

    originalOrder.value = items.value.map(
      (item) => Number(item.id)
    )

    for (const key of Object.keys(savedHyperlinks)) {
      delete savedHyperlinks[key]
    }

    for (const item of items.value) {
      savedHyperlinks[item.id] = item.hyperlink
    }
  } catch (error) {
    console.error(
      'Failed to load carousel items:',
      error
    )

    setPageMessage(error.message, 'error')
  } finally {
    isLoading.value = false
  }
}

// ========================================
// ADD CAROUSEL ITEM
// ========================================

const addItem = async () => {
  if (isBusy.value || hasOrderChanges.value) {
    if (hasOrderChanges.value) {
      setPageMessage(
        'Save your carousel positions before adding a slide.',
        'error'
      )
    }
    return
  }

  isAdding.value = true
  pageMessage.value = ''

  try {
    const response = await fetch(
      '/.netlify/functions/carousel-items',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hyperlink: newHyperlink.value || null
        })
      }
    )

    await extractError(response)

    newHyperlink.value = ''

    await loadItems()

    setPageMessage(
      'Carousel slide added successfully.'
    )
  } catch (error) {
    console.error('Failed to add slide:', error)
    setPageMessage(error.message, 'error')
  } finally {
    isAdding.value = false
  }
}

// ========================================
// SAVE HYPERLINK
// ========================================

const saveHyperlink = async (item) => {
  if (isItemBusy(item.id)) return

  clearItemMessage(item.id)

  savingLinks.value.push(item.id)

  try {
    const response = await fetch(
      '/.netlify/functions/carousel-items',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: item.id,
          hyperlink: item.hyperlink || null
        })
      }
    )

    const data = await extractError(response)

    item.hyperlink = data.hyperlink || ''

    savedHyperlinks[item.id] = item.hyperlink

    setItemMessage(
      item.id,
      'Destination URL saved successfully.'
    )
  } catch (error) {
    console.error('Failed to save hyperlink:', error)

    setItemMessage(
      item.id,
      error.message,
      'error'
    )
  } finally {
    savingLinks.value = savingLinks.value.filter(
      (id) => id !== item.id
    )
  }
}

// ========================================
// FILE VALIDATION
// ========================================

const validateImage = (file) => {
  if (!file) {
    return 'No image selected.'
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Only WebP, JPG, and PNG images are allowed.'
  }

  if (file.size === 0) {
    return 'The selected image is empty.'
  }

  if (file.size > MAX_IMAGE_SIZE) {
    const actualSize =
      (file.size / 1024).toFixed(1)

    return (
      `This image is ${actualSize} KB. ` +
      'The maximum allowed size is 500 KB.'
    )
  }

  return null
}

// ========================================
// UPLOAD OR REPLACE IMAGE
// ========================================

const handleFileSelected = async (
  event,
  item,
  viewportId
) => {
  const input = event.target
  const file = input.files?.[0]

  if (!file) return

  // Reset input so selecting the same file works again.
  input.value = ''

  clearItemMessage(item.id)

  const validationError = validateImage(file)

  if (validationError) {
    setItemMessage(
      item.id,
      validationError,
      'error'
    )
    return
  }

  const uploadKey = `${item.id}-${viewportId}`

  if (isItemBusy(item.id)) return

  uploadingImages.value.push(uploadKey)

  try {
    const formData = new FormData()

    formData.append(
      'carouselItemId',
      String(item.id)
    )

    formData.append(
      'viewportId',
      String(viewportId)
    )

    formData.append('image', file)

    const response = await fetch(
      '/.netlify/functions/carousel-images-update',
      {
        method: 'POST',
        body: formData
      }
    )

    const data = await extractError(response)

    const updatedImage = {
      ...data.image,
      viewport_id: viewportId
    }

    const existingIndex = item.images.findIndex(
      (image) =>
        Number(image.viewport_id) === viewportId
    )

    if (existingIndex >= 0) {
      item.images.splice(
        existingIndex,
        1,
        updatedImage
      )
    } else {
      item.images.push(updatedImage)
    }

    const viewportName =
      viewports.find(
        (viewport) => viewport.id === viewportId
      )?.name || 'Carousel'

    setItemMessage(
      item.id,
      `${viewportName} image saved successfully.`
    )
  } catch (error) {
    console.error(
      'Failed to upload carousel image:',
      error
    )

    setItemMessage(
      item.id,
      error.message,
      'error'
    )
  } finally {
    uploadingImages.value =
      uploadingImages.value.filter(
        (key) => key !== uploadKey
      )
  }
}

// ========================================
// DELETE INDIVIDUAL IMAGE
// ========================================

const deleteImage = async (item, image) => {
  if (isItemBusy(item.id)) return

  const confirmed = window.confirm(
    'Remove this carousel image?'
  )

  if (!confirmed) return

  clearItemMessage(item.id)
  deletingImages.value.push(item.id)

  try {
    const response = await fetch(
      '/.netlify/functions/carousel-images-update',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageId: image.id
        })
      }
    )

    await extractError(response)

    item.images = item.images.filter(
      (existingImage) =>
        Number(existingImage.id) !== Number(image.id)
    )

    setItemMessage(
      item.id,
      'Carousel image removed successfully.'
    )
  } catch (error) {
    console.error(
      'Failed to delete carousel image:',
      error
    )

    setItemMessage(
      item.id,
      error.message,
      'error'
    )
  } finally {
    deletingImages.value =
      deletingImages.value.filter(
        (id) => id !== item.id
      )
  }
}

// ========================================
// DELETE CAROUSEL ITEM
// ========================================

const deleteItem = async (item) => {
  if (isBusy.value) return

  if (hasOrderChanges.value) {
    setPageMessage(
      'Save your carousel positions before deleting a slide.',
      'error'
    )
    return
  }

  const confirmed = window.confirm(
    'Delete this carousel slide and both of its images? This cannot be undone.'
  )

  if (!confirmed) return

  deletingItems.value.push(item.id)
  pageMessage.value = ''

  try {
    const response = await fetch(
      '/.netlify/functions/carousel-items',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: item.id
        })
      }
    )

    await extractError(response)

    await loadItems()

    setPageMessage(
      'Carousel slide deleted successfully.'
    )
  } catch (error) {
    console.error(
      'Failed to delete carousel item:',
      error
    )

    setPageMessage(error.message, 'error')
  } finally {
    deletingItems.value =
      deletingItems.value.filter(
        (id) => id !== item.id
      )
  }
}

// ========================================
// REORDER HELPERS
// ========================================

const moveItem = (index, direction) => {
  if (isBusy.value) return

  const newIndex = index + direction

  if (
    newIndex < 0 ||
    newIndex >= items.value.length
  ) {
    return
  }

  const movedItem = items.value.splice(index, 1)[0]

  items.value.splice(newIndex, 0, movedItem)
}

// ========================================
// DRAG AND DROP
// ========================================

const handleDragStart = (event, itemId) => {
  if (isBusy.value) {
    event.preventDefault()
    return
  }

  draggedItemId.value = itemId

  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData(
    'text/plain',
    String(itemId)
  )
}

const handleDragOver = (itemId) => {
  if (!draggedItemId.value || isBusy.value) return

  dragOverItemId.value = itemId
}

const handleDrop = (targetItemId) => {
  if (isBusy.value) return

  const sourceId = draggedItemId.value

  if (!sourceId || sourceId === targetItemId) {
    handleDragEnd()
    return
  }

  const sourceIndex = items.value.findIndex(
    (item) => item.id === sourceId
  )

  const targetIndex = items.value.findIndex(
    (item) => item.id === targetItemId
  )

  if (sourceIndex < 0 || targetIndex < 0) {
    handleDragEnd()
    return
  }

  const movedItem = items.value.splice(
    sourceIndex,
    1
  )[0]

  items.value.splice(targetIndex, 0, movedItem)

  handleDragEnd()
}

const handleDragEnd = () => {
  draggedItemId.value = null
  dragOverItemId.value = null
}

// ========================================
// SAVE CAROUSEL POSITIONS
// ========================================

const saveOrder = async () => {
  if (!hasOrderChanges.value || isBusy.value) return

  isSavingOrder.value = true
  pageMessage.value = ''

  try {
    const response = await fetch(
      '/.netlify/functions/carousel-items',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order: currentOrder.value
        })
      }
    )

    await extractError(response)

    originalOrder.value = [
      ...currentOrder.value
    ]

    setPageMessage(
      'Carousel positions saved successfully.'
    )
  } catch (error) {
    console.error(
      'Failed to save carousel order:',
      error
    )

    setPageMessage(error.message, 'error')
  } finally {
    isSavingOrder.value = false
  }
}

// ========================================
// INITIALIZE
// ========================================

onMounted(loadItems)
</script>

<style scoped>
/* ========================================
   BASE
======================================== */

.carousel-management {
  --purple: #703795;
  --pink: #f04d86;
  --blue: #01aef0;
  --yellow: #fad141;

  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px 70px;
  color: #262332;
  font-family: inherit;
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* ========================================
   HEADER
======================================== */

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.eyebrow {
  display: block;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  color: var(--pink);
  margin-bottom: 8px;
}

.management-header h2 {
  font-family: 'Fredoka', sans-serif;
  color: var(--purple);
  font-size: clamp(28px, 3vw, 38px);
  font-weight: 600;
  margin: 0 0 8px;
}

.management-header p {
  color: #746f7c;
  line-height: 1.6;
  margin: 0;
}

.header-count {
  flex-shrink: 0;
  padding: 11px 18px;
  border-radius: 30px;
  background: #f3eafa;
  color: var(--purple);
  font-weight: 700;
  font-size: 13px;
}

/* ========================================
   BUTTONS
======================================== */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 18px;
  border: 1px solid transparent;
  border-radius: 11px;
  font-weight: 700;
  font-size: 13px;
  white-space: nowrap;
  text-decoration: none;
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.btn:not(:disabled):hover {
  transform: translateY(-1px);
}

.btn:focus-visible,
.icon-button:focus-visible,
input:focus-visible {
  outline: 3px solid var(--blue);
  outline-offset: 3px;
}

.btn-primary {
  background: var(--purple);
  color: white;
}

.btn-primary:not(:disabled):hover {
  background: #592777;
  box-shadow: 0 5px 16px #70379526;
}

.btn-secondary {
  background: #f0e7f7;
  color: var(--purple);
  border-color: #e5d8ed;
}

.btn-secondary:hover {
  background: #e8daf3;
}

.btn-danger-outline {
  background: white;
  color: #c83f69;
  border-color: #f4cdd9;
}

.btn-danger-outline:not(:disabled):hover {
  background: #fff0f4;
}

.btn-text-danger {
  color: #c83f69;
  background: transparent;
  padding: 10px;
}

.btn-text-danger:not(:disabled):hover {
  background: #fff0f4;
}

/* ========================================
   ADD PANEL
======================================== */

.add-panel {
  background: linear-gradient(
    120deg,
    #faf6fd,
    #fff7fa
  );
  border: 1px solid #ebdff1;
  border-radius: 18px;
  padding: 25px;
  margin-bottom: 42px;
}

.panel-heading {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
}

.panel-icon {
  width: 43px;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--purple);
  color: white;
  font-size: 26px;
  font-weight: 400;
  border-radius: 12px;
}

.panel-heading h3 {
  font-family: 'Fredoka', sans-serif;
  color: var(--purple);
  font-size: 20px;
  margin: 0 0 3px;
}

.panel-heading p {
  color: #82798b;
  font-size: 13px;
  margin: 0;
}

.add-form {
  display: flex;
  align-items: flex-end;
  gap: 15px;
}

.add-form .field {
  flex: 1;
}

.add-form .btn {
  min-height: 46px;
}

/* ========================================
   FORM FIELDS
======================================== */

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.field label {
  font-size: 13px;
  font-weight: 700;
  color: #484052;
}

.optional {
  color: #9a91a2;
  font-weight: 400;
  margin-left: 3px;
}

.field input {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  height: 46px;
  padding: 0 14px;
  border: 1px solid #ddd6e5;
  background: white;
  border-radius: 10px;
  color: #302a38;
  font-size: 14px;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.field input:focus {
  border-color: var(--purple);
  box-shadow: 0 0 0 3px #70379512;
}

.field input::placeholder {
  color: #a59cab;
}

.field-hint {
  font-size: 12px;
  color: #8b8392;
  margin: 0;
}

/* ========================================
   LIST HEADING
======================================== */

.list-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.list-heading h3 {
  font-family: 'Fredoka', sans-serif;
  font-size: 23px;
  font-weight: 600;
  color: var(--purple);
  margin: 0 0 5px;
}

.list-heading p {
  font-size: 13px;
  color: #827b89;
  margin: 0;
  line-height: 1.5;
}

/* ========================================
   CAROUSEL LIST
======================================== */

.carousel-list {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.carousel-item {
  background: white;
  border: 1px solid #e7e2eb;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 18px #32204407;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    opacity 0.2s;
}

.carousel-item.dragging {
  opacity: 0.45;
}

.carousel-item.drag-target {
  border-color: var(--purple);
  box-shadow: 0 0 0 2px #70379525;
}

.item-header {
  padding: 18px 23px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid #eeeaf1;
  background: #fdfbfe;
}

.item-identity {
  display: flex;
  align-items: center;
  gap: 13px;
}

.drag-handle {
  font-size: 25px;
  line-height: 1;
  color: #a79ab1;
  cursor: grab;
  user-select: none;
}

.position-number {
  width: 35px;
  height: 35px;
  border-radius: 11px;
  background: #f0e6f8;
  color: var(--purple);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
}

.item-identity h4 {
  font-family: 'Fredoka', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #3b3044;
  margin: 0 0 1px;
}

.item-id {
  font-size: 11px;
  color: #938a9c;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 13px;
}

.order-controls {
  display: flex;
  gap: 5px;
}

.icon-button {
  width: 34px;
  height: 34px;
  background: white;
  border: 1px solid #e2dae8;
  color: var(--purple);
  border-radius: 9px;
  font-size: 17px;
  font-weight: bold;
}

.icon-button:not(:disabled):hover {
  background: #f4eaf9;
}

/* ========================================
   IMAGE PANELS
======================================== */

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  padding: 24px;
}

.image-panel {
  border: 1px solid #ebe6ef;
  border-radius: 14px;
  padding: 16px;
  background: #fff;
  min-width: 0;
}

.image-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}

.viewport-name {
  display: block;
  color: #45384c;
  font-size: 15px;
  font-weight: 800;
}

.viewport-description {
  display: block;
  color: #9a91a2;
  font-size: 11px;
  margin-top: 3px;
}

.image-status {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #b16d47;
  background: #fff1e7;
  border-radius: 20px;
  padding: 5px 9px;
  white-space: nowrap;
}

.image-status.ready {
  color: #267854;
  background: #e8f8ee;
}

.image-preview {
  width: 100%;
  height: 215px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8f6fa;
  border: 1px dashed #e2dce8;
  border-radius: 11px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #aaa0b1;
  font-size: 12px;
}

.placeholder-icon {
  font-size: 34px;
  color: #c7bbcf;
}

.image-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.upload-button {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.upload-button.disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.upload-button input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  overflow: hidden;
}

.image-help {
  color: #9a91a2;
  font-size: 11px;
  margin: 11px 0 0;
}

/* ========================================
   LINK SECTION
======================================== */

.link-section {
  padding: 0 24px 23px;
}

.link-input-row {
  display: flex;
  gap: 12px;
}

.link-input-row input {
  flex: 1;
}

.link-input-row .btn {
  min-width: 105px;
}

/* ========================================
   FEEDBACK
======================================== */

.feedback {
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
}

.feedback.success {
  color: #236e4e;
  background: #eaf8ef;
  border: 1px solid #ccebd9;
}

.feedback.error {
  color: #ae3955;
  background: #fff0f3;
  border: 1px solid #f8d1dc;
}

.item-feedback {
  margin: 0 24px 23px;
}

/* ========================================
   EMPTY STATE
======================================== */

.empty-state {
  padding: 65px 20px;
  text-align: center;
  background: #faf8fc;
  border: 1px dashed #e1d8e8;
  border-radius: 17px;
}

.empty-state h3 {
  font-family: 'Fredoka', sans-serif;
  color: var(--purple);
  margin: 10px 0 5px;
}

.empty-state p {
  color: #8f8598;
  font-size: 13px;
}

.empty-icon {
  font-size: 44px;
  color: #bdabca;
}

.loading-spinner {
  margin: auto;
  height: 30px;
  width: 30px;
  border: 3px solid #e9def0;
  border-top-color: var(--purple);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ========================================
   BOTTOM TOOLBAR
======================================== */

.bottom-toolbar {
  margin-top: 25px;
  padding: 17px 21px;
  border: 1px solid #ebe5f0;
  border-radius: 14px;
  background: #fcfafe;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.toolbar-status {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12px;
  color: #746d7b;
}

.status-dot {
  height: 9px;
  width: 9px;
  border-radius: 50%;
  background: #49b983;
  flex-shrink: 0;
}

.status-dot.unsaved {
  background: var(--pink);
}

/* ========================================
   RESPONSIVE
======================================== */

@media (max-width: 768px) {
  .carousel-management {
    padding: 20px 12px 50px;
  }

  .management-header {
    align-items: flex-start;
  }

  .header-count {
    font-size: 11px;
    padding: 9px 12px;
  }

  .add-form {
    flex-direction: column;
    align-items: stretch;
  }

  .add-form .btn {
    width: 100%;
  }

  .add-panel {
    padding: 18px;
  }

  .image-grid {
    grid-template-columns: 1fr;
    padding: 15px;
    gap: 15px;
  }

  .image-preview {
    height: 200px;
  }

  .item-header {
    padding: 14px;
  }

  .item-actions {
    gap: 7px;
  }

  .item-actions .btn {
    padding: 9px 11px;
  }

  .link-section {
    padding: 0 15px 18px;
  }

  .link-input-row {
    flex-direction: column;
  }

  .link-input-row .btn {
    width: 100%;
  }

  .item-feedback {
    margin: 0 15px 18px;
  }

  .bottom-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .bottom-toolbar .btn {
    width: 100%;
  }
}

@media (max-width: 460px) {
  .management-header {
    flex-direction: column;
  }

  .list-heading {
    flex-direction: column;
    align-items: stretch;
  }

  .item-identity {
    gap: 7px;
  }

  .position-number {
    width: 30px;
    height: 30px;
  }

  .drag-handle {
    font-size: 20px;
  }

  .item-identity h4 {
    font-size: 15px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition: none !important;
    animation: none !important;
  }
}
</style>
