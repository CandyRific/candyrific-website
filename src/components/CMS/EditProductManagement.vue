<script setup>
import {
  computed,
  onBeforeUnmount,
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
   IMAGE STATE
======================================== */

const existingImages = ref([])

const deleteImageIds = ref([])

const newImages = ref([])
const newImagePreviews = ref([])

const imageInput = ref(null)

// Keep the original database order so position changes can be detected.
const originalImageIds = ref([])

// Native drag-and-drop state for existing images.
const draggedImageId = ref(null)
const dropTargetImageId = ref(null)

const activeExistingImages = computed(() =>
  existingImages.value.filter(
    (image) => !deleteImageIds.value.includes(Number(image.id))
  )
)

const hasImageOrderChanges = computed(() => {
  const activeIds = activeExistingImages.value.map(
    (image) => Number(image.id)
  )

  const originalActiveIds = originalImageIds.value.filter(
    (id) => !deleteImageIds.value.includes(id)
  )

  // A reorder counts, as do old 0/null/nonconsecutive display_order values.
  return (
    activeIds.length !== originalActiveIds.length ||
    activeIds.some((id, index) => id !== originalActiveIds[index]) ||
    activeExistingImages.value.some(
      (image, index) => Number(image.display_order) !== index + 1
    )
  )
})

const hasPendingImageChanges = computed(() =>
  deleteImageIds.value.length > 0 ||
  newImages.value.length > 0 ||
  hasImageOrderChanges.value
)

/* ========================================
   LOADING STATE
======================================== */

const isLoadingProduct = ref(false)
const productLoadMessage = ref('')

const isLoadingBrands = ref(false)
const isLoadingSeasons = ref(false)
const isLoadingImages = ref(false)

/* ========================================
   SAVE STATE
======================================== */

const isSavingItemNumber = ref(false)
const isSavingName = ref(false)
const isSavingDescription = ref(false)
const isSavingAmazonLink = ref(false)

const isSavingBrands = ref(false)
const isSavingSeasons = ref(false)
const isSavingImages = ref(false)

/* ========================================
   MESSAGES
======================================== */

const itemNumberMessage = ref('')
const nameMessage = ref('')
const descriptionMessage = ref('')
const amazonLinkMessage = ref('')

const brandsMessage = ref('')
const seasonsMessage = ref('')
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
   FETCH / LOAD PRODUCT IMAGES
======================================== */

const fetchProductImageList = async () => {
  const response = await fetch(
    `/.netlify/functions/product-images-update?productId=${encodeURIComponent(
      props.productId
    )}`
  )

  const data = await readResponse(
    response,
    'Unable to load product images.'
  )

  if (!Array.isArray(data)) {
    throw new Error('Invalid product image response.')
  }

  return [...data].sort((a, b) =>
    Number(a.display_order ?? 0) - Number(b.display_order ?? 0) ||
    Number(a.id) - Number(b.id)
  )
}

const loadProductImages = async () => {
  isLoadingImages.value = true
  imagesMessage.value = ''

  try {
    const images = await fetchProductImageList()

    existingImages.value = images
    originalImageIds.value = images.map((image) => Number(image.id))
    deleteImageIds.value = []
    draggedImageId.value = null
    dropTargetImageId.value = null

    clearNewImages()
    return true
  } catch (error) {
    console.error('Unable to load product images:', error)
    imagesMessage.value = error.message
    return false
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

const getActiveImagePosition = (imageId) =>
  activeExistingImages.value.findIndex(
    (image) => Number(image.id) === Number(imageId)
  ) + 1

const reorderExistingImage = (sourceId, destinationId) => {
  if (isSavingImages.value ||
      isImageMarkedForDelete(sourceId) ||
      isImageMarkedForDelete(destinationId)) {
    return
  }

  const active = [...activeExistingImages.value]
  const sourceIndex = active.findIndex(
    (image) => Number(image.id) === Number(sourceId)
  )
  const destinationIndex = active.findIndex(
    (image) => Number(image.id) === Number(destinationId)
  )

  if (sourceIndex < 0 || destinationIndex < 0 ||
      sourceIndex === destinationIndex) {
    return
  }

  const [movedImage] = active.splice(sourceIndex, 1)
  active.splice(destinationIndex, 0, movedImage)

  // Leave images marked for removal visible, but after active images.
  const removed = existingImages.value.filter(
    (image) => isImageMarkedForDelete(image.id)
  )
  existingImages.value = [...active, ...removed]
  imagesMessage.value = ''
}

const moveExistingImage = (imageId, direction) => {
  const currentIndex = getActiveImagePosition(imageId) - 1
  const destination = activeExistingImages.value[currentIndex + direction]
  if (destination) {
    reorderExistingImage(imageId, destination.id)
  }
}

const startExistingImageDrag = (event, imageId) => {
  if (isSavingImages.value || isImageMarkedForDelete(imageId)) {
    event.preventDefault()
    return
  }

  draggedImageId.value = Number(imageId)
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', String(imageId))
}

const handleExistingImageDragOver = (event, imageId) => {
  if (draggedImageId.value === null ||
      isImageMarkedForDelete(imageId)) {
    return
  }

  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  dropTargetImageId.value = Number(imageId)
}

const dropExistingImage = (event, destinationId) => {
  event.preventDefault()
  if (draggedImageId.value !== null) {
    reorderExistingImage(draggedImageId.value, destinationId)
  }
  endExistingImageDrag()
}

const endExistingImageDrag = () => {
  draggedImageId.value = null
  dropTargetImageId.value = null
}

/* ========================================
   SAVE IMAGES + THEIR DISPLAY ORDER
======================================== */

const saveImages = async () => {
  imagesMessage.value = ''

  if (!hasPendingImageChanges.value) {
    imagesMessage.value = 'No image changes to save.'
    return
  }

  isSavingImages.value = true

  // Capture the user's current ordering before any server calls/reloads.
  const preferredExistingIds = activeExistingImages.value.map(
    (image) => Number(image.id)
  )
  const knownExistingIds = new Set(
    existingImages.value.map((image) => Number(image.id))
  )

  try {
    /* DELETE EXISTING IMAGES */
    if (deleteImageIds.value.length > 0) {
      const deleteResponse = await fetch(
        '/.netlify/functions/product-images-update',
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: props.productId,
            imageIds: deleteImageIds.value
          })
        }
      )

      await readResponse(deleteResponse, 'Unable to remove images.')
    }

    /* UPLOAD NEW IMAGES (appended in selection order) */
    if (newImages.value.length > 0) {
      const formData = new FormData()
      formData.append('productId', props.productId)

      for (const image of newImages.value) {
        formData.append('images', image)
      }

      const postResponse = await fetch(
        '/.netlify/functions/product-images-update',
        {
          method: 'POST',
          body: formData
        }
      )

      await readResponse(postResponse, 'Unable to add images.')
    }

    /* RE-FETCH TO INCLUDE DATABASE IDS OF NEW IMAGES */
    const currentImages = await fetchProductImageList()
    const currentIds = new Set(
      currentImages.map((image) => Number(image.id))
    )

    const survivingExistingIds = preferredExistingIds.filter(
      (id) => currentIds.has(id)
    )

    const addedIds = currentImages
      .filter((image) => !knownExistingIds.has(Number(image.id)))
      .map((image) => Number(image.id))

    const orderedImageIds = [...survivingExistingIds, ...addedIds]

    if (orderedImageIds.length !== currentImages.length ||
        new Set(orderedImageIds).size !== currentImages.length) {
      throw new Error('The image list changed while saving. Reload and try again.')
    }

    /* PERSIST CONTIGUOUS DISPLAY ORDER: 1, 2, 3, ... */
    const reorderResponse = await fetch(
      '/.netlify/functions/product-images-update',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: props.productId,
          imageIds: orderedImageIds
        })
      }
    )

    await readResponse(reorderResponse, 'Unable to save image positions.')

    if (!(await loadProductImages())) {
      throw new Error('Images were saved, but the updated list could not be loaded.')
    }

    imagesMessage.value = 'Images and their display order saved successfully.'
  } catch (error) {
    console.error('Unable to update product images:', error)

    // DELETE/POST/PATCH are separate requests; reflect the actual DB state
    // if a later step fails, instead of keeping misleading pending changes.
    await loadProductImages()
    imagesMessage.value = error.message
  } finally {
    isSavingImages.value = false
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
      loadSeasonEditor(),
      loadProductImages()
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
   SAVE DESCRIPTION
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
    try {
      await loadCurrentProductBrands()
    } catch (reloadError) {
      console.error(reloadError)
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
    try {
      await loadCurrentProductSeasons()
    } catch (reloadError) {
      console.error(reloadError)
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
  clearNewImages()

  emit('close')
}

/* ========================================
   WATCH PRODUCT
======================================== */

watch(
  () => props.productId,
  () => {
    clearNewImages()

    isBrandDropdownOpen.value = false
    isSeasonDropdownOpen.value = false

    loadProduct()
  }
)

/* ========================================
   CLEANUP
======================================== */

onBeforeUnmount(() => {
  clearNewImages()
})

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

      <!-- ITEM NUMBER -->

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

      <!-- PRODUCT NAME -->

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

      <!-- PRODUCT DESCRIPTION -->

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

      <!-- AMAZON LINK -->

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
          class="association-loading"
        >
          Loading brands...
        </p>

        <template v-else>
          <div class="association-editor">

            <div class="association-dropdown">

              <button
                type="button"
                class="association-dropdown-button"
                @click="toggleBrandDropdown"
              >
                <span>
                  {{ selectedBrandIds.length }}
                  brand{{
                    selectedBrandIds.length === 1
                      ? ''
                      : 's'
                  }}
                  selected
                </span>

                <span
                  class="association-arrow"
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
                class="association-menu"
              >
                <label
                  v-for="brand in allBrands"
                  :key="brand.id"
                  class="association-option"
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
            class="association-pill-list"
          >
            <span
              v-for="brand in allBrands.filter(
                (brand) =>
                  selectedBrandIds.includes(
                    Number(brand.id)
                  )
              )"
              :key="brand.id"
              class="association-pill"
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
          class="association-loading"
        >
          Loading seasons...
        </p>

        <template v-else>
          <div class="association-editor">

            <div class="association-dropdown">

              <button
                type="button"
                class="association-dropdown-button"
                @click="toggleSeasonDropdown"
              >
                <span>
                  {{ selectedSeasonIds.length }}
                  season{{
                    selectedSeasonIds.length === 1
                      ? ''
                      : 's'
                  }}
                  selected
                </span>

                <span
                  class="association-arrow"
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
                class="association-menu"
              >
                <label
                  v-for="season in allSeasons"
                  :key="season.id"
                  class="association-option"
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
            class="association-pill-list"
          >
            <span
              v-for="season in allSeasons.filter(
                (season) =>
                  selectedSeasonIds.includes(
                    Number(season.id)
                  )
              )"
              :key="season.id"
              class="association-pill"
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

      <!-- ========================================
           PRODUCT IMAGES
      ========================================= -->

      <div class="product-field-card">
        <div class="field-heading">
          Product Images
        </div>

        <p class="image-help-text">
          Drag the current images into the order you want, or use the
          move buttons. Image 1 becomes the main product image.
          You can also add or remove images before saving everything
          with the same Save Images button.
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
              Current Images
            </div>

            <div class="image-grid">
              <div
                v-for="image in existingImages"
                :key="image.id"
                class="image-card image-sortable-card"
                :class="{
                  'marked-for-delete': isImageMarkedForDelete(image.id),
                  'image-is-dragging': draggedImageId === Number(image.id),
                  'image-drop-target': dropTargetImageId === Number(image.id)
                }"
                :draggable="!isSavingImages && !isImageMarkedForDelete(image.id)"
                @dragstart="startExistingImageDrag($event, image.id)"
                @dragover="handleExistingImageDragOver($event, image.id)"
                @drop="dropExistingImage($event, image.id)"
                @dragend="endExistingImageDrag"
              >
                <div class="image-preview">
                  <img
                    :src="getProductImageUrl(image.image_key)"
                    :alt="isImageMarkedForDelete(image.id)
                      ? 'Product image marked for removal'
                      : `Product image ${getActiveImagePosition(image.id)}`"
                    draggable="false"
                  >

                  <span
                    v-if="!isImageMarkedForDelete(image.id)"
                    class="image-position-badge"
                  >
                    #{{ getActiveImagePosition(image.id) }}
                    {{ getActiveImagePosition(image.id) === 1 ? 'Main' : '' }}
                  </span>

                  <div
                    v-if="isImageMarkedForDelete(image.id)"
                    class="delete-overlay"
                  >
                    Will be removed
                  </div>
                </div>

                <div
                  v-if="!isImageMarkedForDelete(image.id)"
                  class="image-order-controls"
                >
                  <button
                    type="button"
                    class="image-order-button"
                    :disabled="isSavingImages || getActiveImagePosition(image.id) === 1"
                    :aria-label="`Move image ${getActiveImagePosition(image.id)} earlier`"
                    @click="moveExistingImage(image.id, -1)"
                  >
                    ← Earlier
                  </button>

                  <button
                    type="button"
                    class="image-order-button"
                    :disabled="isSavingImages || getActiveImagePosition(image.id) === activeExistingImages.length"
                    :aria-label="`Move image ${getActiveImagePosition(image.id)} later`"
                    @click="moveExistingImage(image.id, 1)"
                  >
                    Later →
                  </button>
                </div>

                <button
                  type="button"
                  class="image-delete-button"
                  :disabled="isSavingImages"
                  :class="{ restore: isImageMarkedForDelete(image.id) }"
                  @click="toggleExistingImageDelete(image.id)"
                >
                  {{ isImageMarkedForDelete(image.id) ? 'Keep Image' : 'Remove' }}
                </button>
              </div>
            </div>
          </div>

          <div
            v-else
            class="image-empty-state"
          >
            No product images are currently associated with this product.
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
              <span class="image-upload-icon" aria-hidden="true">+</span>
              <span class="image-upload-title">Choose product images</span>
              <span class="image-upload-subtitle">
                Select one or multiple files. New images are added after the
                current images; once saved, you can move them anywhere.
              </span>
            </label>

            <input
              id="product-image-upload"
              ref="imageInput"
              type="file"
              accept="image/*"
              multiple
              class="image-file-input"
              :disabled="isSavingImages"
              @change="handleImageSelection"
            >
          </div>

          <!-- NEW IMAGE PREVIEWS -->
          <div
            v-if="newImagePreviews.length > 0"
            class="image-section new-image-section"
          >
            <div class="image-section-title">
              New Images
            </div>

            <div class="image-grid">
              <div
                v-for="(preview, index) in newImagePreviews"
                :key="preview.url"
                class="image-card new-image-card"
              >
                <div class="image-preview">
                  <img
                    :src="preview.url"
                    :alt="preview.name"
                  >
                  <span class="new-image-badge">New</span>
                </div>

                <div class="new-image-name">
                  {{ preview.name }}
                </div>

                <button
                  type="button"
                  class="image-delete-button"
                  :disabled="isSavingImages"
                  @click="removeNewImage(index)"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- IMAGE SAVE SUMMARY -->
          <div class="image-save-row">
            <div class="image-change-summary">
              <span v-if="newImages.length > 0">
                {{ newImages.length }} new
              </span>
              <span v-if="deleteImageIds.length > 0">
                {{ deleteImageIds.length }} to remove
              </span>
              <span v-if="hasImageOrderChanges">
                Image positions to save
              </span>
              <span v-if="!hasPendingImageChanges">
                No unsaved image changes
              </span>
            </div>

            <button
              type="button"
              class="save-button"
              :disabled="isSavingImages || isLoadingImages"
              @click="saveImages"
            >
              {{ isSavingImages ? 'Saving...' : 'Save Images' }}
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

    </div>

  </section>
</template>
<style scoped>
/* Additions only: keep the existing global product-manager styling. */
.image-preview {
  position: relative;
}

.image-sortable-card {
  cursor: grab;
  transition: opacity 150ms ease, outline-color 150ms ease;
}

.image-sortable-card:active {
  cursor: grabbing;
}

.image-sortable-card.marked-for-delete {
  cursor: default;
}

.image-is-dragging {
  opacity: 0.45;
}

.image-drop-target {
  outline: 2px dashed #703795;
  outline-offset: 3px;
}

.image-position-badge {
  position: absolute;
  z-index: 2;
  top: 0.55rem;
  left: 0.55rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: #703795;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1.35;
  pointer-events: none;
}

.image-order-controls {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.45rem;
  width: 100%;
  margin: 0.65rem 0;
}

.image-order-button {
  min-width: 0;
  padding: 0.5rem 0.55rem;
  border: 1px solid #703795;
  border-radius: 0.6rem;
  background: #fff;
  color: #703795;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;
}

.image-order-button:hover:not(:disabled) {
  background: #703795;
  color: #fff;
}

.image-order-button:focus-visible {
  outline: 3px solid #01aef0;
  outline-offset: 2px;
}

.image-order-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .image-sortable-card,
  .image-order-button {
    transition: none;
  }
}
</style>
