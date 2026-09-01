<script setup>

</script>

<template>
  <div class="product-div">

    <div class="title-div">
      Products
    </div>

    <div class="products-update-message">
      We're actively adding more products and features to this page.
      Check back soon for more CandyRific products and updates.
    </div>

    <div class="product-section">

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/14174 Disney Helicopter Fan Display front.webp"
            alt="Disney Helicopter Fan"
          >
        </div>

        <div class="product-text-div">
          Disney Assorted Candy Fan
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/11928 Marvel Candy Fan Display.webp"
            alt="Marvel Candy Fan"
          >
        </div>

        <div class="product-text-div">
          Marvel Avengers Assorted Character Fans
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/17466 HelicopterFan_Display.webp"
            alt="Helicopter Fan Display"
          >
        </div>

        <div class="product-text-div">
          CandyRific Light Up Helicopter Fan
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/16113 SweetSquad_12ctDisplay.webp"
            alt="Sweet Squad 12 Count Display"
          >
        </div>

        <div class="product-text-div">
          CandyRific Sweet Squad Fans
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/14604 Licensed Assorted Sweet Spinz Fan HIRES.webp"
            alt="Licensed Assorted Sweet Spinz Fan"
          >
        </div>

        <div class="product-text-div">
          Licensed Assorted Sweet Spinz Fan
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/13676 Spongebob Stretch-eez HIRES.webp"
            alt="SpongeBob Stretch-eez"
          >
        </div>

        <div class="product-text-div">
          Nickelodeon SpongeBob Stretch-eez
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/14529 Stitch Stretch-eez card.webp"
            alt="Stitch Stretch-eez"
          >
        </div>

        <div class="product-text-div">
          Disney Stitch Stretch-eez
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/13706 Shrek_Stretcheez_BlisterCard.webp"
            alt="Shrek Stretch-eez"
          >
        </div>

        <div class="product-text-div">
          Universal Shrek Stretch-eez
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/94034_10ct_WH_ED_LMB.webp"
            alt="Warheads Loud Mouth Bites"
          >
        </div>

        <div class="product-text-div">
          Warheads 10ct. Loud Mouth Bites Peg Bag
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/96566 Warheads_4pkPopping Candy_Peg Bag.webp"
            alt="Warheads Popping Candy"
          >
        </div>

        <div class="product-text-div">
          Warheads 4pk. Popping Candy Peg Bag
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/97739-HI WarHeads 40ct. Popping Candy Gusset Bag 3.17oz.webp"
            alt="Warheads 40 Count Popping Candy Gusset Bag"
          >
        </div>

        <div class="product-text-div">
          Warheads SOUR 40ct. Popping Candy Bag
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/16202 Kool-Aid 10ct. Loud Mouth Bites Peg Bag unit render.webp"
            alt="Kool-Aid Loud Mouth Bites"
          >
        </div>

        <div class="product-text-div">
          Kool-Aid 10ct. Loud Mouth Bites Peg Bag
          <br>
          COMING SOON
          <br>
          Available October 15, 2026
        </div>
      </div>

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/19856 Kool-Aid Bubblegum Cotton Candy Peg Bag.webp"
            alt="Kool-Aid Bubblegum Cotton Candy"
          >
        </div>

        <div class="product-text-div">
          Kool-Aid Cotton Candy Bubble Gum Peg Bag
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>

.product-div {
  background: #e6f4fd;
  color: #1c8bc3;

  font-family: 'Fredoka', sans-serif;
}


/* ========================================
   PAGE TITLE
======================================== */

.title-div {
  padding: clamp(1.5rem, 3vw, 3rem);

  text-align: center;

  font-size: clamp(3.25rem, 5vw, 6rem);
  line-height: 1;
  font-weight: 600;
}


/* ========================================
   UPDATE MESSAGE
======================================== */

.products-update-message {
  width: min(90%, 50rem);

  margin: 0 auto clamp(1.5rem, 3vw, 2.5rem);
  padding: 0 1rem;

  text-align: center;

  color: #703795;

  font-size: clamp(1rem, 1.35vw, 1.3rem);
  line-height: clamp(1.5rem, 2vw, 1.9rem);
  font-weight: 300;
}


/* ========================================
   PRODUCT GRID
======================================== */

.product-section {
  padding: clamp(1rem, 4vw, 4rem);

  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: clamp(0.5rem, 1.5vw, 1rem);
}


/* ========================================
   PRODUCT CARD
======================================== */

.product-card-parent {
  min-width: 0;

  border-radius: 10px;
}

.product-card {
  height: clamp(10rem, 22vw, 15rem);

  background: white;

  border-radius: 10px;

  overflow: hidden;
}

.product-card:active {
  box-shadow: none;
}

.product-card img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: contain;
}


/* ========================================
   PRODUCT TEXT
======================================== */

.product-text-div {
  padding: clamp(0.5rem, 1vw, 0.85rem);

  text-align: center;

  color: black;

  font-size: clamp(0.9rem, 1.25vw, 1.2rem);
  line-height: clamp(1.25rem, 1.7vw, 1.65rem);
  font-weight: 400;
}


/* ========================================
   FILTERS
======================================== */

.product-filter-text {
  margin: 0.5rem;

  text-align: left;

  font-size: clamp(0.9rem, 1vw, 1.1rem);
  line-height: 1.4;
}

.product-filter {
  display: flex;

  gap: 1rem;

  padding: 1rem;

  overflow-x: auto;

  background: linear-gradient(
    90deg,
    #39a4da 0%,
    #027dc3 100%
  );
}

.product-filter-option {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  max-height: 30px;

  padding: 1rem;

  background: #e9faff;

  border-radius: 5px;

  white-space: nowrap;

  font-size: clamp(0.9rem, 1vw, 1.1rem);
}

.product-filter-option:hover {
  background: rgba(0, 0, 0, 0.05);

  color: white;

  border: 1px solid white;
}

.plus-icon {
  font-weight: 700;
}


/* ========================================
   VIEW / LOAD MORE
======================================== */

.view-count-div {
  text-align: center;

  font-size: clamp(1rem, 1.2vw, 1.2rem);
  line-height: 1.5;
}

.load-more-div {
  display: flex;
  justify-content: center;
}


/* ========================================
   DESKTOP
======================================== */

@media (min-width: 768px) {

  .product-section {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

}

</style>