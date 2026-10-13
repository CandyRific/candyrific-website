<template>
  <section class="landing-hello">
    <img
      src="../assets/se_design.png"
      class="se-design"
      alt=""
      aria-hidden="true"
    />

    <div class="landing-hello-container">
      <div class="landing-hello-image">
        <img
          src="../assets/hello_page_image.webp"
          alt="CandyRific candy products"
        />
      </div>

      <div class="landing-hello-message">
        <h1 class="landing-hello-title">
          <span>Making Candy</span>
          <span>More Fun</span>
        </h1>

        <div class="landing-hello-text">
          <p>
            We <em>love</em> what we do, and we think it shows in every
            product we make. Our team is always exploring new ideas, new
            flavors, and new ways to create candy that's a little different
            from everything else on the shelf.
          </p>

          <p>
            At the end of the day, we think candy should always be fun.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
/* ========================================
   HERO SECTION
======================================== */

.landing-hello {
  position: relative;
  isolation: isolate;
  overflow: hidden;

  background: linear-gradient(
    90deg,
    #6d3692 0%,
    #6250a1 25%,
    #3f6fb5 50%,
    #007fc5 65%,
    #00aced 100%
  );

  padding: 2.5rem 1.25rem 3rem;

  /*
    Gives the section a subtle, intentional
    boundary from the section below.
  */
  box-shadow:
    inset 0 -1px 0 rgba(255, 255, 255, 0.25),
    0 8px 24px rgba(53, 36, 84, 0.08);
}


/* ========================================
   DECORATIVE BACKGROUND
======================================== */

.se-design {
  position: absolute;
  z-index: -1;

  top: 0;
  left: 0;

  width: auto;
  height: 20rem;

  opacity: 0.7;

  pointer-events: none;
  user-select: none;
}


/* ========================================
   CONTENT CONTAINER
======================================== */

.landing-hello-container {
  width: 100%;
  max-width: 1400px;

  margin: 0 auto;

  display: flex;
  flex-direction: column;

  gap: 2rem;
}


/* ========================================
   PRODUCT IMAGE
======================================== */

.landing-hello-image {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
}

.landing-hello-image img {
  display: block;

  width: 100%;
  max-width: 36rem;
  max-height: 27rem;

  object-fit: contain;
}


/* ========================================
   HERO MESSAGE
======================================== */

.landing-hello-message {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  width: 100%;

  font-family: 'Fredoka', sans-serif;
  color: white;
}


/* ========================================
   HERO TITLE
======================================== */

.landing-hello-title {
  margin: 0;

  display: flex;
  flex-direction: column;

  font-family: 'Fredoka', sans-serif;
  font-size: clamp(3.25rem, 10vw, 5rem);
  font-weight: 600;

  line-height: 0.98;
  letter-spacing: -0.035em;

  color: white;
}

.landing-hello-title span {
  display: block;
}


/* ========================================
   DESCRIPTION CARD
======================================== */

.landing-hello-text {
  width: 100%;

  margin-top: 1.5rem;

  padding: 1.35rem 1.5rem;

  background: rgba(255, 255, 255, 0.98);

  border-radius: 1.25rem;

  color: #352454;

  box-shadow:
    0 14px 30px rgba(53, 36, 84, 0.15);

  /*
    Prevents the copy block from becoming
    excessively wide on large screens.
  */
  max-width: 42rem;
}

.landing-hello-text p {
  margin: 0;

  font-family: 'Fredoka', sans-serif;
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  font-weight: 400;

  line-height: 1.6;
}

.landing-hello-text p + p {
  margin-top: 1rem;
}

.landing-hello-text em {
  font-weight: 600;
}


/* ========================================
   TABLET
======================================== */

@media (min-width: 768px) {
  .landing-hello {
    padding:
      clamp(3rem, 5vw, 4.5rem)
      clamp(2rem, 4vw, 3.5rem);
  }

  .se-design {
    height: 30rem;
  }

  .landing-hello-container {
    flex-direction: row;

    align-items: center;

    gap: clamp(2rem, 4vw, 5rem);
  }

  .landing-hello-image {
    width: 52%;
  }

  .landing-hello-message {
    width: 48%;
  }

  .landing-hello-image img {
    max-width: 40rem;
    max-height: 34rem;
  }

  .landing-hello-title {
    font-size: clamp(3.5rem, 5vw, 5.75rem);
  }

  .landing-hello-text {
    margin-top: 1.75rem;

    padding: 1.75rem 2rem;

    border-radius: 1.75rem;
  }
}


/* ========================================
   LARGE DESKTOP
======================================== */

@media (min-width: 1200px) {
  .landing-hello-container {
    gap: 4.5rem;
  }

  .landing-hello-image {
    width: 55%;
  }

  .landing-hello-message {
    width: 45%;
  }
}


/* ========================================
   SMALL MOBILE
======================================== */

@media (max-width: 480px) {
  .landing-hello {
    padding:
      2rem
      1rem
      2.5rem;
  }

  .landing-hello-container {
    gap: 1.5rem;
  }

  .landing-hello-image img {
    max-height: 22rem;
  }

  .landing-hello-title {
    font-size: clamp(3rem, 14vw, 4rem);
  }

  .landing-hello-text {
    margin-top: 1.25rem;

    padding: 1.25rem;

    border-radius: 1rem;
  }
}
</style>