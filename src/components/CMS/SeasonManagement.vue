<script setup>
import { onMounted, ref } from 'vue'

const seasonName = ref('')
const seasonImage = ref(null)
const seasonImageName = ref('')

const seasons = ref([])

const formMessage = ref('')
const isSubmitting = ref(false)
const isLoading = ref(false)

const handleImageChange = (event) => {
  const file = event.target.files?.[0] || null

  seasonImage.value = file
  seasonImageName.value = file?.name || ''
}

const loadSeasons = async () => {
  isLoading.value = true

  try {
    const response = await fetch('/.netlify/functions/seasons')

    if (!response.ok) {
      throw new Error('Unable to load seasons.')
    }

    seasons.value = await response.json()
  } catch (error) {
    console.error('Error loading seasons:', error)
  } finally {
    isLoading.value = false
  }
}

const addSeason = async () => {
  formMessage.value = ''

  if (!seasonName.value.trim()) {
    formMessage.value = 'Season name is required.'
    return
  }

  if (!seasonImage.value) {
    formMessage.value = 'Season image is required.'
    return
  }

  isSubmitting.value = true

  try {
    const formData = new FormData()

    formData.append('name', seasonName.value.trim())
    formData.append('image', seasonImage.value)

    const response = await fetch('/.netlify/functions/seasons', {
      method: 'POST',
      body: formData,
    })

    const responseText = await response.text()

    let responseData = null

    try {
      responseData = JSON.parse(responseText)
    } catch {
      responseData = null
    }

    if (!response.ok) {
      throw new Error(
        responseData?.error ||
          responseData?.message ||
          responseText ||
          'Unable to add season.'
      )
    }

    formMessage.value = 'Season added successfully.'

    seasonName.value = ''
    seasonImage.value = null
    seasonImageName.value = ''

    const fileInput = document.getElementById('season-image')

    if (fileInput) {
      fileInput.value = ''
    }

    await loadSeasons()
  } catch (error) {
    console.error('Error adding season:', error)

    formMessage.value =
      error.message || 'Something went wrong while adding the season.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadSeasons()
})
</script>

<template>
  <section class="season-management">
    <div class="section-header">
      <h2>Season Manager</h2>

      <p>
        Add and manage seasonal categories that can later be associated
        with products.
      </p>
    </div>

    <form
      class="season-form"
      @submit.prevent="addSeason"
    >
      <div class="form-group">
        <label for="season-name">
          Season Name
        </label>

        <input
          id="season-name"
          v-model="seasonName"
          type="text"
          placeholder="Example: Christmas"
          required
        >
      </div>

      <div class="form-group">
        <label for="season-image">
          Season Image
        </label>

        <input
          id="season-image"
          type="file"
          accept="image/*"
          required
          @change="handleImageChange"
        >

        <p
          v-if="seasonImageName"
          class="selected-file"
        >
          Selected: {{ seasonImageName }}
        </p>
      </div>

      <button
        type="submit"
        class="submit-button"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Adding Season...' : 'Add Season' }}
      </button>

      <p
        v-if="formMessage"
        class="form-message"
      >
        {{ formMessage }}
      </p>
    </form>

    <div class="season-list-section">
      <h3>Current Seasons</h3>

      <p
        v-if="isLoading"
        class="status-message"
      >
        Loading seasons...
      </p>

      <p
        v-else-if="seasons.length === 0"
        class="status-message"
      >
        No seasons have been added yet.
      </p>

      <div
        v-else
        class="season-grid"
      >
        <div
          v-for="season in seasons"
          :key="season.id"
          class="season-card"
        >
          <div class="season-image-wrapper">
            <img
              v-if="season.image_key"
              :src="`/.netlify/functions/season-image?key=${encodeURIComponent(season.image_key)}`"
              :alt="season.name"
            >
          </div>

          <div class="season-card-content">
            <span class="season-name">
              {{ season.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.season-management {
  width: 100%;
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0 0 0.5rem;

  color: #703795;

  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 600;
}

.section-header p {
  margin: 0;

  color: #555;

  line-height: 1.5;
}


/* ========================================
   FORM
======================================== */

.season-form {
  padding: clamp(1rem, 3vw, 1.5rem);

  background: #f8f5fb;

  border: 1px solid #e4d8ed;
  border-radius: 10px;
}

.form-group {
  margin-bottom: 1.25rem;

  display: flex;
  flex-direction: column;

  gap: 0.4rem;
}

.form-group label {
  color: #703795;

  font-weight: 600;
}

.form-group input[type='text'] {
  width: 100%;

  padding: 0.75rem;

  background: white;

  border: 1px solid #ccc;
  border-radius: 6px;

  font: inherit;

  box-sizing: border-box;
}

.form-group input[type='text']:focus {
  outline: 2px solid #703795;
  outline-offset: 2px;
}

.form-group input[type='file'] {
  font: inherit;
}

.selected-file {
  margin: 0.25rem 0 0;

  color: #555;

  font-size: 0.9rem;
}

.submit-button {
  padding: 0.8rem 1.4rem;

  background: #703795;

  color: white;

  border: none;
  border-radius: 6px;

  font: inherit;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.15s ease,
    opacity 0.15s ease;
}

.submit-button:hover:not(:disabled) {
  background: #5c2c7c;
}

.submit-button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

.form-message {
  margin: 1rem 0 0;

  color: #703795;

  font-weight: 500;
}


/* ========================================
   SEASON LIST
======================================== */

.season-list-section {
  margin-top: 2.5rem;
}

.season-list-section h3 {
  margin: 0 0 1rem;

  color: #703795;

  font-size: 1.4rem;
}

.status-message {
  color: #555;
}

.season-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 1rem;
}

.season-card {
  overflow: hidden;

  background: white;

  border: 1px solid #e4d8ed;
  border-radius: 10px;
}

.season-image-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  background: #f8f5fb;
}

.season-image-wrapper img {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.season-card-content {
  padding: 0.8rem;

  text-align: center;
}

.season-name {
  color: #703795;

  font-weight: 600;
}


/* ========================================
   DESKTOP
======================================== */

@media (min-width: 768px) {
  .season-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1100px) {
  .season-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>