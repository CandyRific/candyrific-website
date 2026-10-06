<template>
  <section class="instagram-section">
    <div class="instagram-container">
      <!-- Header -->
      <div class="instagram-header">
        <div class="instagram-heading">
          <span class="instagram-eyebrow">
            @candyrificllc
          </span>

          <h2>
            Follow Us on Instagram
          </h2>

          <p>
            Sweet stuff, new products, and a little
            behind-the-scenes CandyRific fun.
          </p>
        </div>

        <a
          class="instagram-follow-button"
          href="https://www.instagram.com/candyrificllc/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            class="instagram-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="5"
              ry="5"
            />

            <circle
              cx="12"
              cy="12"
              r="4"
            />

            <circle
              cx="17.5"
              cy="6.5"
              r="1"
              class="instagram-icon-dot"
            />
          </svg>

          <span>
            Follow on Instagram
          </span>
        </a>
      </div>

      <div class="instagram-divider">
        <span></span>
      </div>

      <!-- Posts -->
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

      <div class="instagram-bottom">
        <p>
          There&apos;s always something sweet happening.
        </p>

        <a
          href="https://www.instagram.com/candyrificllc/"
          target="_blank"
          rel="noopener noreferrer"
        >
          See more from CandyRific

          <span aria-hidden="true">
            →
          </span>
        </a>
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
  padding: 4rem 1.5rem;
  background: #ffffff;
}

.instagram-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 2.5rem;
  overflow: hidden;
  border: 1px solid
    rgba(112, 55, 149, 0.12);
  border-radius: 24px;
  background:
    linear-gradient(
      180deg,
      #ffffff 0%,
      #fbf8fd 100%
    );
  box-shadow:
    0 12px 35px
    rgba(74, 42, 97, 0.08);
}

/* ========================================
   HEADER
======================================== */

.instagram-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1.75rem;
}

.instagram-heading {
  max-width: 750px;
}

.instagram-eyebrow {
  display: inline-block;
  margin-bottom: 0.4rem;
  color: #703795;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.instagram-heading h2 {
  margin: 0;
  background:
    linear-gradient(
      90deg,
      #703795 0%,
      #f04d86 45%,
      #01aef0 100%
    );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-size: clamp(
    2rem,
    4vw,
    3.4rem
  );
  line-height: 1.05;
}

.instagram-heading p {
  max-width: 650px;
  margin: 0.8rem 0 0;
  color: #63348a;
  font-size: 1.05rem;
  line-height: 1.5;
}

/* ========================================
   FOLLOW BUTTON
======================================== */

.instagram-follow-button {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding: 0.85rem 1.4rem;
  border-radius: 14px;
  background:
    linear-gradient(
      110deg,
      #703795,
      #f04d86,
      #01aef0
    );
  box-shadow:
    0 10px 24px
    rgba(112, 55, 149, 0.2);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.instagram-follow-button:hover {
  transform: translateY(-2px);
  box-shadow:
    0 14px 30px
    rgba(112, 55, 149, 0.28);
}

.instagram-icon {
  width: 21px;
  height: 21px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.instagram-icon-dot {
  fill: currentColor;
  stroke: none;
}

/* ========================================
   DIVIDER
======================================== */

.instagram-divider {
  height: 2px;
  margin-bottom: 2rem;
  overflow: hidden;
  border-radius: 20px;
  background: #eee8f2;
}

.instagram-divider span {
  display: block;
  width: 180px;
  height: 100%;
  background:
    linear-gradient(
      90deg,
      #703795,
      #f04d86,
      #01aef0
    );
}

/* ========================================
   GRID

   DESKTOP:
   4 ACROSS
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

/*
  Instagram normally wants its embeds
  to have a minimum width.

  We override that so the post respects
  the width of each grid column.
*/
.instagram-embed-wrapper
:deep(.instagram-media) {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;

  margin: 0 !important;

  border: 0 !important;

  box-shadow: none !important;
}

/*
  Instagram replaces the blockquote with
  an iframe after embed.js runs.

  Force that iframe to remain inside
  the card.
*/
.instagram-embed-wrapper
:deep(iframe) {
  display: block !important;

  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;

  margin: 0 !important;
}

/* ========================================
   BOTTOM
======================================== */

.instagram-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 2rem;
}

.instagram-bottom p {
  margin: 0;
  color: #63348a;
}

.instagram-bottom a {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #703795;
  font-weight: 650;
  text-decoration: none;
}

.instagram-bottom a:hover {
  color: #01aef0;
}

/* ========================================
   TABLET
======================================== */

@media (max-width: 1000px) {
  .instagram-container {
    padding: 2rem;
  }

  .instagram-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .instagram-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

/* ========================================
   MOBILE

   2 x 2
======================================== */

@media (max-width: 600px) {
  .instagram-section {
    padding: 2rem 0.75rem;
  }

  .instagram-container {
    padding: 1.25rem;
    border-radius: 18px;
  }

  .instagram-heading h2 {
    font-size: 2rem;
  }

  .instagram-heading p {
    font-size: 0.95rem;
  }

  .instagram-follow-button {
    width: 100%;
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

  .instagram-bottom {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>