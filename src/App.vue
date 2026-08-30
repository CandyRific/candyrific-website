<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

import NavBarMain from './components/NavBarMain.vue'
import NavBarTop from './components/NavBarTop.vue'
import SiteFooter from './components/SiteFooter.vue'
import MobileNav from './components/MobileNav.vue'

import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initializeAuth()
})
</script>

<template>

  <header>
    <NavBarTop />
    <NavBarMain />
  </header>

  <main>
    <RouterView />
  </main>

  <SiteFooter />

</template>

<style scoped>
</style>