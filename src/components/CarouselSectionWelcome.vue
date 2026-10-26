
<script setup>
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref
} from 'vue'

import CarouselMobileCard from './CarouselMobileCard.vue'

/* ========================================
   CONFIGURATION
======================================== */

const DESKTOP_VIEWPORT_ID = 2

/* ========================================
   STATE
======================================== */

const carouselItems = ref([])
const currentCarouselPosition = ref(0)
const isLoading = ref(true)
const loadError = ref('')

let controller = null

/* ========================================
   DESKTOP ITEMS
======================================== */

const desktopItems = computed(() => {
  return carouselItems.value
    .map((item) => {
      const image = item.images?.find(
        (image) =>
          Number(image.viewport_id) ===
          DESKTOP_VIEWPORT_ID
      )

      if (!image?.image_key) return null

      return {
        id: item.id,
        hyperlink: item.hyperlink || null,
        imageKey: image.image_key
      }
    })
    .filter(Boolean)
})

/* ========================================
   IMAGE URL
======================================== */

const getImageUrl = (key) => {
  return (
    '/.netlify/functions/carousel-image?key=' +
    encodeURIComponent(key)
  )
}

/* ========================================
   LOAD CAROUSEL ITEMS
======================================== */

const loadCarouselItems = async () => {
  controller = new AbortController()

  isLoading.value = true
  loadError.value = ''

  try {
    const response = await fetch(
      '/.netlify/functions/carousel-items',
      {
        signal: controller.signal
      }
    )

    if (!response.ok) {
      throw new Error(
        'Unable to load carousel content.'
      )
    }

    const data = await response.json()

    carouselItems.value = Array.isArray(data)
      ? data.sort(
          (a, b) =>
            Number(a.display_order) -
            Number(b.display_order)
        )
      : []

    currentCarouselPosition.value = 0
  } catch (error) {
    if (error.name === 'AbortError') return

    console.error(
      'Error loading homepage carousel:',
      error
    )

    loadError.value = error.message
  } finally {
    isLoading.value = false
  }
}

/* ========================================
   INFINITE NAVIGATION
======================================== */

const goToSlide = (index) => {
  const count = desktopItems.value.length

  if (!count) return

  currentCarouselPosition.value =
    ((index % count) + count) % count
}

const handleForwardArrowClick = () => {
  goToSlide(currentCarouselPosition.value + 1)
}

const handleBackArrowClick = () => {
  goToSlide(currentCarouselPosition.value - 1)
}

/* ========================================
   KEYBOARD NAVIGATION
======================================== */

const handleKeydown = (event) => {
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    handleForwardArrowClick()
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    handleBackArrowClick()
  }
}

/* ========================================
   LIFECYCLE
======================================== */

onMounted(loadCarouselItems)

onUnmounted(() => {
  controller?.abort()
})
</script>

<template>
  <section
    class="carousel-wrapper"
    aria-labelledby="carousel-section-title"
  >
    <div class="carousel-container">

      <!-- SECTION HEADING -->
      <h2
        id="carousel-section-title"
        class="carousel-title"
      >
        Check This Out
      </h2>

      <!-- MOBILE VERSION -->
      <CarouselMobileCard
        :carousel-items="carouselItems"
      />

      <!-- DESKTOP VERSION -->
      <div
        v-if="desktopItems.length > 0"
        class="carousel-desktop"
        @keydown="handleKeydown"
      >
        <div class="carousel-section">

          <!-- PREVIOUS ARROW -->
          <div class="arrow-container-left">
            <button
              class="carousel-arrow back-arrow"
              type="button"
              aria-label="Previous slide"
              :disabled="desktopItems.length <= 1"
              @click="handleBackArrowClick"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                aria-hidden="true"
              >
                <path
                  d="M201.4 297.4C188.9 309.9 188.9 330.2 201.4 342.7L361.4 502.7C373.9 515.2 394.2 515.2 406.7 502.7C419.2 490.2 419.2 469.9 406.7 457.4L269.3 320L406.6 182.6C419.1 170.1 419.1 149.8 406.6 137.3L201.3 297.3z"
                />
              </svg>
            </button>
          </div>

          <!-- IMAGE AREA -->
          <div class="carousel-image-section">
            <div
              class="carousel-image-track"
              :style="{
                transform: `translateX(-${currentCarouselPosition * 100}%)`
              }"
            >
              <div
                v-for="(item, index) in desktopItems"
                :key="item.id"
                class="carousel-slide"
              >
                <!-- CLICKABLE IMAGE -->
                <a
                  v-if="item.hyperlink"
                  :href="item.hyperlink"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="`Open featured slide ${index + 1}`"
                  :tabindex="
                    currentCarouselPosition === index
                      ? 0
                      : -1
                  "
                >
                  <img
                    class="carousel-image"
                    :src="getImageUrl(item.imageKey)"
                    :alt="`CandyRific featured banner ${index + 1}`"
                    :loading="index === 0 ? 'eager' : 'lazy'"
                    :fetchpriority="index === 0 ? 'high' : 'auto'"
                  />
                </a>

                <!-- NON-CLICKABLE IMAGE -->
                <div
                  v-else
                  class="carousel-slide-image"
                >
                  <img
                    class="carousel-image"
                    :src="getImageUrl(item.imageKey)"
                    :alt="`CandyRific featured banner ${index + 1}`"
                    :loading="index === 0 ? 'eager' : 'lazy'"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- NEXT ARROW -->
          <div class="arrow-container-right">
            <button
              class="carousel-arrow forward-arrow"
              type="button"
              aria-label="Next slide"
              :disabled="desktopItems.length <= 1"
              @click="handleForwardArrowClick"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                aria-hidden="true"
              >
                <path
                  d="M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7L439.2 297.3z"
                />
              </svg>
            </button>
          </div>

        </div>

        <!-- NAVIGATION DOTS -->
        <div
          v-if="desktopItems.length > 1"
          class="carousel-circles"
          aria-label="Carousel navigation"
        >
          <button
            v-for="(item, index) in desktopItems"
            :key="item.id"
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

      <!-- EMPTY / ERROR -->
      <p
        v-if="!isLoading && loadError"
        class="carousel-message"
      >
        Featured content is temporarily unavailable.
      </p>

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
   SECTION TITLE
======================================== */

.carousel-title {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
  color: #703795;
  text-align: center;
  line-height: 1.15;

  margin: 0 0 clamp(1.75rem, 3vw, 2.75rem);
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

  /* No additional shadows */
  box-shadow: none;
}

/* ========================================
   IMAGE TRACK
======================================== */

.carousel-image-track {
  display: flex;
  width: 100%;

  transition: transform 0.5s ease-in-out;
  will-change: transform;
}

/* ========================================
   SLIDES
======================================== */

.carousel-slide {
  flex: 0 0 100%;
  width: 100%;
  min-width: 0;
}

.carousel-slide a,
.carousel-slide-image {
  display: block;
  width: 100%;
  height: 100%;
}

.carousel-slide a:focus-visible {
  outline: 4px solid #01aef0;
  outline-offset: -4px;
}

/* ========================================
   IMAGES
======================================== */

.carousel-image {
  display: block;
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
  justify-content: center;

  width: 100%;
  height: 100%;
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
  background: rgba(112, 55, 149, 0.06);
}

.carousel-arrow:active:not(:disabled) {
  transform: scale(0.96);
}

.carousel-arrow:focus-visible {
  outline: 3px solid rgba(1, 174, 240, 0.35);
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

  border: 2px solid #703795;
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
  outline: 3px solid rgba(1, 174, 240, 0.3);
  outline-offset: 3px;
}

/* ========================================
   MESSAGE
======================================== */

.carousel-message {
  text-align: center;
  color: #746d7b;
  font-size: 0.9rem;
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

/* ========================================
   REDUCED MOTION
======================================== */

@media (prefers-reduced-motion: reduce) {
  .carousel-image-track,
  .carousel-arrow,
  .carousel-circle {
    transition: none;
  }
}
</style>
