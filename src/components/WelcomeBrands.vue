<script setup>

</script>

<template>
  <div class="full-brand-div">
      <div class="full-brand-title-div">
          BRANDS WE WORK WITH
      </div>
      
    <div class="left-marquee-banner">
      
        <div class="left-marquee-track">
  <div class="brand-marquee-card">
    <img src="../assets/BS_Logo.png" alt="BS logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/EOTS Logo.png" alt="EOTS logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/HARIBO_logo.png" alt="Haribo logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/KonaIce_CupLogo.png" alt="Kona Ice Cup logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/marvel logo.png" alt="Marvel logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/NBC logo.png" alt="NBC logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/PP_Logo.png" alt="PP logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/Shrek Logo.png" alt="Shrek logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/SW Logo.png" alt="Star Wars logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/Universal Horror Logo.png" alt="Universal Horror logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/Cosmic_Logo.png" alt="Cosmic logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/Frozen Logo.png" alt="Frozen logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/JW_Logo.png" alt="Jurassic World logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/Kraft Heinz.png" alt="Kraft Heinz logo">
  </div>
</div>
  
    </div>
    
    <div class="right-marquee-banner">
     
          <div class="right-marquee-track">
  <div class="brand-marquee-card">
    <img src="../assets/mickey and friends logo.png" alt="Mickey and Friends logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/Nickelodeon_Logo.png" alt="Nickelodeon logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/princess logo.png" alt="Princess logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/SS_logo.png" alt="SS logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/Toy Story Logo.png" alt="Toy Story logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/WARHEADS Wally Logo.png" alt="Warheads Wally logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/Disney Logo.png" alt="Disney logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/GD_Logo.png" alt="GD logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/KA Logo.png" alt="KA logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/LMB Logo.png" alt="LMB logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/Minions_Logo.png" alt="Minions logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/Paramount_Logo.png" alt="Paramount logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/SB_Logo.png" alt="SB logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/Stitch_Logo.png" alt="Stitch logo">
  </div>

  <div class="brand-marquee-card">
    <img src="../assets/Trolls_Logo.png" alt="Trolls logo">
  </div>
</div>
      
    </div>

      
      <div class="full-brand-blue-div">

      </div>
  </div>
</template>

<style scoped>
    .full-brand-div{
        font-family: 'Fredoka', sans-serif;
        background: linear-gradient(
        90deg,
        #6d3692 0%,
        #6250a1 25%,
        #3f6fb5 50%,
        #007fc5 65%,
        #00aced 100%
        );
        color: white;
        position: relative;
        padding-top: 0rem;
        padding-bottom: 1rem;
        z-index: 1;
    }

  
    .full-brand-blue-div {
        display: none;
      }

    @media (min-width: 768px) {
      .full-brand-blue-div {
      /* This will be the size of the original div full-brand-title-div */
        background: linear-gradient(
        90deg,
        rgba(109, 54, 146, 0.95) 0%,
        rgba(109, 54, 146, 0.75) 5%,
        rgba(109, 54, 146, 0.25) 10%,
        rgba(109, 54, 146, 0.02) 50%,
        rgba(0, 172, 237, 0.25) 90%,
        rgba(0, 172, 237, 0.75) 95%,
        rgba(0, 172, 237, 0.95) 100%
      );
      position:  absolute;
      inset: 0;
      z-index: 2;
      display: block;
    }
    }

    .full-brand-title-div {
       display: flex;
       justify-content: center;
       align-items: center;
       padding: 1rem;
       font-size: 2rem;
       text-align: center;
       z-index: 3;
       position: relative;
       font-weight: bold;
    }

    .left-marquee-banner {
       overflow-x: hidden;
       width: 100%;
       z-index: 1;
       padding-bottom: .5rem;
    }

    .right-marquee-banner {
       overflow-x: hidden;
       width: 100%;
       z-index: 1;
       overflow-y: hidden;
       padding-bottom: .5rem;
    }

    .left-marquee-track {
      display: flex;
      width: max-content;
      animation: left-marquee 35s linear infinite;
      gap: .5rem;
    }

    .right-marquee-track {
      display: flex;
      width: max-content;
      animation: right-marquee 40s linear infinite;
      gap: .5rem;
    }



    .brand-marquee-card{
      width: 9rem;
      height: 5rem;
      background-color: #9dabd5;
      border-radius: 5px;
       box-shadow: 3px 4px 6px #2d2d2d;
    }

    @media (min-width: 768px) {
      .full-brand-div {
        padding-top: 1rem;
        padding-bottom: 1rem;
      }

      .brand-marquee-card{
        width: 14rem;
        height: 10rem;
      }

      .left-marquee-track {
        gap: 1rem;
        padding-top: 1rem;
      }

      .right-marquee-track {
        gap: 1rem;
        padding-top: 1rem;
      }
    }

    .brand-marquee-card img {
      height: 100%;
      width: 100%;
      object-fit: contain;
      padding: .5rem;
     
    }

    

    @keyframes left-marquee {
      from {
        transform: translateX(100vw);
      }
      to {
        transform: translateX(-100%);
      }
    }

    @keyframes right-marquee {
      from {
        transform: translateX(-100%);
      }

      to {
        transform: translateX(100vw);
      }
    }

</style>

