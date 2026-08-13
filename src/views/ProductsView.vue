<script setup>
</script>
<script setup>
</script>

<template>
  <div class="product-div">

    <div class="title-div">Products</div>

    <div class="product-filter-text">
      FILTER BY 152 ITEMS
    </div>

    <div class="product-filter">
      <div class="product-filter-option">
        LICENSE
        <span class="plus-icon"> + </span>
      </div>

      <div class="product-filter-option">
        SEASON
        <span class="plus-icon"> + </span>
      </div>

      <div class="product-filter-option">
        PRODUCT
        <span class="plus-icon"> + </span>
      </div>
    </div>

    <div class="product-section">

      <div class="product-card-parent">
        <div class="product-card">
          <img
            src="../assets/products/14174 Disney Helicopter Fan Display front.jpg"
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
            src="../assets/products/11928 Marvel Candy Fan Display.png"
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
            src="../assets/products/17466 HelicopterFan_Display.png"
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
            src="../assets/products/16113 SweetSquad_12ctDisplay.png"
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
            src="../assets/products/14604 Licensed Assorted Sweet Spinz Fan HIRES.jpg"
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
            src="../assets/products/13676 Spongebob Stretch-eez HIRES.png"
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
            src="../assets/products/14529 Stitch Stretch-eez card.png"
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
            src="../assets/products/13706 Shrek_Stretcheez_BlisterCard.png"
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
            src="../assets/products/94034_10ct_WH_ED_LMB.png"
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
            src="../assets/products/96566 Warheads_4pkPopping Candy_Peg Bag.png"
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
            src="../assets/products/97739-HI WarHeads 40ct. Popping Candy Gusset Bag 3.17oz.png"
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
            src="../assets/products/16202 Kool-Aid 10ct. Loud Mouth Bites Peg Bag unit render.jpg"
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
            src="../assets/products/19856 Kool-Aid Bubblegum Cotton Candy Peg Bag.jpg"
            alt="Kool-Aid Bubblegum Cotton Candy"
          >
        </div>
        <div class="product-text-div">
          Kool-Aid Cotton Candy Bubble Gum Peg Bag
        </div>
      </div>

    </div>

    <div style="display: block; padding: 1rem;">
      <div class="view-count-div">
        You've viewed 13 of 152 products.
      </div>

      <div class="load-more-div">
        <button>
          LOAD MORE
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.product-div{
  background: #e6f4fd;
  color: #1c8bc3;
  font-family: 'Fredoka', sans-serif;
}

.title-div{
  text-align: center;
  padding: 2rem;
  font-size: 3rem;
}

@media (min-width: 768px){
.title-div{
  text-align: center;
  padding: 2rem;
  font-size: 5rem;
}
}


.product-filter-text {
  text-align: left;
  margin: .5rem;
}

.product-filter {
  background: linear-gradient(
  90deg,
  #39a4da 0%,
  #027dc3 100%
);
display: flex;
overflow-x: scroll;
gap: 1rem;
padding: 1rem;
}

.product-filter-option {
  background: #e9faff;
  border-radius: 5px;
  padding: 1rem;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  max-height: 30px;
  white-space: nowrap;
}

.product-filter-option:hover{
  background: rgba(0,0,0,.05);
  color: white;
  border: 1px solid white;
}

.plus-icon{
  font-weight: 700;
}

.product-section{
  border: 1px solid red;
  padding: 1rem;
        display: grid;
        grid-template-columns: repeat(2, minmax(0px, 1fr));
        gap: .5rem;
}

@media (min-width: 768px) {
  .product-section {
    border: 1px solid red;
  padding: 4rem;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
  }
}

.product-text-div{
    padding: .5rem;
    text-align: center;
    color: black;
}



.product-card:active{
  box-shadow: none;
}

.product-card {
  /* border: 1px solid red; */
  border-radius: 10px;
  height: 10rem;
  width: auto;
  background: white;
  
}

.product-card-parent {
  /* border: 1px solid red; */
  border-radius: 10px;
}

.product-card:hover {
  box-shadow: 1px 1px 5px #027dc3;
    border: 2px solid #027dc3;
}

.product-card img {
  object-fit: contain;
  height: 100%;
  width: 100%;
}

@media (min-width: 768px) {
  .product-card {
  /* border: 1px solid red; */
  height: 15rem;
  
}
}

.view-count-div{
  text-align: center;
}

.load-more-div {
  display: flex;
  justify-content: center;
}




</style>
