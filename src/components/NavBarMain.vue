
<script setup>
import image from '../assets/candyrific_logo.png'
import { RouterLink } from 'vue-router'
</script>
<template>


    
    <div class="nav-container"> 
      <div class="logo-container">
        <RouterLink  to="/" aria-label="Candyrific home">
            <img height="100rem" width="auto" :src="image" alt="Candyrific" />
        </RouterLink>
      </div>
        


      

      <nav  aria-label="Main navigation">
        <ul class="nav-items">
              <li ><a  href="/about" class="main-nav-link">ABOUT US</a></li>
              <li ><RouterLink to="/products" class="main-nav-link">PRODUCTS</RouterLink></li>
              <li ><a href="#contact" class="main-nav-link">CONTACT US</a></li>
        </ul>
      </nav>
    </div>
 
</template>



<style  scoped>



.nav-container {
  max-height: 15vh;
  padding: 1.5rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-bottom: .5px solid gray;
}



.nav-items {
  display: flex;
  flex-direction: row;
  gap: 3rem;
  justify-content: flex-end;
  list-style-type: none;
  flex-grow: 1;
}


.main-nav-link {
  font-size: x-large;
  color: #703795;
  font-family: Fredoka One, sans-serif;
  text-decoration: none;
  font-family: 'Fredoka', sans-serif;
  padding: .3rem;
}

.main-nav-link:hover {
  color: white;
  font-family: 'Fredoka', sans-serif;
  font-size: x-large;
  background-color: #F04D86;
  border-radius: 5px;
  text-decoration: none;
  padding: .3rem;
}

</style>