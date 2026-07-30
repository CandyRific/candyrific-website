<script setup>
</script>

<template>
  <div class="product-div">

    <div class="title-div">Products</div>
    <div class="product-filter-text"> FILTER BY 152 ITEMS </div>
    <div class="product-filter">
        <div class="product-filter-option">LICENSE 
          <span class="plus-icon"> + </span>
        </div>
        <div class="product-filter-option">SEASON <span class="plus-icon"> + </span></div>
        <div class="product-filter-option">PRODUCT <span class="plus-icon">  + </span></div>
        <div class="product-filter-option">PACKAGING <span class="plus-icon"> + </span></div>
        <div class="product-filter-option">NET WEIGHT <span class="plus-icon">  + </span></div>
    </div>
    <div class="product-section">
      <div class="product-card">Dummy Product 1</div>
      <div class="product-card">Dummy Product 2</div>
      <div class="product-card">Dummy Product 3</div>
      <div class="product-card">Dummy Product 4</div>
      <div class="product-card">Dummy Product 5</div>
      <div class="product-card">Dummy Product 6</div>
      <div class="product-card">Dummy Product 7</div>
      <div class="product-card">Dummy Product 8</div>
    </div>
    <div style="display: block; padding: 1rem;">
      <div class="view-count-div">
      You've viewed 8 of 152 products.
    </div>
    <div class="load-more-div">
       <button> LOAD MORE </button>
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

.product-card {
  border: 1px solid red;
  height: 10rem;
  
}

@media (min-width: 768px) {
  .product-card {
  border: 1px solid red;
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
