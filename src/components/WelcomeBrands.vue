
<script setup>
import BrandBanner from './BrandBanner.vue'
</script>

<template>
  <section
    class="welcome-section"
    aria-label="Candyrific Loud Mouth Bites award hero image"
  >
    <div class="inner-welcome">
      <h2 class="brand-heading">
        Name Brands.
      </h2>

      <div class="brand-banner-wrap">
        <BrandBanner />
      </div>

      
      <div>
        <button class="button-style">Shop by brand</button>
        <button class="button-style">View all brands</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.button-style {
    border-radius: 25px;
    /* Soft gloss gradient layered on top of your #fad141 yellow */
    background: linear-gradient(
        to bottom, 
        rgba(255, 255, 255, 0.4) 0%, 
        rgba(255, 255, 255, 0) 50%, 
        rgba(0, 0, 0, 0.05) 50%, 
        rgba(0, 0, 0, 0.1) 100%
    ), #fad141;
    border: 2px solid #000000;
    color: #000000;
    font-weight: bold; /* Improves readability on bright yellow */
    padding: 1rem 2rem;
    margin: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: all 0.2s ease; /* Makes the hover transition smooth */
}

.button-style:hover {
    /* Maintains the black border structure while darkening the background */
    background: linear-gradient(
        to bottom, 
        rgba(255, 255, 255, 0.5) 0%, 
        rgba(255, 255, 255, 0) 50%, 
        rgba(0, 0, 0, 0.05) 50%, 
        rgba(0, 0, 0, 0.15) 100%
    ), #e0b826; /* Darker, richer gold on hover */
    border: 2px solid #000000; /* Kept black so the button edge stays sharp */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25); /* Increases shadow to look lifted */
    transform: translateY(-2px); /* Physical lift effect */
}

.button-style:active {
    transform: translateY(1px); /* Sinks down slightly when clicked */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}


.welcome-section {
  width: min(var(--max-width), calc(100% - 2rem));
  margin: 16px auto 0;
}

.inner-welcome {
  width: 100%;
  min-height: clamp(420px, 58vw, 720px);
  padding: clamp(1.25rem, 3vw, 2.5rem);

  background: #fad141;

  display: flex;
  flex-direction: column;
  align-items: center;
}


.brand-heading {
  margin: 0 0 clamp(1.25rem, 3vw, 2.25rem);

  width: 100%;

  color: #fad141;

  font-family: "Arial Black", "Trebuchet MS", Impact, Arial, sans-serif;
  font-size: clamp(2.25rem, 7vw, 6rem);
  line-height: 0.95;
  letter-spacing: -0.06em;
  text-align: center;
  text-transform: uppercase;

  /*
    Main text stays yellow.
    Darker yellow/brown shadows create the pressed-in look.
  */
  text-shadow:
    1px 1px 0 rgba(255, 255, 255, 0.45),
    -1px -1px 0 rgba(121, 82, 0, 0.85),
    -2px -2px 0 rgba(121, 82, 0, 0.45),
    0 3px 8px rgba(121, 82, 0, 0.28);
}



.brand-banner-wrap {
  width: min(100%, 1080px);
  margin-inline: auto;
}

.products-placeholder {
  width: min(100%, 1080px);
  margin: clamp(1.5rem, 4vw, 3rem) auto 0;

  color: #4f3900;

  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 800;
  line-height: 1.5;
  text-align: center;
}

@media (max-width: 700px) {
  .welcome-section {
    width: min(100% - 1rem, var(--max-width));
    margin-top: 8px;
  }

  .inner-welcome {
    padding: 1rem;
  }

  .brand-heading {
    margin-bottom: 1rem;
    letter-spacing: -0.04em;
  }

  .brand-banner-wrap {
    width: 100%;
  }
}
</style>

