
<script setup>
import { onMounted, ref } from 'vue'

/* ========================================
   INSTAGRAM STATE
======================================== */

const instagramLinks = ref([
  '',
  '',
  '',
  ''
])

const originalLinks = ref([
  '',
  '',
  '',
  ''
])

const isLoading = ref(false)
const isSaving = ref(false)

const formMessage = ref('')
const messageType = ref('')

/* ========================================
   LOAD INSTAGRAM LINKS
======================================== */

const loadInstagramLinks = async () => {
  isLoading.value = true
  formMessage.value = ''

  try {
    const response = await fetch(
      '/.netlify/functions/instagram-posts'
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.error ||
        'Unable to load Instagram links.'
      )
    }

    const links = ['', '', '', '']

    for (const post of data) {
      if (post.id >= 1 && post.id <= 4) {
        links[post.id - 1] =
          post.instagram_link
      }
    }

    instagramLinks.value = links
    originalLinks.value = [...links]

  } catch (error) {
    formMessage.value = error.message
    messageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}

/* ========================================
   VALIDATE INSTAGRAM URL
======================================== */

const isValidInstagramUrl = (value) => {
  try {
    const url = new URL(value)

    return (
      url.protocol === 'https:' &&
      [
        'instagram.com',
        'www.instagram.com'
      ].includes(url.hostname) &&
      /^\/(p|reel|tv)\/[^/]+\/?$/.test(
        url.pathname
      )
    )
  } catch {
    return false
  }
}

/* ========================================
   SAVE INSTAGRAM LINKS
======================================== */

const saveInstagramLinks = async () => {
  if (isSaving.value) return

  isSaving.value = true
  formMessage.value = ''
  messageType.value = ''

  try {
    const normalizedLinks =
      instagramLinks.value.map(
        (link) => link.trim()
      )

    for (
      let index = 0;
      index < normalizedLinks.length;
      index++
    ) {
      const link = normalizedLinks[index]

      if (link && !isValidInstagramUrl(link)) {
        throw new Error(
          `Instagram Post ${index + 1} has an invalid URL.`
        )
      }
    }

    const nonEmptyLinks =
      normalizedLinks.filter(Boolean)

    if (
      new Set(nonEmptyLinks).size !==
      nonEmptyLinks.length
    ) {
      throw new Error(
        'Duplicate Instagram links are not allowed.'
      )
    }

    let changes = 0

    for (let index = 0; index < 4; index++) {
      const id = index + 1

      const newLink =
        normalizedLinks[index]

      const originalLink =
        originalLinks.value[index]

      if (newLink === originalLink) {
        continue
      }

      let method = 'POST'

      if (!newLink && originalLink) {
        method = 'DELETE'
      } else if (originalLink) {
        method = 'PATCH'
      }

      const response = await fetch(
        '/.netlify/functions/instagram-posts',
        {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            method === 'DELETE'
              ? { id }
              : {
                  id,
                  instagram_link: newLink
                }
          )
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
          `Failed to save Instagram Post ${id}.`
        )
      }

      // Track each successful database change.
      originalLinks.value[index] = newLink

      changes++
    }

    instagramLinks.value = normalizedLinks

    messageType.value = 'success'

    formMessage.value =
      changes > 0
        ? 'Instagram links saved successfully!'
        : 'No changes to save.'

  } catch (error) {
    messageType.value = 'error'
    formMessage.value = error.message
  } finally {
    isSaving.value = false
  }
}

/* ========================================
   INITIAL LOAD
======================================== */

onMounted(() => {
  loadInstagramLinks()
})
</script>

<template>
  <section class="instagram-management">

    <div class="section-header">
      <div>
        <h2>Instagram Management</h2>

        <p class="section-description">
          Manage the four Instagram posts displayed
          on the CandyRific website.
        </p>
      </div>
    </div>

    <div
      v-if="isLoading"
      class="loading-message"
    >
      Loading Instagram links...
    </div>

    <form
      v-else
      class="instagram-form"
      @submit.prevent="saveInstagramLinks"
    >
      <div class="instagram-fields">

        <div
          v-for="(link, index) in instagramLinks"
          :key="index"
          class="instagram-field"
        >
          <div class="field-heading">

            <span class="field-number">
              {{ index + 1 }}
            </span>

            <label :for="`instagram-${index}`">
              Instagram Post {{ index + 1 }}
            </label>

          </div>

          <input
            :id="`instagram-${index}`"
            v-model="instagramLinks[index]"
            type="url"
            placeholder="https://www.instagram.com/p/..."
            autocomplete="off"
            :disabled="isSaving"
          >

          <p class="field-hint">
            Paste the Instagram post or reel URL.
          </p>

        </div>

      </div>

      <div class="form-footer">

        <p
          v-if="formMessage"
          class="form-message"
          :class="messageType"
          role="status"
        >
          {{ formMessage }}
        </p>

        <button
          type="submit"
          class="save-button"
          :disabled="isSaving"
        >
          {{
            isSaving
              ? 'Saving...'
              : 'Save Instagram Links'
          }}
        </button>

      </div>

    </form>

  </section>
</template>

<style scoped>
.instagram-management {
  width: 100%;
  font-family: inherit;
}

/* ========================================
   HEADER
======================================== */

.section-header {
  margin-bottom: 28px;
}

.section-header h2 {
  margin: 0 0 8px;
  color: #703795;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
}

.section-description {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* ========================================
   FORM
======================================== */

.instagram-form {
  width: 100%;
}

.instagram-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.instagram-field {
  padding: 22px;
  border: 1px solid #e8e0ef;
  border-radius: 14px;
  background: #fff;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.instagram-field:focus-within {
  border-color: #703795;
  box-shadow:
    0 0 0 3px rgba(112, 55, 149, 0.08);
}

/* ========================================
   FIELD HEADING
======================================== */

.field-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.field-number {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: rgba(112, 55, 149, 0.1);
  color: #703795;
  font-family: 'Fredoka', sans-serif;
  font-weight: 600;
}

.field-heading label {
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
}

/* ========================================
   INPUT
======================================== */

.instagram-field input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 12px 14px;
  border: 1px solid #dcdcdc;
  border-radius: 9px;
  background: #fff;
  color: #333;
  font: inherit;
  font-size: 0.9rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.instagram-field input:focus {
  outline: none;
  border-color: #703795;
  box-shadow:
    0 0 0 3px rgba(112, 55, 149, 0.1);
}

.instagram-field input::placeholder {
  color: #aaa;
}

.instagram-field input:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.field-hint {
  margin: 9px 0 0;
  color: #888;
  font-size: 0.78rem;
}

/* ========================================
   FOOTER
======================================== */

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 28px;
  padding-top: 22px;
  border-top: 1px solid #eee;
}

.save-button {
  padding: 12px 28px;
  border: none;
  border-radius: 9px;
  background: #703795;
  color: white;
  font-family: 'Fredoka', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.save-button:hover:not(:disabled) {
  background: #5c2b7f;
  transform: translateY(-1px);
}

.save-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* ========================================
   MESSAGES
======================================== */

.form-message {
  margin: 0;
  font-size: 0.9rem;
}

.form-message.success {
  color: #27824d;
}

.form-message.error {
  color: #d43b50;
}

.loading-message {
  padding: 30px 0;
  color: #777;
  text-align: center;
}

/* ========================================
   MOBILE
======================================== */

@media (max-width: 768px) {
  .instagram-fields {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .instagram-field {
    padding: 18px;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  .form-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .save-button {
    width: 100%;
  }
}
</style>
