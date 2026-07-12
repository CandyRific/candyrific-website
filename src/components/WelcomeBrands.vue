<script setup>

</script>

<template>
  <section class="welcome-section">
    <div class="inner-welcome">
      <h2 class="brand-heading">
        Brands
      </h2>
      
      <div class="brand-display">
        <div class="logo-display" style="grid-column: 1; grid-row: 1;">
  <a>
    <img
      src="/src/assets/brand_images/disney_600x600.png"
      alt="Disney"
    />
  </a>
</div>

<div class="logo-display" style="grid-column: 2; grid-row: 1;">
  <a>
    <img
      src="/src/assets/brand_images/disney_stitch_600x600.png"
      alt="Disney Stitch"
    />
  </a>
</div>

<div class="logo-display" style="grid-column: 3; grid-row: 1;">
  <a>
    <img
      src="/src/assets/brand_images/elf_on_the_shelf_600x600.png"
      alt="Elf on the Shelf"
    />
  </a>
</div>

<div class="logo-display" style="grid-column: 1; grid-row: 2;">
  <a>
    <img
      src="/src/assets/brand_images/nightmare_before_christmas_600x600.png"
      alt="The Nightmare Before Christmas"
    />
  </a>
</div>

<div class="logo-display" style="grid-column: 2; grid-row: 2;">
  <a>
    <img
      src="/src/assets/brand_images/shrek_600x600.png"
      alt="Shrek"
    />
  </a>
</div>

<div class="logo-display" style="grid-column: 3; grid-row: 2;">
  <a>
    <img
      src="/src/assets/brand_images/spongebob_squarepants_600x600.png"
      alt="SpongeBob SquarePants"
    />
  </a>
</div>
      </div>

      <div class="minion">
        <img src="/src/assets/brand_images/evil-minions-png-24.png" alt="Candyrific Brand Banner" />
      </div>
      <div class="troll">
        <img src="/src/assets/brand_images/trolls_lady-removebg-preview.png" alt="Candyrific Brand Banner" />
      </div>
    </div>


    

  </section>
</template>

<style scoped>

  .minion {
  position: absolute;
  top: 66%;
  right: 0;
  transform: translate(50%, -50%);
  z-index: 1;

}

.troll {
     height: 25rem;
    width: auto;
    position: absolute;
    top: 0%;
    left: 0;
    z-index: 1;
    transform: translate(-.5rem);
}

.troll img {
  height: 100%;
  width: auto;
}

@media (max-width: 1100px) {
  .minion {
    display: none;
  }

  .troll {
    display: none;
  }
}

.brand-display {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* grid-auto-flow: row; */
  gap: 1rem;
}

.brand-display img{
  width: 100%;
  height: auto;
  border-radius: 8px;
  max-width: 18rem;

}

.logo-display {
  border: 2px solid white;
  
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.05);
}

.logo-display:hover {
  border: 2px solid #F04D86;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.10);
}

.logo-display:active {
  
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.20);
}


.brand-heading {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: #FFFFFF;
  text-align: center;
  margin-bottom: 1rem;
}

.welcome-section {
  width: min(var(--max-width), calc(100% - 2rem));
  margin: 16px auto 0;
}

.inner-welcome {
  width: 100%;
  min-height: clamp(420px, 58vw, 720px);
  padding: clamp(1.25rem, 3vw, 2.5rem);
  background:
  linear-gradient(
    115deg,
    #320152 0%,
    #3d075d 24%,
    #5e2783 52%,
    #316bb0 76%,
    #00afe0 100%
  );
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}











@media (max-width: 700px) {
  .welcome-section {
    width: min(100% - 1rem, var(--max-width));
    margin-top: 8px;
  }

  .inner-welcome {
    padding: 1rem;
  }

  

  .brand-banner-wrap {
    width: 100%;
  }
}
</style>

