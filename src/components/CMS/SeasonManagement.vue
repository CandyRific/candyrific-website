<script setup>
import {
  onMounted,
  ref
} from 'vue'

const seasonName = ref('')
const seasons = ref([])

const formMessage = ref('')

const isSubmitting = ref(false)
const isLoading = ref(false)


/* ========================================
   LOAD SEASONS
======================================== */

const loadSeasons = async () => {
  isLoading.value = true

  try {
    const response = await fetch(
      '/.netlify/functions/seasons'
    )

    const data =
      await response.json()

    if (!response.ok) {
      throw new Error(
        data?.error ||
        'Unable to load seasons.'
      )
    }

    seasons.value = data

  } catch (error) {
    console.error(
      'Error loading seasons:',
      error
    )

    formMessage.value =
      error.message ||
      'Unable to load seasons.'

  } finally {
    isLoading.value = false
  }
}


/* ========================================
   ADD SEASON
======================================== */

const addSeason = async () => {
  formMessage.value = ''

  const name =
    seasonName.value.trim()

  if (!name) {
    formMessage.value =
      'Season name is required.'

    return
  }

  isSubmitting.value = true

  try {
    const response = await fetch(
      '/.netlify/functions/seasons',
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body: JSON.stringify({
          name
        })
      }
    )

    const data =
      await response.json()

    if (!response.ok) {
      throw new Error(
        data?.error ||
        'Unable to add season.'
      )
    }

    formMessage.value =
      'Season added successfully.'

    seasonName.value = ''

    await loadSeasons()

  } catch (error) {
    console.error(
      'Error adding season:',
      error
    )

    formMessage.value =
      error.message ||
      'Something went wrong while adding the season.'

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

      <h2>
        Season Manager
      </h2>

      <p>
        Add and manage seasons that can be
        associated with products.
      </p>

    </div>


    <!-- ========================================
         ADD SEASON
    ========================================= -->

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


      <button
        type="submit"
        class="submit-button"
        :disabled="isSubmitting"
      >
        {{
          isSubmitting
            ? 'Adding Season...'
            : 'Add Season'
        }}
      </button>


      <p
        v-if="formMessage"
        class="form-message"
      >
        {{ formMessage }}
      </p>

    </form>


    <!-- ========================================
         CURRENT SEASONS
    ========================================= -->

    <div class="season-list-section">

      <h3>
        Current Seasons
      </h3>


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
        class="season-list"
      >

        <div
          v-for="season in seasons"
          :key="season.id"
          class="season-row"
        >

          <span class="season-name">
            {{ season.name }}
          </span>

          <span class="season-id">
            ID: {{ season.id }}
          </span>

        </div>

      </div>

    </div>

  </section>
</template>


<style scoped>
.season-management {
  width: 100%;
}


/* ========================================
   HEADER
======================================== */

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0 0 0.5rem;

  color: #703795;

  font-size: clamp(
    1.75rem,
    3vw,
    2.5rem
  );

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
  padding: clamp(
    1rem,
    3vw,
    1.5rem
  );

  background: #f8f5fb;

  border:
    1px solid #e4d8ed;

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

.form-group input {
  width: 100%;

  padding: 0.75rem;

  box-sizing: border-box;

  background: white;

  border:
    1px solid #ccc;

  border-radius: 6px;

  font: inherit;
}

.form-group input:focus {
  outline:
    2px solid #703795;

  outline-offset: 2px;
}


/* ========================================
   BUTTON
======================================== */

.submit-button {
  padding:
    0.8rem 1.4rem;

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


/* ========================================
   MESSAGES
======================================== */

.form-message {
  margin:
    1rem 0 0;

  color: #703795;

  font-weight: 500;
}

.status-message {
  color: #555;
}


/* ========================================
   SEASON LIST
======================================== */

.season-list-section {
  margin-top: 2.5rem;
}

.season-list-section h3 {
  margin:
    0 0 1rem;

  color: #703795;

  font-size: 1.4rem;
}

.season-list {
  display: flex;
  flex-direction: column;

  gap: 0.6rem;
}

.season-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;

  padding: 0.85rem 1rem;

  background: #f8f5fb;

  border:
    1px solid #e4d8ed;

  border-radius: 6px;
}

.season-name {
  color: #703795;

  font-weight: 600;
}

.season-id {
  color: #777;

  font-size: 0.75rem;
}
</style>