<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import WelcomeProducts from './components/WelcomeProducts.vue'
import WelcomeItem from './components/WelcomeItem.vue'
import WelcomeBrands from './components/WelcomeBrands.vue'
import image from './assets/candyrific_logo.png'
import heroImage from './assets/loud-mouth-bites-award-hero.jpg'
</script>

<template>
  <header>
    <!-- <img alt="Vue logo" src="@/assets/logo.svg" width="125" height="125" />
    <p> This is like the layout as anything on here will appear on all pages</p>
    <div >
      <HelloWorld msg="You did it!" />
      <BrandBanner />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div> -->

    
    <div class="header-inner"> 
  <a class="logo-link" href="#" aria-label="Candyrific home"> 
    <img class="site-logo" :src="image" alt="Candyrific" /> 
  </a>


      <input class="nav-toggle" type="checkbox" id="nav-toggle" aria-label="Toggle navigation menu" />
      <label class="nav-toggle-label" for="nav-toggle">
        <span></span>
        <span></span>
        <span></span>
      </label>

      <nav class="site-nav" aria-label="Main navigation">
        <ul class="nav-list">
              <li><a href="#brands">Brands</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#wheretobuy">Where to buy</a></li>
              <li><a href="#contact">Contact Us</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main id="main-content">

    <section class="hero-section" aria-label="Candyrific Loud Mouth Bites award hero image">
      <img
        class="hero-image"
        :src="heroImage"
        alt="Candyrific Loud Mouth Bites, 2026 Powerhouse Award Candy Winner"
      />
    </section>
    <WelcomeBrands />
    <!-- <WelcomeProducts /> -->
    
  </main>
</template>

<style scoped>

</style>
