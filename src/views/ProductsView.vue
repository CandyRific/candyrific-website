<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import BrandBanner from './components/BrandBanner.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" src="@/assets/logo.svg" width="125" height="125" />
    <p> This is like the layout as anything on here will appear on all pages</p>
    <div >
      <HelloWorld msg="You did it!" />
      <BrandBanner />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

</style>
