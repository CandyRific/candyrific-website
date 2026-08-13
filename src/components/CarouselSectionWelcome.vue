<script setup>
import { ref } from 'vue'

import carouselLoud from '../assets/Carousel_WEB-01.jpg'
import carouselDummy from '../assets/Carousel_WEB-02.jpg'
import carousel169 from '../assets/Carousel_WEB-03.jpg'

import CarouselMobileCard from './CarouselMobileCard.vue'

const currentCarouselPosition = ref(0)

const carouselItems = [
  {
    image: carouselLoud,
    link: 'https://candyusa.com/cst/powerhouse-award-recipients-discussed-innovation/',
    alt: 'CandyRific Powerhouse Award'
  },
  {
    image: carouselDummy,
    link: 'https://www.fivebelow.com/products/disney-stitch-candy-fan-028oz-9217410?variant=9217411&sr=1',
    alt: 'Disney Stitch Candy Fan'
  },
  {
    image: carousel169,
    link: 'https://www.dreamworks.com/shrek',
    alt: 'Shrek'
  }
]

function handleForwardArrowClick() {
  if (currentCarouselPosition.value < carouselItems.length - 1) {
    currentCarouselPosition.value++
  }
}

function handleBackArrowClick() {
  if (currentCarouselPosition.value > 0) {
    currentCarouselPosition.value--
  }
}
</script>

<template>

  <CarouselMobileCard />

  <div class="carousel-plus-circles">

    <div class="carousel-section">

      <!-- LEFT ARROW -->
      <div class="arrow-container-left">
        <button
          class="back-arrow"
          type="button"
          aria-label="Previous slide"
          @click="handleBackArrowClick"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            aria-hidden="true"
          >
            <path
              fill="rgb(112, 55, 149)"
              d="M201.4 297.4C188.9 309.9 188.9 330.2 201.4 342.7L361.4 502.7C373.9 515.2 394.2 515.2 406.7 502.7C419.2 490.2 419.2 469.9 406.7 457.4L269.3 320L406.6 182.6C419.1 170.1 419.1 149.8 406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3L201.3 297.3z"
            />
          </svg>
        </button>
      </div>


      <!-- ONE CARD ONLY -->
      <div class="carousel-image-section">

        <a
          :href="carouselItems[currentCarouselPosition].link"
          target="_blank"
          rel="noopener noreferrer"
          class="carousel-card"
        >
          <img
            class="carousel-image"
            :src="carouselItems[currentCarouselPosition].image"
            :alt="carouselItems[currentCarouselPosition].alt"
          />
        </a>

      </div>


      <!-- RIGHT ARROW -->
      <div class="arrow-container-right">
        <button
          class="forward-arrow"
          type="button"
          aria-label="Next slide"
          @click="handleForwardArrowClick"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            aria-hidden="true"
          >
            <path
              fill="rgb(1, 174, 240)"
              d="M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z"
            />
          </svg>
        </button>
      </div>

    </div>


    <!-- CIRCLES -->
    <div class="carousel-circles">

      <div
        class="carousel-circle"
        :class="{
          'carousel-circle-background': currentCarouselPosition === 0
        }"
      ></div>

      <div
        class="carousel-circle"
        :class="{
          'carousel-circle-background': currentCarouselPosition === 1
        }"
      ></div>

      <div
        class="carousel-circle"
        :class="{
          'carousel-circle-background': currentCarouselPosition === 2
        }"
      ></div>

    </div>

  </div>

</template>

<style scoped>

.carousel-plus-circles {
  display: grid;
  grid-template-rows: auto 50px;

  margin: 2rem 1rem;
}


/* ========================================
   CAROUSEL
======================================== */

.carousel-section {
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 8fr 1fr;

  align-items: center;
}


/* ========================================
   IMAGE SECTION
======================================== */

.carousel-image-section {
  width: 100%;

  display: flex;
  justify-content: center;

  overflow: hidden;
}

.carousel-card {
  display: block;

  width: 100%;

  text-decoration: none;
}

.carousel-image {
  display: block;

  width: 100%;
  height: auto;

  max-height: 375px;

  object-fit: contain;
}


/* ========================================
   ARROWS
======================================== */

.arrow-container-left {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.arrow-container-right {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.back-arrow,
.forward-arrow {
  display: flex;
  align-items: center;
  justify-content: center;

  width: clamp(2.5rem, 5vw, 4rem);
  height: clamp(2.5rem, 5vw, 4rem);

  padding: 0;

  border: none;
  background: transparent;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.back-arrow svg,
.forward-arrow svg {
  width: 100%;
  height: 100%;
}

.back-arrow:hover,
.forward-arrow:hover {
  transform: scale(1.15);
}

.back-arrow:active,
.forward-arrow:active {
  transform: scale(0.95);
}


/* ========================================
   CIRCLES
======================================== */

.carousel-circles {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;
}

.carousel-circle {
  width: 20px;
  height: 20px;

  border-radius: 50%;
  border: 2px solid rgb(112, 55, 149);
}

.carousel-circle-background {
  background-color: rgb(112, 55, 149);
}


/* ========================================
   MOBILE
======================================== */

@media (max-width: 767px) {

  .carousel-plus-circles {
    display: none;
  }

}

</style>