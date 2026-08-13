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
@media (min-width: 768px){
  main{
    margin-top: 135px;
  }
  
}

h1 {
  font-weight: 600;
  font-size: clamp(3rem, 4rem, 4rem);
}
</style>
