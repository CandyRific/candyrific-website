<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavBarMain from './components/NavBarMain.vue'
import heroImage from './assets/loud-mouth-bites-award-hero.jpg'
import NavBarTop from './components/NavBarTop.vue'
import LandingPageWelcome from './components/LandingPageWelcome.vue';
import CarouselSectionWelcome from './components/CarouselSectionWelcome.vue';
</script>

<template>
  
<header>
  <NavBarTop/>
  <NavBarMain/>
</header>
  
  
  <main>
    
    <LandingPageWelcome/>
    <CarouselSectionWelcome/>
    <RouterView />
  </main>
</template>

<style scoped>

</style>
