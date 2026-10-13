<script setup>
import { ref } from 'vue'

import carouselLoud from '../assets/Carousel_WEB-01.jpg'
import carouselDummy from '../assets/Carousel_WEB-02.jpg'
import carousel169 from '../assets/Carousel_WEB-03.jpg'

import CarouselMobileCard from './CarouselMobileCard.vue'

const currentCarouselPosition = ref(0)

const carouselImages = [
  carouselLoud,
  carouselDummy,
  carousel169
]

function handleForwardArrowClick() {
  if (
    currentCarouselPosition.value <
    carouselImages.length - 1
  ) {
    currentCarouselPosition.value++
  }
}

function handleBackArrowClick() {
  if (currentCarouselPosition.value > 0) {
    currentCarouselPosition.value--
  }
}

function goToSlide(index) {
  currentCarouselPosition.value = index
}
</script>

<template>
  <section class="carousel-wrapper">
    <div class="carousel-container">

      <!-- Mobile version -->
      <CarouselMobileCard />

      <!-- Desktop version -->
      <div class="carousel-desktop">
        <div class="carousel-section">

          <div class="arrow-container-left">
            <button
              class="carousel-arrow back-arrow"
              type="button"
              aria-label="Previous slide"
              :disabled="currentCarouselPosition === 0"
              @click="handleBackArrowClick"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                aria-hidden="true"
              >
                <path
                  d="M201.4 297.4C188.9 309.9 188.9 330.2 201.4 342.7L361.4 502.7C373.9 515.2 394.2 515.2 406.7 502.7C419.2 490.2 419.2 469.9 406.7 457.4L269.3 320L406.6 182.6C419.1 170.1 419.1 149.8 406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3L201.3 297.3z"
                />
              </svg>
            </button>
          </div>

          <div class="carousel-image-section">
            <div
              class="carousel-image-track"
              :style="{
                transform: `translateX(-${currentCarouselPosition * 100}%)`
              }"
            >
              <img
                v-for="(image, index) in carouselImages"
                :key="index"
                class="carousel-image"
                :src="image"
                :alt="`CandyRific featured banner ${index + 1}`"
              />
            </div>
          </div>

          <div class="arrow-container-right">
            <button
              class="carousel-arrow forward-arrow"
              type="button"
              aria-label="Next slide"
              :disabled="
                currentCarouselPosition ===
                carouselImages.length - 1
              "
              @click="handleForwardArrowClick"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                aria-hidden="true"
              >
                <path
                  d="M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z"
                />
              </svg>
            </button>
          </div>

        </div>

        <div
          class="carousel-circles"
          aria-label="Carousel navigation"
        >
          <button
            v-for="(_, index) in carouselImages"
            :key="index"
            type="button"
            class="carousel-circle"
            :class="{
              'carousel-circle-background':
                currentCarouselPosition === index
            }"
            :aria-label="`Go to slide ${index + 1}`"
            :aria-current="
              currentCarouselPosition === index
                ? 'true'
                : undefined
            "
            @click="goToSlide(index)"
          ></button>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* ========================================
   SECTION WRAPPER
======================================== */

.carousel-wrapper {
  position: relative;

  width: 100%;

  background: #ffffff;

  padding:
    clamp(2.75rem, 5vw, 4.5rem)
    clamp(1rem, 3vw, 2rem);

  border-bottom:
    1px solid rgba(112, 55, 149, 0.1);
}


/* ========================================
   CONTENT CONTAINER
======================================== */

.carousel-container {
  width: 100%;
  max-width: 1400px;

  margin: 0 auto;
}


/* ========================================
   DESKTOP CAROUSEL
======================================== */

.carousel-desktop {
  display: none;
}


/* ========================================
   CAROUSEL LAYOUT
======================================== */

.carousel-section {
  display: grid;

  grid-template-columns:
    minmax(3.5rem, 0.75fr)
    minmax(0, 9fr)
    minmax(3.5rem, 0.75fr);

  align-items: center;

  width: 100%;
}


/* ========================================
   IMAGE AREA
======================================== */

.carousel-image-section {
  width: 100%;

  overflow: hidden;

  border-radius: 1.25rem;

  box-shadow:
    0 10px 28px rgba(53, 36, 84, 0.1);
}


/* ========================================
   IMAGE TRACK
======================================== */

.carousel-image-track {
  display: flex;

  width: 100%;

  transition:
    transform 0.5s ease-in-out;

  will-change: transform;
}


/* ========================================
   IMAGES
======================================== */

.carousel-image {
  display: block;

  flex: 0 0 100%;

  width: 100%;
  height: auto;

  object-fit: contain;
}


/* ========================================
   ARROW CONTAINERS
======================================== */

.arrow-container-left,
.arrow-container-right {
  display: flex;

  align-items: center;

  width: 100%;
  height: 100%;
}

.arrow-container-left {
  justify-content: center;
}

.arrow-container-right {
  justify-content: center;
}


/* ========================================
   ARROW BUTTONS
======================================== */

.carousel-arrow {
  display: flex;

  align-items: center;
  justify-content: center;

  width: clamp(3rem, 4vw, 4rem);
  height: clamp(3rem, 4vw, 4rem);

  padding: 0;

  border: none;
  border-radius: 50%;

  background: transparent;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    opacity 0.2s ease;
}

.carousel-arrow svg {
  width: 70%;
  height: 70%;
}

.back-arrow svg {
  fill: #703795;
}

.forward-arrow svg {
  fill: #01aef0;
}

.carousel-arrow:hover:not(:disabled) {
  transform: scale(1.12);

  background:
    rgba(112, 55, 149, 0.06);
}

.carousel-arrow:active:not(:disabled) {
  transform: scale(0.96);
}

.carousel-arrow:focus-visible {
  outline:
    3px solid rgba(1, 174, 240, 0.35);

  outline-offset: 4px;
}

.carousel-arrow:disabled {
  opacity: 0.25;

  cursor: default;
}


/* ========================================
   INDICATOR DOTS
======================================== */

.carousel-circles {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 0.65rem;

  margin-top: 1.5rem;
}

.carousel-circle {
  width: 0.9rem;
  height: 0.9rem;

  padding: 0;

  border:
    2px solid #703795;

  border-radius: 50%;

  background: transparent;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.carousel-circle:hover {
  transform: scale(1.15);
}

.carousel-circle-background {
  background: #703795;
}

.carousel-circle:focus-visible {
  outline:
    3px solid rgba(1, 174, 240, 0.3);

  outline-offset: 3px;
}


/* ========================================
   TABLET / DESKTOP
======================================== */

@media (min-width: 768px) {
  .carousel-desktop {
    display: block;
  }
}


/* ========================================
   LARGE DESKTOP
======================================== */

@media (min-width: 1200px) {
  .carousel-section {
    grid-template-columns:
      minmax(4rem, 0.75fr)
      minmax(0, 10fr)
      minmax(4rem, 0.75fr);
  }

  .carousel-image-section {
    border-radius: 1.5rem;
  }
}
</style>