
<script setup>
import {
  computed,
  nextTick,
  onMounted,
  ref,
  watch
} from 'vue'

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
   STATE
======================================== */

const sliderRef = ref(null)
const currentIndex = ref(0)

let scrollTimer = null
let isAdjusting = false

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
   LOOPED ITEMS
======================================== */

const loopedItems = computed(() => {
  const items = mobileItems.value

  if (items.length <= 1) return items

  return [
    {
      ...items[items.length - 1],
      loopKey: 'clone-last'
    },
    ...items.map((item) => ({
      ...item,
      loopKey: `item-${item.id}`
    })),
    {
      ...items[0],
      loopKey: 'clone-first'
    }
  ]
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
   GET CARD CENTER POSITION
======================================== */

const getCardPosition = (index) => {
  const slider = sliderRef.value

  if (!slider) return 0

  const card = slider.children[index]

  if (!card) return 0

  return (
    card.offsetLeft -
    slider.offsetLeft -
    (slider.clientWidth - card.clientWidth) / 2
  )
}

/* ========================================
   SCROLL TO CARD
======================================== */

const scrollToCard = (
  index,
  behavior = 'smooth'
) => {
  const slider = sliderRef.value

  if (!slider) return

  slider.scrollTo({
    left: getCardPosition(index),
    behavior
  })
}

/* ========================================
   INITIAL POSITION
======================================== */

const initializeSlider = async () => {
  await nextTick()

  if (!sliderRef.value) return

  currentIndex.value = 0

  if (mobileItems.value.length > 1) {
    scrollToCard(1, 'instant')
  } else {
    scrollToCard(0, 'instant')
  }
}

/* ========================================
   HANDLE INFINITE SCROLL
======================================== */

const handleScrollEnd = () => {
  const slider = sliderRef.value

  if (
    !slider ||
    isAdjusting ||
    mobileItems.value.length <= 1
  ) {
    return
  }

  const scrollCenter =
    slider.scrollLeft + slider.clientWidth / 2

  let closestIndex = 0
  let closestDistance = Infinity

  Array.from(slider.children).forEach(
    (card, index) => {
      const cardCenter =
        card.offsetLeft -
        slider.offsetLeft +
        card.clientWidth / 2

      const distance = Math.abs(
        scrollCenter - cardCenter
      )

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    }
  )

  const count = mobileItems.value.length

  if (closestIndex === 0) {
    isAdjusting = true
    scrollToCard(count, 'instant')
    currentIndex.value = count - 1
    requestAnimationFrame(() => {
      isAdjusting = false
    })
  } else if (closestIndex === count + 1) {
    isAdjusting = true
    scrollToCard(1, 'instant')
    currentIndex.value = 0
    requestAnimationFrame(() => {
      isAdjusting = false
    })
  } else {
    currentIndex.value = closestIndex - 1
  }
}

/* ========================================
   SCROLL EVENT
======================================== */

const handleScroll = () => {
  if (isAdjusting) return

  clearTimeout(scrollTimer)

  scrollTimer = setTimeout(() => {
    handleScrollEnd()
  }, 120)
}

/* ========================================
   WATCH FOR CMS ITEMS
======================================== */

watch(
  mobileItems,
  () => {
    initializeSlider()
  },
  { flush: 'post' }
)

onMounted(initializeSlider)
</script>

<template>
  <div
    v-if="mobileItems.length > 0"
    ref="sliderRef"
    class="carousel-mobile-slider"
    aria-label="Featured CandyRific content"
    @scroll.passive="handleScroll"
  >
    <article
      v-for="(item, index) in loopedItems"
      :key="item.loopKey || item.id"
      class="carousel-mobile-card"
      :aria-hidden="
        loopedItems.length > mobileItems.length &&
        (index === 0 || index === loopedItems.length - 1)
          ? 'true'
          : undefined
      "
    >
      <!-- CLICKABLE IMAGE -->
      <a
        v-if="item.hyperlink"
        :href="item.hyperlink"
        target="_blank"
        rel="noopener noreferrer"
        :tabindex="
          loopedItems.length > mobileItems.length &&
          (index === 0 || index === loopedItems.length - 1)
            ? -1
            : 0
        "
        :aria-label="`View featured CandyRific content ${item.id}`"
      >
        <img
          :src="getImageUrl(item.imageKey)"
          :alt="`CandyRific featured content ${item.id}`"
          :loading="index <= 2 ? 'eager' : 'lazy'"
          :fetchpriority="index === 1 ? 'high' : 'auto'"
        />
      </a>

      <!-- NON-CLICKABLE IMAGE -->
      <div
        v-else
        class="carousel-mobile-image"
      >
        <img
          :src="getImageUrl(item.imageKey)"
          :alt="`CandyRific featured content ${item.id}`"
          :loading="index <= 2 ? 'eager' : 'lazy'"
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
      1rem,
      calc((100vw - 34rem) / 2)
    )
    1rem;

  scroll-snap-type: x mandatory;
  scroll-padding-inline: 1rem;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  /* No added shadows */
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
  background: #ffffff;

  /* Designer artwork has its own shadow */
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
