
<script setup>
import { computed } from 'vue'

/* ========================================
   PROPS
======================================== */

const props = defineProps({
  carouselItems: {
    type: Array,
    default: () => []
  }
})

/* ========================================
   CONFIGURATION
======================================== */

const MOBILE_VIEWPORT_ID = 1

/* ========================================
   MOBILE ITEMS
======================================== */

const mobileItems = computed(() => {
  return props.carouselItems
    .map((item) => {
      const image = item.images?.find(
        (image) =>
          Number(image.viewport_id) ===
          MOBILE_VIEWPORT_ID
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
</script>

<template>
  <div
    v-if="mobileItems.length > 0"
    class="carousel-mobile-slider"
    role="region"
    aria-label="Featured CandyRific content"
  >
    <article
      v-for="(item, index) in mobileItems"
      :key="item.id"
      class="carousel-mobile-card"
    >
      <!-- CLICKABLE IMAGE -->
      <a
        v-if="item.hyperlink"
        :href="item.hyperlink"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="`View featured CandyRific content ${index + 1}`"
      >
        <img
          :src="getImageUrl(item.imageKey)"
          :alt="`CandyRific featured content ${index + 1}`"
          :loading="index === 0 ? 'eager' : 'lazy'"
          :fetchpriority="index === 0 ? 'high' : 'auto'"
        />
      </a>

      <!-- NON-CLICKABLE IMAGE -->
      <div
        v-else
        class="carousel-mobile-image"
      >
        <img
          :src="getImageUrl(item.imageKey)"
          :alt="`CandyRific featured content ${index + 1}`"
          :loading="index === 0 ? 'eager' : 'lazy'"
        />
      </div>
    </article>
  </div>
</template>

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
      0px,
      calc((100% - min(82vw, 22rem)) / 2)
    )
    1rem;

  scroll-snap-type: x mandatory;
  scroll-padding-inline: 0;

  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  overscroll-behavior-x: contain;

  box-shadow: none;
}

.carousel-mobile-slider::-webkit-scrollbar {
  display: none;
}

/* ========================================
   MOBILE CARD
======================================== */

.carousel-mobile-card {
  flex: 0 0 min(82vw, 22rem);
  aspect-ratio: 2 / 3;

  overflow: hidden;
  border-radius: 1.25rem;

  scroll-snap-align: center;
  scroll-snap-stop: always;

  background: #ffffff;
  box-shadow: none;

  transition: transform 0.2s ease;
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
}

.carousel-mobile-card a:focus-visible {
  outline: 4px solid rgba(1, 174, 240, 0.5);
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

/* ========================================
   REDUCED MOTION
======================================== */

@media (prefers-reduced-motion: reduce) {
  .carousel-mobile-card {
    transition: none;
  }
}
</style>
