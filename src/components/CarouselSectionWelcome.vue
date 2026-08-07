<script setup>
import { ref } from 'vue'

const currentCarouselPosition = ref(0)

const carouselImages = [
  '/src/assets/carousel_image_loud.png',
  '/src/assets/carousel_dummy.jpg',
  '/src/assets/16-9carousel.jpg'
]

function handleForwardArrowClick() {
  if (currentCarouselPosition.value < carouselImages.length - 1) {
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
  <div class="carousel-section">

    <div class="arrow-container">
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
          :alt="`Carousel image ${index + 1}`"
        />
      </div>
    </div>


    <div class="arrow-container">
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
</template>

<style scoped>
.carousel-section {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 8fr 1fr;
  align-items: center;
  overflow: hidden;
}



.carousel-image-section {
  width: 100%;
  overflow: hidden;
  
}



.carousel-image-track {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;

  width: 100%;

  transition: transform 0.5s ease;
}



.carousel-image {
  flex: 0 0 100%;

  width: 100%;
  height: auto;

  display: block;

  object-fit: contain;
}



.arrow-container {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
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



@media (max-width: 767px) {
  .carousel-section {
    grid-template-columns: 0.8fr 8.4fr 0.8fr;
  }

  .back-arrow,
  .forward-arrow {
    width: clamp(2rem, 8vw, 3rem);
    height: clamp(2rem, 8vw, 3rem);
  }
}
</style>