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

      <!-- Decorative divider -->
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

      <!-- Bottom CTA -->
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
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(
      180deg,
      #ffffff 0%,
      #fbf8fd 100%
    );
  padding: 5rem 1.5rem;
}

/* Soft background decorations */
.instagram-section::before,
.instagram-section::after {
  position: absolute;
  border-radius: 50%;
  content: '';
  pointer-events: none;
}

.instagram-section::before {
  width: 22rem;
  height: 22rem;
  top: -13rem;
  left: -10rem;
  background:
    radial-gradient(
      circle,
      rgba(112, 55, 149, 0.12),
      rgba(112, 55, 149, 0)
    );
}

.instagram-section::after {
  width: 26rem;
  height: 26rem;
  right: -13rem;
  bottom: -15rem;
  background:
    radial-gradient(
      circle,
      rgba(1, 174, 240, 0.13),
      rgba(1, 174, 240, 0)
    );
}

.instagram-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* ========================================
   HEADER
======================================== */

.instagram-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  margin-bottom: 2rem;
}

.instagram-heading {
  max-width: 720px;
}

.instagram-eyebrow {
  display: inline-block;
  margin-bottom: 0.55rem;
  color: #703795;
  font-size: 1rem;
  font-weight: 650;
  letter-spacing: 0.08em;
}

.instagram-heading h2 {
  margin: 0;
  background:
    linear-gradient(
      90deg,
      #703795 0%,
      #f04d86 48%,
      #01aef0 100%
    );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-size: clamp(
    2.2rem,
    5vw,
    3.8rem
  );
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.035em;
}

.instagram-heading p {
  max-width: 650px;
  margin: 1rem 0 0;
  color: #63348a;
  font-size: 1.15rem;
  font-weight: 450;
  line-height: 1.55;
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
  min-height: 54px;
  padding: 0.85rem 1.5rem;
  border-radius: 14px;
  background:
    linear-gradient(
      110deg,
      #703795 0%,
      #99429f 30%,
      #147ec5 70%,
      #01aef0 100%
    );
  box-shadow:
    0 10px 24px
    rgba(112, 55, 149, 0.2);
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.instagram-follow-button:hover {
  transform: translateY(-3px);
  box-shadow:
    0 15px 30px
    rgba(112, 55, 149, 0.28);
}

.instagram-follow-button:focus-visible {
  outline: 3px solid #fad141;
  outline-offset: 4px;
}

.instagram-icon {
  width: 22px;
  height: 22px;
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
  width: 100%;
  height: 2px;
  margin-bottom: 2.5rem;
  overflow: hidden;
  border-radius: 999px;
  background: #eee8f2;
}

.instagram-divider span {
  display: block;
  width: 180px;
  height: 100%;
  border-radius: inherit;
  background:
    linear-gradient(
      90deg,
      #703795,
      #f04d86,
      #01aef0
    );
}

/* ========================================
   INSTAGRAM GRID
======================================== */

.instagram-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 2rem;
  align-items: start;
}

.instagram-card {
  position: relative;
  min-width: 0;
  overflow: hidden;
  border: 1px solid
    rgba(112, 55, 149, 0.12);
  border-radius: 22px;
  background: #ffffff;
  box-shadow:
    0 10px 35px
    rgba(77, 48, 99, 0.1);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.instagram-card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 18px 45px
    rgba(77, 48, 99, 0.16);
}

.instagram-card-accent {
  height: 7px;
  background:
    linear-gradient(
      90deg,
      #703795 0%,
      #f04d86 45%,
      #01aef0 100%
    );
}

.instagram-embed-wrapper {
  display: flex;
  justify-content: center;
  padding: 0.9rem;
  overflow: hidden;
}

/*
  These styles apply to the blockquote
  before Instagram converts it.
*/
.instagram-embed-wrapper
:deep(.instagram-media) {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 540px !important;
  margin: 0 auto !important;
  border: 0 !important;
  box-shadow: none !important;
}

/*
  Instagram creates an iframe dynamically.
  We cannot style the contents of the iframe,
  but we can control its outer positioning.
*/
.instagram-embed-wrapper
:deep(iframe) {
  width: 100% !important;
  max-width: 540px !important;
  margin: 0 auto !important;
}

/* ========================================
   BOTTOM CTA
======================================== */

.instagram-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem 1.5rem;
  margin-top: 2.75rem;
  text-align: center;
}

.instagram-bottom p {
  margin: 0;
  color: #63348a;
  font-size: 1rem;
}

.instagram-bottom a {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #703795;
  font-weight: 650;
  text-decoration: none;
}

.instagram-bottom a span {
  transition:
    transform 0.2s ease;
}

.instagram-bottom a:hover {
  color: #01aef0;
}

.instagram-bottom a:hover span {
  transform: translateX(4px);
}

/* ========================================
   TABLET
======================================== */

@media (max-width: 900px) {
  .instagram-section {
    padding:
      4rem 1.25rem;
  }

  .instagram-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .instagram-follow-button {
    align-self: flex-start;
  }

  .instagram-grid {
    grid-template-columns: 1fr;
    max-width: 600px;
    margin: 0 auto;
  }
}

/* ========================================
   MOBILE
======================================== */

@media (max-width: 600px) {
  .instagram-section {
    padding:
      3rem 0.85rem;
  }

  .instagram-heading h2 {
    font-size: 2.25rem;
  }

  .instagram-heading p {
    font-size: 1rem;
  }

  .instagram-follow-button {
    width: 100%;
  }

  .instagram-divider {
    margin-bottom: 1.75rem;
  }

  .instagram-grid {
    gap: 1.5rem;
  }

  .instagram-card {
    border-radius: 16px;
  }

  .instagram-embed-wrapper {
    padding: 0.35rem;
  }

  .instagram-bottom {
    flex-direction: column;
    margin-top: 2rem;
  }
}
</style>