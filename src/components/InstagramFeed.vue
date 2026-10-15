
<template>
  <section class="instagram-section">
    <div class="instagram-container">

      <h2 class="title">
        See What’s Happening
      </h2>

      <div class="instagram-grid">
        <article
          v-for="post in posts"
          :key="post.id"
          class="instagram-card"
        >
          <div class="instagram-card-accent"></div>

          <div class="instagram-embed-wrapper">
            <blockquote
              class="instagram-media"
              :data-instgrm-permalink="post.instagram_link"
              data-instgrm-version="14"
            >
              <a
                :href="post.instagram_link"
                target="_blank"
                rel="noopener noreferrer"
              >
                View this post on Instagram
              </a>
            </blockquote>
          </div>
        </article>
      </div>

    </div>
  </section>
</template>

<script setup>
import {
  ref,
  nextTick,
  onMounted
} from 'vue'

/* ========================================
   INSTAGRAM STATE
======================================== */

const posts = ref([])

/* ========================================
   PROCESS INSTAGRAM EMBEDS
======================================== */

const processInstagramEmbeds = () => {
  window.instgrm?.Embeds?.process()
}

/* ========================================
   LOAD INSTAGRAM SCRIPT
======================================== */

const loadInstagramScript = () => {
  if (window.instgrm?.Embeds) {
    processInstagramEmbeds()
    return
  }

  const existingScript =
    document.querySelector(
      'script[src="https://www.instagram.com/embed.js"]'
    )

  if (existingScript) {
    existingScript.addEventListener(
      'load',
      processInstagramEmbeds,
      {
        once: true
      }
    )

    return
  }

  const script =
    document.createElement('script')

  script.src =
    'https://www.instagram.com/embed.js'

  script.async = true

  script.onload =
    processInstagramEmbeds

  document.body.appendChild(script)
}

/* ========================================
   LOAD INSTAGRAM POSTS
======================================== */

const loadInstagramPosts = async () => {
  try {
    const response = await fetch(
      '/.netlify/functions/instagram-posts'
    )

    if (!response.ok) {
      throw new Error(
        'Failed to load Instagram posts.'
      )
    }

    const data = await response.json()

    posts.value = data
      .filter(
        (post) => post.instagram_link
      )
      .sort(
        (a, b) => a.id - b.id
      )

    if (posts.value.length === 0) {
      return
    }

    // Wait for Vue to render the new posts.
    await nextTick()

    // Process the newly rendered embeds.
    loadInstagramScript()

  } catch (error) {
    console.error(
      'Error loading Instagram posts:',
      error
    )
  }
}

/* ========================================
   INITIAL LOAD
======================================== */

onMounted(() => {
  loadInstagramPosts()
})
</script>


<style scoped>
/* ========================================
   SECTION
======================================== */

.instagram-section {
  position: relative;

  width: 100%;

  padding:
    clamp(3rem, 6vw, 5rem)
    clamp(1rem, 4vw, 3rem)
    clamp(3.5rem, 6vw, 5.5rem);

  background:
    linear-gradient(
      180deg,
      rgba(112, 55, 149, 0.055) 0%,
      rgba(112, 55, 149, 0.02) 22%,
      #ffffff 65%
    );
}


/* ========================================
   SECTION DIVIDER
======================================== */

.instagram-section::before {
  content: '';

  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 4px;

  background:
    linear-gradient(
      90deg,
      #703795,
      #f04d86,
      #01aef0
    );

  opacity: 0.75;
}


/* ========================================
   CONTAINER
======================================== */

.instagram-container {
  width: 100%;
  max-width: 1400px;

  margin: 0 auto;
}


/* ========================================
   HEADING
======================================== */

.instagram-container h2 {
  margin:
    0
    0
    clamp(1.75rem, 3vw, 2.5rem);

  color: #703795;

  font-family:
    'Fredoka',
    sans-serif;

  font-size:
    clamp(
      2rem,
      4vw,
      3.5rem
    );

  font-weight: 600;

  line-height: 1.1;

  letter-spacing: -0.02em;
}


/* ========================================
   GRID
======================================== */

.instagram-grid {
  display: grid;

  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );

  gap: 1.25rem;

  width: 100%;

  align-items: start;
}


/* ========================================
   CARD
======================================== */

.instagram-card {
  min-width: 0;

  overflow: hidden;

  border:
    1px solid
    rgba(112, 55, 149, 0.14);

  border-radius: 18px;

  background: #ffffff;

  box-shadow:
    0
    8px
    25px
    rgba(
      77,
      48,
      99,
      0.08
    );

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.instagram-card:hover {
  transform:
    translateY(-4px);

  box-shadow:
    0
    14px
    32px
    rgba(
      77,
      48,
      99,
      0.14
    );
}


/* ========================================
   CARD ACCENT
======================================== */

.instagram-card-accent {
  height: 6px;

  background:
    linear-gradient(
      90deg,
      #703795,
      #f04d86,
      #01aef0
    );
}


/* ========================================
   EMBEDS
======================================== */

.instagram-embed-wrapper {
  width: 100%;

  min-width: 0;

  overflow: hidden;
}

.instagram-embed-wrapper
:deep(.instagram-media) {
  width: 100% !important;

  min-width: 0 !important;

  max-width: 100% !important;

  margin: 0 !important;

  border: 0 !important;

  box-shadow: none !important;
}

.instagram-embed-wrapper
:deep(iframe) {
  display: block !important;

  width: 100% !important;

  min-width: 0 !important;

  max-width: 100% !important;

  margin: 0 !important;
}


/* ========================================
   TABLET
======================================== */

@media (max-width: 1000px) {

  .instagram-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

}


/* ========================================
   MOBILE
======================================== */

@media (max-width: 600px) {

  .instagram-section {
    padding:
      2.75rem
      0.75rem
      3rem;
  }

  .instagram-container h2 {
    margin-bottom: 1.5rem;
  }

  .instagram-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );

    gap: 0.65rem;
  }

  .instagram-card {
    border-radius: 12px;
  }

  .instagram-card-accent {
    height: 4px;
  }

}
</style>