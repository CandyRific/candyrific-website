<template>
  <section class="instagram-section">
    <div class="instagram-container">
      <h2>
        Follow Us on Instagram
      </h2>

      <div class="instagram-grid">
        <article
          v-for="post in posts"
          :key="post.url"
          class="instagram-card"
        >
          <div class="instagram-card-accent"></div>

          <div class="instagram-embed-wrapper">
            <blockquote
              class="instagram-media"
              :data-instgrm-permalink="post.url"
              data-instgrm-version="14"
            >
              <a
                :href="post.url"
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
  nextTick,
  onMounted
} from 'vue'

const posts = [
  {
    url: 'https://www.instagram.com/p/DeARJiMJ4pO/'
  },
  {
    url: 'https://www.instagram.com/p/DaNrKnnRFJG/'
  },
  {
    url: 'https://www.instagram.com/p/DZIDnxikfMt/'
  },
  {
    url: 'https://www.instagram.com/p/DY4omjqDbeo/'
  }
]

const processInstagramEmbeds = () => {
  window.instgrm?.Embeds?.process()
}

onMounted(async () => {
  await nextTick()

  if (
    window.instgrm &&
    window.instgrm.Embeds
  ) {
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
})
</script>

<style scoped>
.instagram-section {
  padding: 3rem 1.5rem;
  background: #ffffff;
}

.instagram-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

/* ========================================
   HEADING
======================================== */

.instagram-container h2 {
  margin: 0 0 2rem;
  color: #703795;
  font-family: 'Fredoka', sans-serif;
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.2;
}

/* ========================================
   GRID
======================================== */

.instagram-grid {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

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

  border: 1px solid
    rgba(112, 55, 149, 0.14);

  border-radius: 18px;

  background: #ffffff;

  box-shadow:
    0 8px 25px
    rgba(77, 48, 99, 0.08);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.instagram-card:hover {
  transform: translateY(-4px);

  box-shadow:
    0 14px 32px
    rgba(77, 48, 99, 0.14);
}

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
      repeat(2, minmax(0, 1fr));
  }
}

/* ========================================
   MOBILE
======================================== */

@media (max-width: 600px) {
  .instagram-section {
    padding: 2rem 0.75rem;
  }

  .instagram-container h2 {
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
  }

  .instagram-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));

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