
<script setup>
import image from '../assets/candyrific_logo.png'
import { RouterLink } from 'vue-router'
</script>
<template>


    
    <div class="nav-container"> 
      <div class="logo-container">
        <RouterLink  to="/" aria-label="Candyrific home">
            <img :src="image" alt="Candyrific" />
        </RouterLink>
      </div>
        


      
      <div>
        <nav  aria-label="Main navigation">
        <ul class="nav-items">
              <li ><a  href="/about" class="main-nav-link">ABOUT US</a></li>
              <li ><RouterLink to="/products" class="main-nav-link">PRODUCTS</RouterLink></li>
              <li ><a href="#contact" class="main-nav-link">CONTACT US</a></li>
        </ul>
      </nav>
      </div>
      
    </div>
 
</template>



<style  scoped>

.logo-container {

}

.logo-container img {
  width: 120px;
  height: auto;
  display: block;
}

@media (min-width: 768px) {
  .logo-container img {
    width: 200px;
    height: auto;
    display: block;
  }
}



.nav-container {
  padding: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  z-index: 2;
  width: 100%;
  background-color: white;
  overflow-x: scroll;

}

@media (min-width: 768px) {
  .nav-container {
    max-height: 15vh;
    padding: 1.5rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    position: fixed;
    width: 100%;
    background-color: white;
    top: 47px;
    z-index: 2;
    overflow-x: hidden;
    overflow-y: hidden;
  }
}



.nav-items {
  display: flex;
  flex-direction: row;
  gap: .5rem;
  list-style-type: none;
  flex-grow: 1;
  white-space: nowrap;
  font-size: 1rem;
  padding-inline-start: 10px;
  font-weight: bold;
}

.nav-items li {
  white-space: nowrap;
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  .nav-items {
    display: flex;
    flex-direction: row;
    gap: 3rem;
    justify-content: flex-end;
    list-style-type: none;
    flex-grow: 1;
    padding-inline-start: 40px;
  }
}

.main-nav-link {
  font-size: clamp(1rem, 1vh, 1.5rem);
  color: #703795;
  text-decoration: none;
  font-family: 'Fredoka', sans-serif;
  padding: .3rem;
  font-weight: bold;
  text-decoration: underline;

}


@media (min-width: 768px) {
  .main-nav-link {
  font-size: x-large;
  color: #703795;
  font-family: Fredoka One, sans-serif;
  text-decoration: none;
  font-family: 'Fredoka', sans-serif;
  padding: .3rem;
  font-weight: bold;
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
}

</style>