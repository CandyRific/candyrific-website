<script setup>
import { onMounted, ref } from 'vue'
import { acceptInvite, handleAuthCallback } from '@netlify/identity'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const inviteToken = ref(null)
const isInviteMode = ref(false)
const inviteMessage = ref('')
const isAcceptingInvite = ref(false)

const handleLogin = async () => {
  const success = await authStore.loginUser(
    email.value,
    password.value
  )

  if (success) {
    email.value = ''
    password.value = ''
  }
}

const handleInvite = async () => {
  inviteMessage.value = ''

  if (!password.value) {
    inviteMessage.value = 'Password is required.'
    return
  }

  if (password.value !== confirmPassword.value) {
    inviteMessage.value = 'Passwords do not match.'
    return
  }

  isAcceptingInvite.value = true

  try {
    const user = await acceptInvite(
      inviteToken.value,
      password.value
    )

    authStore.currentUser = user

    inviteMessage.value = 'Account created successfully.'

    password.value = ''
    confirmPassword.value = ''
    inviteToken.value = null
    isInviteMode.value = false
  } catch (error) {
    console.error('Invite acceptance failed:', error)

    inviteMessage.value =
      error.message || 'Unable to accept invitation.'
  } finally {
    isAcceptingInvite.value = false
  }
}

onMounted(async () => {
  try {
    const result = await handleAuthCallback()

    if (result?.type === 'invite' && result.token) {
      inviteToken.value = result.token
      isInviteMode.value = true
    }
  } catch (error) {
    console.error('Auth callback failed:', error)

    inviteMessage.value =
      error.message || 'Unable to process invitation.'
  }
})
</script>

<template>
  <div class="login-page">

    <h1 class="title-div">
      {{ isInviteMode ? 'Create Account' : 'Login' }}
    </h1>

    <div class="admin-login">

      <!-- ========================================
           LOGGED IN
      ========================================= -->

      <div
        v-if="authStore.currentUser"
        class="logged-in"
      >
        <p>
          Logged in as
          <strong>
            {{ authStore.currentUser.email }}
          </strong>
        </p>

        <button
          type="button"
          @click="authStore.logoutUser"
        >
          Log Out
        </button>
      </div>


      <!-- ========================================
           INVITE ACCEPTANCE
      ========================================= -->

      <form
        v-else-if="isInviteMode"
        class="login-form"
        @submit.prevent="handleInvite"
      >

        <p class="invite-text">
          You've been invited to CandyRific.
          Create a password to finish setting up your account.
        </p>

        <div class="form-group">
          <label for="invite-password">
            Password
          </label>

          <input
            id="invite-password"
            v-model="password"
            type="password"
            autocomplete="new-password"
            required
          >
        </div>

        <div class="form-group">
          <label for="confirm-password">
            Confirm Password
          </label>

          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            required
          >
        </div>

        <button
          type="submit"
          :disabled="isAcceptingInvite"
        >
          {{
            isAcceptingInvite
              ? 'Creating Account...'
              : 'Create Account'
          }}
        </button>

        <p
          v-if="inviteMessage"
          class="auth-message"
        >
          {{ inviteMessage }}
        </p>

      </form>


      <!-- ========================================
           NORMAL LOGIN
      ========================================= -->

      <form
        v-else
        class="login-form"
        @submit.prevent="handleLogin"
      >

        <div class="form-group">
          <label for="admin-email">
            Email
          </label>

          <input
            id="admin-email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
          >
        </div>

        <div class="form-group">
          <label for="admin-password">
            Password
          </label>

          <input
            id="admin-password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
          >
        </div>

        <button
          type="submit"
          :disabled="authStore.isLoading"
        >
          {{
            authStore.isLoading
              ? 'Logging in...'
              : 'Log In'
          }}
        </button>

        <p
          v-if="authStore.authMessage"
          class="auth-message"
        >
          {{ authStore.authMessage }}
        </p>

      </form>

    </div>

  </div>
</template>

<style scoped>

.login-page {
  min-height: 100vh;

  background: #e6f4fd;
}


/* ========================================
   PAGE TITLE
======================================== */

.title-div {
  margin: 0;

  padding: clamp(1.5rem, 3vw, 3rem);

  text-align: center;

  color: #703795;

  font-size: clamp(3.25rem, 5vw, 6rem);
  line-height: 1;
  font-weight: 600;
  font-family: 'Fredoka', sans-serif;
}


/* ========================================
   LOGIN CARD
======================================== */

.admin-login {
  width: min(90%, 40rem);

  margin: 0 auto 2rem;
  padding: 1.5rem;

  background: white;

  border-radius: 10px;

  font-family: 'Fredoka', sans-serif;
}


/* ========================================
   LOGIN FORM
======================================== */

.login-form {
  display: flex;
  flex-direction: column;

  gap: 1rem;
}

.invite-text {
  margin: 0 0 0.5rem;

  color: #703795;

  line-height: 1.5;
}

.form-group {
  display: flex;
  flex-direction: column;

  gap: 0.4rem;
}

.form-group label {
  color: #703795;

  font-weight: 500;
}

.form-group input {
  padding: 0.75rem;

  font: inherit;

  border: 1px solid #ccc;
  border-radius: 6px;
}


/* ========================================
   BUTTONS
======================================== */

button {
  width: fit-content;

  padding: 0.75rem 1.25rem;

  background: #703795;

  color: white;

  border: none;
  border-radius: 6px;

  font: inherit;
  font-weight: 500;

  cursor: pointer;
}

button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}


/* ========================================
   LOGGED IN STATE
======================================== */

.logged-in {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;
}


/* ========================================
   AUTH MESSAGE
======================================== */

.auth-message {
  margin: 0.5rem 0 0;

  color: #703795;
}

</style>