<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import BrandBanner from './components/BrandBanner.vue'
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
    <WelcomeItem />
    <!-- <section class="intro-section" aria-labelledby="intro-title">

      <div class="intro-copy">
        <p class="eyebrow">2026 Powerhouse Award Candy Winner</p>
        <h1 id="intro-title">Award-winning innovation with a seriously loud bite.</h1>
        <p>
          Welcome to the home of the candy<strong>experience</strong> company!
        </p>
      </div>

      <div class="quick-award-card" id="award">
        <span aria-hidden="true">★</span>
        <p>
          <strong>Loud Mouth Bites</strong><br />
          Most Innovative New Products — Candy Winner
        </p>
      </div>
    </section> -->

    <section class="hero-section" aria-label="Candyrific Loud Mouth Bites award hero image">
      <img
        class="hero-image"
        :src="heroImage"
        alt="Candyrific Loud Mouth Bites, 2026 Powerhouse Award Candy Winner"
      />
    </section>

    <WelcomeProducts />
    <WelcomeBrands />

    <section class="award-strip" aria-label="Award announcement">
      <div class="award-card">
        <span class="award-badge" aria-hidden="true">★</span>
        <div>
          <h2>Powerhouse Award Winner</h2>
          <p>
            Loud Mouth Bites won the 2026 Powerhouse Award in candy for Most Innovative New Products.
          </p>
        </div>
      </div>
    </section>

    <section class="hero-section" aria-label="Brands that Candyrific carries">
      <h2>Brands </h2>
      <div class="hero-image">
        <BrandBanner/>
        </div>
      <button> View products by brand</button>
      <button> View all brands </button>
    </section>

    <section class="content-section" id="loud-mouth-bites" aria-labelledby="loud-mouth-title">
      <div class="section-heading">
        <p class="eyebrow">Warheads Loud Mouth Bites</p>
        <h2 id="loud-mouth-title">Sour, crispy, crunchy, and built to pop.</h2>
        <p>
          Loud Mouth Bites bring signature WARHEADS intensity into a bold chewable format that does not hold back.
          The sour hit is immediate, aggressive, and deeply satisfying — not for the faint of heart.
        </p>
      </div>

      <div class="feature-grid" id="featured">
        <article class="feature-card">
          <h3>Award Winner</h3>
          <p>Recognized as a 2026 Powerhouse Award Candy Winner for Most Innovative New Products.</p>
        </article>

        <article class="feature-card">
          <h3>Flavor Lineup</h3>
          <p>Green apple, watermelon, and blue raspberry deliver a colorful, sour, pop-culture-ready candy experience.</p>
        </article>

        <article class="feature-card">
          <h3>Fully Stocked</h3>
          <p>The website is getting upgraded, but Candyrific products and inventory are still ready to move.</p>
        </article>
      </div>
    </section>
  </main>


  <!-- <RouterView /> -->
  <!-- <BrandBanner /> -->
</template>

<style scoped>

</style>
