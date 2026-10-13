<template>
  <section class="shop-section">
    <div class="shop-container">
      <div class="shop-feature">
        <div class="shop-content">
          <h2 class="shop-title">
            Buy Direct
          </h2>

          <p class="shop-description">
            CandyRific is a wholesale distributor, but we also sell our
            products directly to consumers through our Amazon storefront
            and Pantryful.
          </p>

          <div class="shop-actions">
            <a
              href="https://www.amazon.com/s?k=CandyRific&ref=bl_dp_s_web_0"
              class="shop-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shop on Amazon
            </a>

            <a
              href="https://pantryful.com/collections/candyrific"
              class="shop-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shop on Pantryful
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
/* ========================================
   SECTION
======================================== */

.shop-section {
  width: 100%;

  padding:
    clamp(3rem, 6vw, 5rem)
    clamp(1rem, 4vw, 3rem);

  background: #ffffff;

  border-bottom:
    1px solid rgba(112, 55, 149, 0.1);

  font-family: 'Fredoka', sans-serif;
}


/* ========================================
   PAGE WIDTH
======================================== */

.shop-container {
  width: 100%;
  max-width: 1400px;

  margin: 0 auto;
}


/* ========================================
   FEATURE AREA
======================================== */

.shop-feature {
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 34rem;

  overflow: hidden;

  padding: 1.5rem;

  background-image:
    linear-gradient(
      rgba(53, 36, 84, 0.12),
      rgba(53, 36, 84, 0.12)
    ),
    url('/src/assets/Candy_Background.jpg');

  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  border-radius: 1.5rem;
}


/* ========================================
   CONTENT CARD
======================================== */

.shop-content {
  position: relative;

  width: 100%;
  max-width: 39rem;

  padding:
    clamp(1.5rem, 5vw, 2.75rem);

  background:
    rgba(255, 255, 255, 0.97);

  border:
    1px solid rgba(255, 255, 255, 0.75);

  border-radius: 1.5rem;

  box-shadow:
    0 18px 45px rgba(53, 36, 84, 0.22);

  backdrop-filter: blur(3px);
}


/* ========================================
   TITLE
======================================== */

.shop-title {
  margin: 0;

  color: #1c8bc3;

  font-family: 'Fredoka', sans-serif;

  font-size:
    clamp(2.75rem, 7vw, 4.25rem);

  font-weight: 600;

  line-height: 1;

  letter-spacing: -0.025em;
}


/* ========================================
   DESCRIPTION
======================================== */

.shop-description {
  margin:
    1.25rem
    0
    0;

  color: #703795;

  font-size:
    clamp(1.05rem, 1.6vw, 1.25rem);

  font-weight: 300;

  line-height: 1.6;
}


/* ========================================
   ACTIONS
======================================== */

.shop-actions {
  display: flex;

  flex-direction: column;

  gap: 0.85rem;

  margin-top: 1.75rem;
}


/* ========================================
   BUTTONS
======================================== */

.shop-button {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;

  padding:
    0.9rem
    1.4rem;

  color: #ffffff;

  background:
    linear-gradient(
      90deg,
      #703795 0%,
      #4f5eab 45%,
      #01aef0 100%
    );

  border-radius: 0.85rem;

  font-family: 'Fredoka', sans-serif;

  font-size: 1.1rem;

  font-weight: 500;

  line-height: 1.2;

  text-align: center;
  text-decoration: none;

  box-shadow:
    0 5px 14px rgba(53, 36, 84, 0.18);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}


/* ========================================
   BUTTON INTERACTIONS
======================================== */

.shop-button:hover {
  transform: translateY(-2px);

  box-shadow:
    0 8px 18px rgba(53, 36, 84, 0.24);

  filter: brightness(1.03);
}

.shop-button:active {
  transform: translateY(0);

  box-shadow:
    0 3px 8px rgba(53, 36, 84, 0.18);
}

.shop-button:focus-visible {
  outline:
    4px solid rgba(250, 209, 65, 0.8);

  outline-offset: 3px;
}


/* ========================================
   TABLET
======================================== */

@media (min-width: 768px) {

  .shop-feature {
    min-height: 28rem;

    padding:
      clamp(2rem, 4vw, 3rem);
  }

  .shop-content {
    margin-right: auto;
  }

  .shop-actions {
    flex-direction: row;
  }

  .shop-button {
    width: auto;

    min-width: 10.5rem;
  }
}


/* ========================================
   DESKTOP
======================================== */

@media (min-width: 1100px) {

  .shop-feature {
    min-height: 30rem;

    padding:
      3.5rem;
  }

  .shop-content {
    max-width: 42rem;

    padding:
      3rem;
  }

}


/* ========================================
   SMALL MOBILE
======================================== */

@media (max-width: 480px) {

  .shop-section {
    padding:
      2.5rem
      1rem;
  }

  .shop-feature {
    min-height: 33rem;

    padding: 1rem;

    border-radius: 1.25rem;
  }

  .shop-content {
    padding: 1.4rem;

    border-radius: 1.25rem;
  }

  .shop-title {
    font-size: 3rem;
  }

}
</style>