<script setup>
import { onMounted } from 'vue'

const instagramProfileUrl =
  'https://www.instagram.com/candyrificllc/'

const instagramPostUrl =
  'https://www.instagram.com/candyrificllc/p/DeARJiMJ4pO/'

const loadInstagramEmbed = () => {
  if (window.instgrm?.Embeds) {
    window.instgrm.Embeds.process()
    return
  }

  const existingScript =
    document.querySelector(
      'script[src="https://www.instagram.com/embed.js"]'
    )

  if (existingScript) {
    existingScript.addEventListener(
      'load',
      () => {
        window.instgrm?.Embeds?.process()
      }
    )

    return
  }

  const script =
    document.createElement('script')

  script.src =
    'https://www.instagram.com/embed.js'

  script.async = true

  script.onload = () => {
    window.instgrm?.Embeds?.process()
  }

  document.body.appendChild(script)
}

onMounted(() => {
  loadInstagramEmbed()
})
</script>

<template>
  <section class="instagram-section">
    <div class="instagram-container">
      <div class="instagram-profile">
        <div class="instagram-profile-left">
          <div class="instagram-avatar">
            <span>C</span>
          </div>

          <div class="instagram-profile-info">
            <div class="instagram-name-row">
              <a
                :href="instagramProfileUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="instagram-username"
              >
                candyrificllc
              </a>

              <span class="instagram-icon">
                ◎
              </span>
            </div>

            <div class="instagram-display-name">
              CandyRific
            </div>

            <p class="instagram-bio">
              The candy EXPERIENCE company!
              Making candy more fun with
              world-class brands.
            </p>
          </div>
        </div>

        <a
          :href="instagramProfileUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="instagram-follow-button"
        >
          Follow on Instagram
        </a>
      </div>

      <div class="instagram-divider"></div>

      <div class="instagram-feed">
        <div class="instagram-post">
          <blockquote
            class="instagram-media"
            :data-instgrm-permalink="instagramPostUrl"
            data-instgrm-version="14"
          ></blockquote>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.instagram-section {
  width: 100%;
  padding: 70px 24px;
  background: #ffffff;
}

.instagram-container {
  max-width: 1180px;
  margin: 0 auto;
}

.instagram-profile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 28px 0 34px;
}

.instagram-profile-left {
  display: flex;
  align-items: center;
  gap: 24px;
  min-width: 0;
}

.instagram-avatar {
  width: 92px;
  height: 92px;
  flex-shrink: 0;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 4px;

  background:
    linear-gradient(
      135deg,
      #f04d86,
      #703795,
      #01aef0
    );
}

.instagram-avatar span {
  width: 100%;
  height: 100%;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #ffffff;

  font-size: 38px;
  font-weight: 700;
  color: #703795;
}

.instagram-profile-info {
  min-width: 0;
}

.instagram-name-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.instagram-username {
  color: #111111;
  text-decoration: none;

  font-size: 23px;
  font-weight: 600;
}

.instagram-username:hover {
  text-decoration: underline;
}

.instagram-icon {
  color: #703795;
  font-size: 22px;
}

.instagram-display-name {
  margin-top: 6px;

  color: #222222;

  font-size: 16px;
  font-weight: 600;
}

.instagram-bio {
  max-width: 520px;

  margin: 10px 0 0;

  color: #555555;

  font-size: 15px;
  line-height: 1.55;
}

.instagram-follow-button {
  flex-shrink: 0;

  padding: 13px 22px;

  border-radius: 10px;

  background:
    linear-gradient(
      90deg,
      #703795,
      #01aef0
    );

  color: #ffffff;
  text-decoration: none;

  font-size: 14px;
  font-weight: 600;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.instagram-follow-button:hover {
  transform: translateY(-2px);

  box-shadow:
    0 8px 20px
    rgba(112, 55, 149, 0.25);
}

.instagram-divider {
  height: 1px;
  background: #e8e8e8;
}

.instagram-feed {
  padding-top: 30px;

  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 18px;
}

.instagram-post {
  width: 100%;
  min-width: 0;

  border-radius: 14px;
  overflow: hidden;

  background: #fafafa;
}

.instagram-post :deep(.instagram-media) {
  width: 100% !important;
  min-width: 0 !important;
  margin: 0 !important;
}

@media (max-width: 900px) {
  .instagram-profile {
    align-items: flex-start;
  }

  .instagram-feed {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 650px) {
  .instagram-section {
    padding: 45px 18px;
  }

  .instagram-profile {
    flex-direction: column;
  }

  .instagram-profile-left {
    align-items: flex-start;
  }

  .instagram-avatar {
    width: 72px;
    height: 72px;
  }

  .instagram-avatar span {
    font-size: 30px;
  }

  .instagram-follow-button {
    width: 100%;
    text-align: center;
  }

  .instagram-feed {
    grid-template-columns: 1fr;
  }
}
</style>