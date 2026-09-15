<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const brands = ref([])
const isLoading = ref(true)
const loadError = ref('')

const loadBrands = async () => {
  try {
    isLoading.value = true
    loadError.value = ''

    const response = await fetch('/.netlify/functions/brands')

    if (!response.ok) {
      throw new Error(`Failed to load brands: ${response.status}`)
    }

    brands.value = await response.json()
  } catch (error) {
    console.error('Error loading brands:', error)
    loadError.value = 'Unable to load brands.'
  } finally {
    isLoading.value = false
  }
}

const leftBrands = computed(() => {
  const midpoint = Math.ceil(brands.value.length / 2)

  return brands.value.slice(0, midpoint)
})

const rightBrands = computed(() => {
  const midpoint = Math.ceil(brands.value.length / 2)

  return brands.value.slice(midpoint)
})

const getBrandImageUrl = (imageKey) => {
  if (!imageKey) {
    return ''
  }

  return `/.netlify/functions/brand-image?key=${encodeURIComponent(imageKey)}`
}

onMounted(() => {
  loadBrands()
})
</script>

<template>
  <div class="full-brand-div">

    <div class="full-brand-title-div">
      BRANDS WE WORK WITH
    </div>

    <div
      v-if="loadError"
      class="brand-message"
    >
      {{ loadError }}
    </div>

    <template v-else-if="!isLoading">

      <div class="left-marquee-banner">

        <div class="left-marquee-track">

          <RouterLink
            v-for="brand in leftBrands"
            :key="brand.id"
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
              :src="getBrandImageUrl(brand.image_key)"
              :alt="`${brand.name} logo`"
            >

          </RouterLink>

        </div>

      </div>


      <div class="right-marquee-banner">

        <div class="right-marquee-track">

          <RouterLink
            v-for="brand in rightBrands"
            :key="brand.id"
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
              :src="getBrandImageUrl(brand.image_key)"
              :alt="`${brand.name} logo`"
            >

          </RouterLink>

        </div>

      </div>

    </template>


    <div class="full-brand-blue-div">
    </div>

  </div>
</template>

<style scoped>

.full-brand-div {
  font-family: 'Fredoka', sans-serif;

  background: linear-gradient(
    90deg,
    #6d3692 0%,
    #6250a1 25%,
    #3f6fb5 50%,
    #007fc5 65%,
    #00aced 100%
  );

  color: white;

  position: relative;

  padding-top: 0rem;
  padding-bottom: 1rem;

  z-index: 1;
}


.full-brand-blue-div {
  display: none;
}


.full-brand-title-div {
  display: flex;

  justify-content: center;
  align-items: center;

  padding: 1rem;

  font-size: 2rem;

  text-align: center;

  z-index: 3;

  position: relative;

  font-weight: 500;
}


.brand-message {
  position: relative;

  z-index: 3;

  text-align: center;

  padding: 2rem 1rem;
}


.left-marquee-banner {
  overflow-x: hidden;

  width: 100%;

  z-index: 1;

  padding-bottom: .5rem;
}


.right-marquee-banner {
  overflow-x: hidden;

  width: 100%;

  z-index: 1;

  overflow-y: hidden;

  padding-bottom: .5rem;
}


.left-marquee-track {
  display: flex;

  width: max-content;

  animation: left-marquee 35s linear infinite;

  gap: .5rem;
}


.right-marquee-track {
  display: flex;

  width: max-content;

  animation: right-marquee 40s linear infinite;

  gap: .5rem;
}


.brand-marquee-card {
  display: block;

  flex-shrink: 0;

  width: 9rem;
  height: 5rem;

  background-color: #9dabd5;

  border-radius: 5px;

  text-decoration: none;

  box-shadow: .5px .5px 1px black;
}


.brand-marquee-card:active {
  box-shadow: none;
}


.brand-marquee-card img {
  height: 100%;

  width: 100%;

  object-fit: contain;

  padding: .5rem;
}


@media (min-width: 768px) {

  .full-brand-div {
    padding-top: 1rem;

    padding-bottom: 1rem;
  }


  .full-brand-blue-div {

    background: linear-gradient(
      90deg,
      rgba(109, 54, 146, 0.95) 0%,
      rgba(109, 54, 146, 0.75) 5%,
      rgba(109, 54, 146, 0.25) 10%,
      rgba(109, 54, 146, 0.02) 50%,
      rgba(0, 172, 237, 0.25) 90%,
      rgba(0, 172, 237, 0.75) 95%,
      rgba(0, 172, 237, 0.95) 100%
    );

    position: absolute;

    inset: 0;

    z-index: 2;

    display: block;

    pointer-events: none;
  }


  .brand-marquee-card {
    width: 14rem;

    height: 10rem;
  }


  .brand-marquee-card:hover {
    box-shadow: 1px 2px 4px black;
  }


  .left-marquee-track {
    gap: 1rem;

    padding-top: 1rem;
  }


  .right-marquee-track {
    gap: 1rem;

    padding-top: 1rem;
  }

}


@keyframes left-marquee {

  from {
    transform: translateX(100vw);
  }

  to {
    transform: translateX(-100%);
  }

}


@keyframes right-marquee {

  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(100vw);
  }

}

</style>