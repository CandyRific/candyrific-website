<template>
  <div class="aboutus-div">
    <h1 class="title-div">About Us</h1>
    <div class="about-us-section">
      <div class="about-us-image">
        <img  src="../assets/candyrific_building.png">
      </div>
      
      <div class="about-us-text"> 
        <div class="about-us-text-header">
          <h2 >Small Company.</h2>
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
        <img  src="../assets/world_of_candy.png">
      </div>
      <div class="about-us-text"> 
        <div class="about-us-text-header">
          <h2 >Global Reach.</h2>
        </div>
        
        <div>
          <p>
          While we're proudly based in Louisville, Kentucky, our reach extends far beyond the U.S. 
          We design and manufacture our products through our trusted overseas production partners and distribute them through a nationwide broker network managed by our experienced sales team. 
          Today, you'll find CandyRific products at many of the largest retailers across the United States, as well as through distributors serving markets around the world.
        </p>
        </div>
        
      </div>
      
      
      
    </div>
    </div>

    <div class="desktop-globe">
      <div class="about-us-section">
      <div class="about-us-text"> 
        <div class="about-us-text-header">
          <h2 >Global Reach.</h2>
        </div>
        
        <div>
          <p>
          While we're proudly based in Louisville, Kentucky, our reach extends far beyond the U.S. 
          We design and manufacture our products through our trusted overseas production partners and distribute them through a nationwide broker network managed by our experienced sales team. 
          Today, you'll find CandyRific products at many of the largest retailers across the United States, as well as through distributors serving markets around the world.
        </p>
        </div>
        
      </div>
      <div class="about-us-image">
        <img  src="../assets/world_of_candy.png">
      </div>
      
      
    </div>
    </div>
    
  </div>
</template>

<script setup>
 
</script>

<style scoped>

.aboutus-div{
  font-family: 'Fredoka', sans-serif;
}

.title-div{
  text-align: center;
  color: #F04D86;
  padding: 2rem;
  font-weight: 600;
  font-size: 4rem;
}

.about-us-section{
  display: flex;
  flex-direction: column;
  gap: 1rem;
  /* border: 1px solid red; */
  width: 90%;
  margin: auto;
}

@media (min-width: 768px){
  .about-us-section{
    display: flex;
    flex-direction: row;
    gap: 3rem;
    padding: 2rem;
    /* border: 1px solid red; */
    width: 75%;
    margin: auto;
  }
}




.about-us-text {
  background-color: #e2f3fc;
  border-radius: 1.5rem;
  padding: 1rem;
  color: #352268;
  font-size: .75rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 1rem;
  
  /* border: 1px solid red; */
}

.about-us-text p{
  font-size: 1rem;
}

@media (min-width: 768px){
  .about-us-text {
    background-color: #e2f3fc;
    border-radius: 1.5rem;
    padding: 2.5rem;
    color: #352268;
    font-size: 1rem;
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    /* border: 1px solid red; */
  }
}

.about-us-text-header {
  color: #7db5df;
  font-size: 2.5rem;
}

.about-us-text-header h2 {
  font-size: 2rem;
  margin: 0;
  margin-block-start: 0;
  margin-block-end: 0;
  line-height: 1.75rem;
  margin-bottom: .5rem;
  text-align: left;
  font-size: 2rem;
  color: #7db5df;
  font-weight: 600;
}

@media (min-width: 768px){
  .about-us-text-header h2 {
    font-size: 2.5rem;
    margin: 0;
    margin-block-start: 0;
    margin-block-end: 0;
    line-height: 2.5rem;
    margin-bottom: 1rem;
    text-align: left;
    font-size: 3rem;
    color: #7db5df;
  }
}



.about-us-text-text {

}

.about-us-image {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid red; */
  object-fit: contain;
}

@media (min-width: 768px){
  .about-us-image {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    /* border: 1px solid red; */
    object-fit: contain;
  }
}

.about-us-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}


/* Changing the order of the mobile globe section */
.mobile-globe {
  display: block;
}

.desktop-globe {
  display: none;
}

@media (min-width: 768px){
  .mobile-globe {
    display: none;
  }
  .desktop-globe {
    display: block;
  }
}
</style>
