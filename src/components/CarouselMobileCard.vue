<template>
  <div
    class="carousel-mobile-slider"
    aria-label="Featured CandyRific content"
  >
    <article class="carousel-mobile-card">
      <a
        href="https://candyusa.com/cst/powerhouse-award-recipients-discussed-innovation/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Read about CandyRific's Powerhouse Award recognition"
      >
        <img
          src="../assets/Carousel_3Banners_V02-06.jpg"
          alt="CandyRific Powerhouse Award feature"
        />
      </a>
    </article>

    <article class="carousel-mobile-card">
      <a
        href="https://www.fivebelow.com/products/disney-stitch-candy-fan-028oz-9217410?variant=9217411&sr=1"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View the Disney Stitch Candy Fan"
      >
        <img
          src="../assets/Carousel_3Banners_V02-05.jpg"
          alt="Disney Stitch Candy Fan"
        />
      </a>
    </article>

    <article class="carousel-mobile-card">
      <div class="carousel-mobile-image">
        <img
          src="../assets/Carousel_3Banners_V02-04.jpg"
          alt="CandyRific featured product"
        />
      </div>
    </article>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* ========================================
   MOBILE SLIDER
======================================== */

.carousel-mobile-slider {
  display: flex;

  width: 100%;

  gap: 1rem;

  overflow-x: auto;
  overflow-y: hidden;

  padding:
    0
    max(
      1rem,
      calc((100vw - 34rem) / 2)
    )
    1rem;

  scroll-snap-type: x mandatory;

  scroll-padding-inline: 1rem;

  scrollbar-width: none;

  -webkit-overflow-scrolling: touch;
}

.carousel-mobile-slider::-webkit-scrollbar {
  display: none;
}


/* ========================================
   MOBILE CARD
======================================== */

.carousel-mobile-card {
  flex:
    0
    0
    min(82vw, 22rem);

  aspect-ratio: 2 / 3;

  overflow: hidden;

  border-radius: 1.25rem;

  scroll-snap-align: center;

  background: #ffffff;

  box-shadow:
    0 8px 22px rgba(53, 36, 84, 0.14);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.carousel-mobile-card a,
.carousel-mobile-image {
  display: block;

  width: 100%;
  height: 100%;
}


/* ========================================
   IMAGES
======================================== */

.carousel-mobile-card img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;
}


/* ========================================
   INTERACTION
======================================== */

.carousel-mobile-card:active {
  transform: scale(0.985);

  box-shadow:
    0 4px 12px rgba(53, 36, 84, 0.12);
}

.carousel-mobile-card a:focus-visible {
  outline:
    4px solid rgba(1, 174, 240, 0.5);

  outline-offset: -4px;

  border-radius: 1.25rem;
}


/* ========================================
   DESKTOP
======================================== */

@media (min-width: 768px) {
  .carousel-mobile-slider {
    display: none;
  }
}
</style>