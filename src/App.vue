<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavBarMain from './components/NavBarMain.vue'
import heroImage from './assets/loud-mouth-bites-award-hero.jpg'
import NavBarTop from './components/NavBarTop.vue'
import LandingPageWelcome from './components/LandingPageWelcome.vue';
import CarouselSectionWelcome from './components/CarouselSectionWelcome.vue';
import WelcomeBrands from './components/WelcomeBrands.vue';
import AmazonStoreFront from './components/AmazonStoreFront.vue';
import SiteFooter from './components/SiteFooter.vue';
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
    <WelcomeBrands />
    <AmazonStoreFront/>
    <SiteFooter/>
  </main>
</template>

<style scoped>

</style>
