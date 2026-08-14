<template>
  <div class="aboutus-div">

    <h1 class="title-div">
      About Us
    </h1>

    <div class="about-us-section">

      <div class="about-us-image">
        <img
          src="../assets/candyrific_building.png"
          alt="CandyRific building"
        >
      </div>

      <div class="about-us-text">

        <div class="about-us-text-header">
          <h2>Small Company.</h2>
        </div>

        <div>
          <p>
            CandyRific is a Louisville, Kentucky-based candy company that believes
            candy should be just as fun as it is delicious. We create unique candy
            products that combine sweet treats with playful designs, making
            everyday candy a little more exciting.
          </p>
        </div>

      </div>

    </div>


    <div class="mobile-globe">

      <div class="about-us-section">

        <div class="about-us-image">
          <img
            src="../assets/world_of_candy.png"
            alt="World of Candy"
          >
        </div>

        <div class="about-us-text">

          <div class="about-us-text-header">
            <h2>Global Reach.</h2>
          </div>

          <div>
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

    </div>


    <div class="desktop-globe">

      <div class="about-us-section">

        <div class="about-us-text">

          <div class="about-us-text-header">
            <h2>Global Reach.</h2>
          </div>

          <div>
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

        <div class="about-us-image">
          <img
            src="../assets/world_of_candy.png"
            alt="World of Candy"
          >
        </div>

      </div>

    </div>


    <div>
      <img
        class="rob-memorial"
        src="../assets/Rob_Memorial.jpg"
        alt=""
      >
    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>

.aboutus-div {
  font-family: 'Fredoka', sans-serif;
}


/* ========================================
   PAGE TITLE
======================================== */

.title-div {
  margin: 0;

  padding: clamp(1.5rem, 3vw, 3rem);

  text-align: center;

  color: #F04D86;

  font-size: clamp(3.25rem, 5vw, 6rem);
  line-height: 1;
  font-weight: 600;
}


/* ========================================
   SECTIONS
======================================== */

.about-us-section {
  display: flex;
  flex-direction: column;

  gap: 1rem;

  width: 90%;

  margin: auto;
}


/* ========================================
   TEXT BOX
======================================== */

.about-us-text {
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  padding: clamp(1.25rem, 3vw, 2.5rem);

  margin-bottom: 1rem;

  background-color: #e2f3fc;

  border-radius: 1.5rem;

  color: #352268;
}


/* ========================================
   SECTION HEADINGS
======================================== */

.about-us-text-header {
  width: 100%;
}

.about-us-text-header h2 {
  margin: 0 0 clamp(0.5rem, 1vw, 1rem) 0;

  color: #7db5df;

  font-size: clamp(2rem, 4vw, 4rem);
  line-height: 1;
  font-weight: 600;

  text-align: left;
}


/* ========================================
   PARAGRAPH TEXT
======================================== */

.about-us-text p {
  margin: 0;

  font-size: clamp(1rem, 1.35vw, 1.4rem);
  line-height: clamp(1.5rem, 2vw, 2rem);
  font-weight: 300;
}


/* ========================================
   IMAGES
======================================== */

.about-us-image {
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}

.about-us-image img {
  display: block;

  width: 100%;
  height: auto;

  object-fit: contain;
}


/* ========================================
   ROB MEMORIAL
======================================== */

.rob-memorial {
  display: block;

  width: 100%;
  height: auto;

  object-fit: contain;
}


/* ========================================
   MOBILE / DESKTOP GLOBE
======================================== */

.mobile-globe {
  display: block;
}

.desktop-globe {
  display: none;
}


/* ========================================
   DESKTOP
======================================== */

@media (min-width: 768px) {

  .about-us-section {
    flex-direction: row;

    align-items: stretch;

    gap: clamp(2rem, 3vw, 4rem);

    width: min(85%, 90rem);

    padding: 2rem;
  }

  .about-us-text {
    width: 50%;

    justify-content: flex-start;

    margin-bottom: 0;
  }

  .about-us-image {
    width: 50%;
  }

  .mobile-globe {
    display: none;
  }

  .desktop-globe {
    display: block;
  }

  .rob-memorial {
    width: min(100%, 90rem);

    margin: auto;

    padding: 0 clamp(3rem, 8vw, 12rem);
  }

}

</style>