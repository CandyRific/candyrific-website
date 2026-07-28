<script setup>

import WelcomeBrands from '../components/WelcomeBrands.vue'
import { RouterLink, RouterView } from 'vue-router'
import LandingPageWelcome from '../components/LandingPageWelcome.vue';
import CarouselSectionWelcome from '../components/CarouselSectionWelcome.vue';
import AmazonStoreFront from '../components/AmazonStoreFront.vue';


</script>

<template>
  <main id="main-content">

    
    <main>
    <LandingPageWelcome/>
    <CarouselSectionWelcome/>
    <RouterView />
    <WelcomeBrands />
    <AmazonStoreFront/>
    
  </main>

    </main>
    
</template>
