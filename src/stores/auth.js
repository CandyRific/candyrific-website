import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
  login,
  logout,
  getUser,
  handleAuthCallback
} from '@netlify/identity'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)
  const authMessage = ref('')

  const initializeAuth = async () => {
    if (isInitialized.value) {
      return
    }

    try {
      const callbackResult = await handleAuthCallback()

      if (callbackResult?.user) {
        currentUser.value = callbackResult.user
        return
      }

      currentUser.value = await getUser()
    } catch (error) {
      console.error('Auth initialization failed:', error)

      currentUser.value = null
    } finally {
      isInitialized.value = true
    }
  }

  const loginUser = async (email, password) => {
    authMessage.value = ''
    isLoading.value = true

    try {
      currentUser.value = await login(
        email,
        password
      )

      isInitialized.value = true
      authMessage.value = 'Logged in successfully.'

      return true
    } catch (error) {
      console.error('Login failed:', error)

      authMessage.value =
        error.message || 'Unable to log in.'

      return false
    } finally {
      isLoading.value = false
    }
  }

  const logoutUser = async () => {
    try {
      await logout()

      currentUser.value = null
      isInitialized.value = true

      authMessage.value = 'Logged out.'
    } catch (error) {
      console.error('Logout failed:', error)

      authMessage.value =
        error.message || 'Unable to log out.'
    }
  }

  return {
    currentUser,
    isLoading,
    isInitialized,
    authMessage,
    initializeAuth,
    loginUser,
    logoutUser
  }
})