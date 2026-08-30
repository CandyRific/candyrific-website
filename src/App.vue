<script setup>
import { RouterView } from 'vue-router'
import NavBarMain from './components/NavBarMain.vue';
import NavBarTop from './components/NavBarTop.vue';
import SiteFooter from './components/SiteFooter.vue';
import MobileNav from './components/MobileNav.vue';

</script>

<template>
  
<header>
  <NavBarTop/>
  <NavBarMain/>
</header>

<main>
  <RouterView />
</main>
  
  
  <SiteFooter/>
  <!-- <MobileNav/> -->
</template>

<style scoped>


</style>
