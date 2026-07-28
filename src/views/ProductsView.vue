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
      This is where the products will go.
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
  font-size: 5rem;
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
}

.plus-icon{
  font-weight: 700;
}

.product-section{
  min-height: 300px;
}


</style>
