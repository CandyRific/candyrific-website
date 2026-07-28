<script setup>
import { computed, onMounted, ref } from 'vue'

const currentUser = ref({
  authenticated: false,
  roles: [],
})

const broker = ref({
  displayName: '',
  email: '',
  temporaryPassword: '',
})

const result = ref('')
const submitting = ref(false)

const isBrokerAdmin = computed(() =>
  currentUser.value.roles.includes('BrokerAdmin'),
)

async function loadCurrentUser() {
  result.value = ''

  try {
    const response = await fetch('/api/me', {
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(
        `Unable to read the session: ${response.status}`,
      )
    }

    currentUser.value = await response.json()
  } catch (error) {
    result.value =
      error instanceof Error
        ? error.message
        : 'Unable to load the current user.'
  }
}

function login() {
  window.location.assign('/auth/login')
}

function logout() {
  window.location.assign('/auth/logout')
}

async function createBroker() {
  result.value = ''
  submitting.value = true

  try {
    const response = await fetch('/api/admin/brokers', {
      method: 'POST',
      credentials: 'include',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(broker.value),
    })

    const responseText = await response.text()

    if (!response.ok) {
      throw new Error(
        responseText ||
          `Broker creation failed: ${response.status}`,
      )
    }

    result.value = responseText

    broker.value = {
      displayName: '',
      email: '',
      temporaryPassword: '',
    }
  } catch (error) {
    result.value =
      error instanceof Error
        ? error.message
        : 'Unable to create the broker.'
  } finally {
    submitting.value = false
  }
}

onMounted(loadCurrentUser)
</script>

<template>
  <main class="broker-demo">
    <h1>CandyRific Broker Portal</h1>

    <section v-if="!currentUser.authenticated">
      <p>You are not signed in.</p>

      <button type="button" @click="login">
        Sign in
      </button>
    </section>

    <section v-else>
      <p>
        Signed in as:
        {{ currentUser.name || currentUser.email }}
      </p>

      <p>
        Roles:
        {{ currentUser.roles.join(', ') || 'None' }}
      </p>

      <button type="button" @click="logout">
        Sign out
      </button>
    </section>

    <form
      v-if="isBrokerAdmin"
      @submit.prevent="createBroker"
    >
      <h2>Create broker identity</h2>

      <label>
        Display name

        <input
          v-model.trim="broker.displayName"
          required
        />
      </label>

      <label>
        Email

        <input
          v-model.trim="broker.email"
          type="email"
          required
        />
      </label>

      <label>
        Temporary password

        <input
          v-model="broker.temporaryPassword"
          type="password"
          minlength="12"
          required
        />
      </label>

      <button type="submit" :disabled="submitting">
        {{
          submitting
            ? 'Creating broker...'
            : 'Create broker'
        }}
      </button>
    </form>

    <pre v-if="result">{{ result }}</pre>
  </main>
</template>