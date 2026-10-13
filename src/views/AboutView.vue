<template>
  <main class="about-page">
    <section class="about-hero">
      <div class="about-page-container">
        <h1 class="title-div">
          About Us
        </h1>
      </div>
    </section>


    <!-- ========================================
         SMALL COMPANY
    ========================================= -->

    <section class="about-section">
      <div class="about-page-container">
        <div class="about-us-section">

          <div class="about-us-image">
            <img
              src="../assets/candyrific_building.png"
              alt="CandyRific building in Louisville, Kentucky"
            >
          </div>

          <div class="about-us-text">
            <h2>
              Small Company.
            </h2>

            <p>
              CandyRific is a Louisville, Kentucky-based candy company that
              believes candy should be just as fun as it is delicious. We create
              unique candy products that combine sweet treats with playful designs,
              making everyday candy a little more exciting.
            </p>
          </div>

        </div>
      </div>
    </section>


    <!-- ========================================
         GLOBAL REACH
    ========================================= -->

    <section class="about-section about-section-alt">
      <div class="about-page-container">
        <div class="about-us-section about-us-section-reverse">

          <div class="about-us-image">
            <img
              src="../assets/world_of_candy.png"
              alt="Illustration representing CandyRific's global reach"
            >
          </div>

          <div class="about-us-text">
            <h2>
              Global Reach.
            </h2>

            <p>
              While we're proudly based in Louisville, Kentucky, our reach extends
              far beyond the U.S. We design and manufacture our products through
              our trusted overseas production partners and distribute them through
              a nationwide broker network managed by our experienced sales team.
              Today, you'll find CandyRific products at many of the largest
              retailers across the United States, as well as through distributors
              serving markets around the world.
            </p>
          </div>

        </div>
      </div>
    </section>


    <!-- ========================================
         MEMORIAL
    ========================================= -->

    <section class="memorial-section">
      <div class="about-page-container">
        <div class="memorial-wrapper">
          <img
            class="rob-memorial"
            src="../assets/Rob_Memorial.jpg"
            alt="CandyRific memorial"
          >
        </div>
      </div>
    </section>

  </main>
</template>

<script setup>
</script>

<style scoped>
/* ========================================
   PAGE
======================================== */

.about-page {
  width: 100%;

  font-family:
    'Fredoka',
    sans-serif;

  background: #ffffff;

  color: #352268;
}


/* ========================================
   SHARED WIDTH
======================================== */

.about-page-container {
  width: 100%;
  max-width: 1400px;

  margin: 0 auto;

  padding:
    0
    clamp(1rem, 4vw, 3rem);
}


/* ========================================
   PAGE TITLE
======================================== */

.about-hero {
  padding:
    clamp(2.5rem, 5vw, 4rem)
    0
    clamp(1.75rem, 3vw, 2.5rem);

  background:
    linear-gradient(
      180deg,
      rgba(240, 77, 134, 0.05),
      rgba(240, 77, 134, 0)
    );
}

.title-div {
  margin: 0;

  text-align: center;

  color: #f04d86;

  font-size:
    clamp(
      3.25rem,
      6vw,
      5.5rem
    );

  line-height: 1;

  font-weight: 600;

  letter-spacing: -0.03em;
}


/* ========================================
   PAGE SECTIONS
======================================== */

.about-section {
  padding:
    clamp(2.5rem, 5vw, 4.5rem)
    0;
}

.about-section-alt {
  background:
    linear-gradient(
      180deg,
      rgba(1, 174, 240, 0.035),
      rgba(112, 55, 149, 0.025)
    );

  border-top:
    1px solid
    rgba(112, 55, 149, 0.08);

  border-bottom:
    1px solid
    rgba(112, 55, 149, 0.08);
}


/* ========================================
   SECTION LAYOUT
======================================== */

.about-us-section {
  display: flex;

  flex-direction: column;

  align-items: stretch;

  gap:
    clamp(
      1.5rem,
      4vw,
      4rem
    );
}


/* ========================================
   IMAGE
======================================== */

.about-us-image {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
}

.about-us-image img {
  display: block;

  width: 100%;
  height: auto;

  max-height: 32rem;

  object-fit: contain;

  border-radius: 1.5rem;
}


/* ========================================
   TEXT CARD
======================================== */

.about-us-text {
  display: flex;

  flex-direction: column;

  justify-content: center;

  width: 100%;

  padding:
    clamp(
      1.5rem,
      4vw,
      2.75rem
    );

  background:
    linear-gradient(
      135deg,
      #eaf7fd 0%,
      #dff1fb 100%
    );

  border:
    1px solid
    rgba(125, 181, 223, 0.3);

  border-radius: 1.5rem;

  box-shadow:
    0
    12px
    30px
    rgba(
      53,
      34,
      104,
      0.08
    );
}


/* ========================================
   SECTION HEADINGS
======================================== */

.about-us-text h2 {
  margin:
    0
    0
    clamp(
      0.85rem,
      2vw,
      1.25rem
    );

  color: #7db5df;

  font-size:
    clamp(
      2.25rem,
      4vw,
      4rem
    );

  line-height: 1;

  font-weight: 600;

  letter-spacing: -0.025em;
}


/* ========================================
   BODY TEXT
======================================== */

.about-us-text p {
  margin: 0;

  max-width: 42rem;

  font-size:
    clamp(
      1rem,
      1.35vw,
      1.25rem
    );

  line-height: 1.65;

  font-weight: 300;

  color: #352268;
}


/* ========================================
   MEMORIAL
======================================== */

.memorial-section {
  padding:
    clamp(3rem, 6vw, 5rem)
    0
    clamp(4rem, 7vw, 6rem);
}

.memorial-wrapper {
  width: 100%;

  max-width: 70rem;

  margin: 0 auto;

  overflow: hidden;

  border-radius: 1.5rem;

  box-shadow:
    0
    12px
    32px
    rgba(
      53,
      34,
      104,
      0.1
    );
}

.rob-memorial {
  display: block;

  width: 100%;
  height: auto;

  object-fit: contain;
}


/* ========================================
   DESKTOP
======================================== */

@media (min-width: 768px) {

  .about-us-section {
    flex-direction: row;

    align-items: stretch;
  }

  .about-us-section-reverse {
    flex-direction: row-reverse;
  }

  .about-us-image,
  .about-us-text {
    width: 50%;
  }

  .about-us-image img {
    max-height: 34rem;
  }

}


/* ========================================
   LARGE DESKTOP
======================================== */

@media (min-width: 1200px) {

  .about-us-section {
    gap: 4.5rem;
  }

  .about-us-text {
    padding: 3rem;
  }

}


/* ========================================
   SMALL MOBILE
======================================== */

@media (max-width: 480px) {

  .about-hero {
    padding:
      2.5rem
      0
      1.5rem;
  }

  .about-section {
    padding:
      2.25rem
      0;
  }

  .about-us-text {
    padding: 1.35rem;

    border-radius: 1.25rem;
  }

  .about-us-image img {
    border-radius: 1.25rem;
  }

  .memorial-section {
    padding:
      2.5rem
      0
      3.5rem;
  }

  .memorial-wrapper {
    border-radius: 1.25rem;
  }

}
</style>