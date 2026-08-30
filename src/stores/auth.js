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
  const authMessage = ref('')

  const initializeAuth = async () => {
    try {
      const callbackResult = await handleAuthCallback()

      if (callbackResult?.user) {
        currentUser.value = callbackResult.user
        return
      }

      currentUser.value = await getUser()
    } catch (error) {
      console.error('Auth initialization failed:', error)
    }
  }

  const loginUser = async (email, password) => {
    authMessage.value = ''
    isLoading.value = true

    try {
      currentUser.value = await login(email, password)

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
    authMessage,
    initializeAuth,
    loginUser,
    logoutUser
  }
})