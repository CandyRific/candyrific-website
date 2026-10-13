<script setup>
import {
  ref,
  computed,
  onMounted
} from 'vue'

import { RouterLink } from 'vue-router'


/* ========================================
   STATE
======================================== */

const brands = ref([])
const isLoading = ref(true)
const loadError = ref('')


/* ========================================
   LOAD BRANDS
======================================== */

const loadBrands = async () => {
  try {
    isLoading.value = true
    loadError.value = ''

    const response =
      await fetch(
        '/.netlify/functions/brands'
      )

    if (!response.ok) {
      throw new Error(
        `Failed to load brands: ${response.status}`
      )
    }

    brands.value =
      await response.json()
  } catch (error) {
    console.error(
      'Error loading brands:',
      error
    )

    loadError.value =
      'Unable to load brands.'
  } finally {
    isLoading.value = false
  }
}


/* ========================================
   SPLIT BRAND ROWS
======================================== */

const leftBrands = computed(() => {
  const midpoint =
    Math.ceil(
      brands.value.length / 2
    )

  return brands.value.slice(
    0,
    midpoint
  )
})

const rightBrands = computed(() => {
  const midpoint =
    Math.ceil(
      brands.value.length / 2
    )

  return brands.value.slice(
    midpoint
  )
})


/* ========================================
   BRAND IMAGE URL
======================================== */

const getBrandImageUrl = (
  imageKey
) => {
  if (!imageKey) {
    return ''
  }

  return (
    '/.netlify/functions/brand-image' +
    `?key=${encodeURIComponent(imageKey)}`
  )
}


/* ========================================
   INITIAL LOAD
======================================== */

onMounted(() => {
  loadBrands()
})
</script>

<template>
  <section class="brand-section">

    <div class="brand-heading-container">
      <h2 class="brand-title">
        Brands We Work With
      </h2>

      <p class="brand-subtitle">
        Explore products from the brands
        you know and love.
      </p>
    </div>


    <!-- Loading -->
    <div
      v-if="isLoading"
      class="brand-message"
      role="status"
    >
      Loading brands...
    </div>


    <!-- Error -->
    <div
      v-else-if="loadError"
      class="brand-message"
      role="alert"
    >
      {{ loadError }}
    </div>


    <!-- Brands -->
    <div
      v-else
      class="brand-marquees"
    >

      <!-- ========================================
           LEFT MOVING ROW
      ========================================= -->

      <div class="marquee-banner">

        <div class="marquee-fade marquee-fade-left">
        </div>

        <div
          class="
            marquee-track
            marquee-track-left
          "
        >

          <!-- Original group -->
          <div class="marquee-group">

            <RouterLink
              v-for="brand in leftBrands"
              :key="`left-1-${brand.id}`"
              :to="{
                path: '/products',
                query: {
                  brand: brand.id
                }
              }"
              class="brand-marquee-card"
              :aria-label="`View ${brand.name} products`"
            >

              <img
                v-if="brand.image_key"
                :src="
                  getBrandImageUrl(
                    brand.image_key
                  )
                "
                :alt="`${brand.name} logo`"
                loading="lazy"
              >

              <span
                v-else
                class="brand-name-fallback"
              >
                {{ brand.name }}
              </span>

            </RouterLink>

          </div>


          <!-- Duplicate for seamless loop -->
          <div
            class="marquee-group"
            aria-hidden="true"
          >

            <RouterLink
              v-for="brand in leftBrands"
              :key="`left-2-${brand.id}`"
              :to="{
                path: '/products',
                query: {
                  brand: brand.id
                }
              }"
              class="brand-marquee-card"
              tabindex="-1"
            >

              <img
                v-if="brand.image_key"
                :src="
                  getBrandImageUrl(
                    brand.image_key
                  )
                "
                :alt="`${brand.name} logo`"
                loading="lazy"
              >

              <span
                v-else
                class="brand-name-fallback"
              >
                {{ brand.name }}
              </span>

            </RouterLink>

          </div>

        </div>

        <div class="marquee-fade marquee-fade-right">
        </div>

      </div>


      <!-- ========================================
           RIGHT MOVING ROW
      ========================================= -->

      <div class="marquee-banner">

        <div class="marquee-fade marquee-fade-left">
        </div>

        <div
          class="
            marquee-track
            marquee-track-right
          "
        >

          <!-- Original group -->
          <div class="marquee-group">

            <RouterLink
              v-for="brand in rightBrands"
              :key="`right-1-${brand.id}`"
              :to="{
                path: '/products',
                query: {
                  brand: brand.id
                }
              }"
              class="brand-marquee-card"
              :aria-label="`View ${brand.name} products`"
            >

              <img
                v-if="brand.image_key"
                :src="
                  getBrandImageUrl(
                    brand.image_key
                  )
                "
                :alt="`${brand.name} logo`"
                loading="lazy"
              >

              <span
                v-else
                class="brand-name-fallback"
              >
                {{ brand.name }}
              </span>

            </RouterLink>

          </div>


          <!-- Duplicate for seamless loop -->
          <div
            class="marquee-group"
            aria-hidden="true"
          >

            <RouterLink
              v-for="brand in rightBrands"
              :key="`right-2-${brand.id}`"
              :to="{
                path: '/products',
                query: {
                  brand: brand.id
                }
              }"
              class="brand-marquee-card"
              tabindex="-1"
            >

              <img
                v-if="brand.image_key"
                :src="
                  getBrandImageUrl(
                    brand.image_key
                  )
                "
                :alt="`${brand.name} logo`"
                loading="lazy"
              >

              <span
                v-else
                class="brand-name-fallback"
              >
                {{ brand.name }}
              </span>

            </RouterLink>

          </div>

        </div>

        <div class="marquee-fade marquee-fade-right">
        </div>

      </div>

    </div>

  </section>
</template>

<style scoped>
/* ========================================
   SECTION
======================================== */

.brand-section {
  position: relative;

  width: 100%;

  overflow: hidden;

  padding:
    clamp(2.75rem, 5vw, 4.5rem)
    0
    clamp(3rem, 5vw, 4.75rem);

  font-family:
    'Fredoka',
    sans-serif;

  color: #ffffff;

  background:
    linear-gradient(
      90deg,
      #6d3692 0%,
      #6250a1 25%,
      #3f6fb5 50%,
      #007fc5 65%,
      #00aced 100%
    );

  border-top:
    1px solid
    rgba(255, 255, 255, 0.15);

  border-bottom:
    1px solid
    rgba(53, 36, 84, 0.12);
}


/* ========================================
   HEADING
======================================== */

.brand-heading-container {
  width: 100%;

  max-width: 1400px;

  margin:
    0
    auto
    clamp(2rem, 4vw, 3rem);

  padding:
    0
    clamp(1.25rem, 4vw, 3rem);

  text-align: center;
}

.brand-title {
  margin: 0;

  font-family:
    'Fredoka',
    sans-serif;

  font-size:
    clamp(
      2rem,
      4vw,
      3rem
    );

  font-weight: 600;

  line-height: 1.1;

  letter-spacing: -0.02em;
}

.brand-subtitle {
  max-width: 34rem;

  margin:
    0.65rem
    auto
    0;

  font-size:
    clamp(
      1rem,
      1.5vw,
      1.15rem
    );

  line-height: 1.5;

  color:
    rgba(
      255,
      255,
      255,
      0.88
    );
}


/* ========================================
   MESSAGES
======================================== */

.brand-message {
  padding:
    2rem
    1rem;

  text-align: center;

  font-size: 1rem;

  color:
    rgba(
      255,
      255,
      255,
      0.9
    );
}


/* ========================================
   MARQUEE CONTAINER
======================================== */

.brand-marquees {
  display: flex;

  flex-direction: column;

  gap: 1rem;
}


/* ========================================
   MARQUEE BANNER
======================================== */

.marquee-banner {
  position: relative;

  width: 100%;

  overflow: hidden;

  padding: 0.25rem 0;
}


/* ========================================
   TRACK
======================================== */

.marquee-track {
  display: flex;

  width: max-content;

  will-change: transform;
}


/* ========================================
   GROUP
======================================== */

.marquee-group {
  display: flex;

  flex-shrink: 0;

  align-items: center;

  gap: 0.75rem;

  padding-right: 0.75rem;
}


/* ========================================
   LEFT ANIMATION
======================================== */

.marquee-track-left {
  animation:
    marquee-left
    42s
    linear
    infinite;
}


/* ========================================
   RIGHT ANIMATION
======================================== */

.marquee-track-right {
  transform:
    translateX(-50%);

  animation:
    marquee-right
    46s
    linear
    infinite;
}



/* ========================================
   BRAND CARD
======================================== */

.brand-marquee-card {
  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width:
    clamp(
      8.5rem,
      19vw,
      12.5rem
    );

  height:
    clamp(
      5.25rem,
      11vw,
      7.75rem
    );

  padding:
    clamp(
      0.65rem,
      1.5vw,
      1rem
    );

  overflow: hidden;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.35
    );

  border-radius: 1rem;

  background:
    rgba(
      255,
      255,
      255,
      0.92
    );

  text-decoration: none;

  box-shadow:
    0
    7px
    18px
    rgba(
      53,
      36,
      84,
      0.16
    );

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}


/* ========================================
   BRAND IMAGE
======================================== */

.brand-marquee-card img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: contain;
}


/* ========================================
   FALLBACK BRAND NAME
======================================== */

.brand-name-fallback {
  padding: 0.5rem;

  color: #352454;

  font-size: 1rem;

  font-weight: 500;

  text-align: center;
}


/* ========================================
   CARD INTERACTIONS
======================================== */

.brand-marquee-card:hover {
  transform:
    translateY(-3px);

  background:
    #ffffff;

  box-shadow:
    0
    11px
    24px
    rgba(
      53,
      36,
      84,
      0.22
    );
}

.brand-marquee-card:active {
  transform:
    translateY(0)
    scale(0.98);
}

.brand-marquee-card:focus-visible {
  outline:
    4px solid
    rgba(
      250,
      209,
      65,
      0.85
    );

  outline-offset: 3px;
}


/* ========================================
   EDGE FADES
======================================== */

.marquee-fade {
  position: absolute;

  top: 0;
  bottom: 0;

  z-index: 3;

  width:
    clamp(
      1.5rem,
      7vw,
      7rem
    );

  pointer-events: none;
}

.marquee-fade-left {
  left: 0;

  background:
    linear-gradient(
      90deg,
      rgba(
        109,
        54,
        146,
        0.95
      ),
      rgba(
        109,
        54,
        146,
        0
      )
    );
}

.marquee-fade-right {
  right: 0;

  background:
    linear-gradient(
      270deg,
      rgba(
        0,
        172,
        237,
        0.95
      ),
      rgba(
        0,
        172,
        237,
        0
      )
    );
}


/* ========================================
   DESKTOP
======================================== */

@media (min-width: 768px) {

  .brand-marquees {
    gap: 1.25rem;
  }

  .marquee-group {
    gap: 1rem;

    padding-right: 1rem;
  }

}


/* ========================================
   REDUCED MOTION
======================================== */

@media (
  prefers-reduced-motion:
  reduce
) {

  .marquee-track {
    animation: none;
    transform: none;
  }

  .marquee-banner {
    overflow-x: auto;

    scrollbar-width: none;
  }

  .marquee-banner::-webkit-scrollbar {
    display: none;
  }

}


/* ========================================
   ANIMATIONS
======================================== */

@keyframes marquee-left {

  from {
    transform:
      translateX(0);
  }

  to {
    transform:
      translateX(-50%);
  }

}


@keyframes marquee-right {

  from {
    transform:
      translateX(-50%);
  }

  to {
    transform:
      translateX(0);
  }

}
</style>