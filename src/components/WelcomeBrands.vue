<script setup>

</script>

<template>
  <div class="full-brand-div">
      <div class="full-brand-title-div">
          BRANDS WE WORK WITH
      </div>
      
    <div class="left-marquee-banner">
      <div class="left-marquee-track">
        <div class="brand-marquee-card"></div>
        <div class="brand-marquee-card"></div>
        <div class="brand-marquee-card"></div>
        <div class="brand-marquee-card"></div>
        <div class="brand-marquee-card"></div>
        <div class="brand-marquee-card"></div>
        <div class="brand-marquee-card"></div>
        <div class="brand-marquee-card"></div>
        <div class="brand-marquee-card"></div>
        <div class="brand-marquee-card"></div>
        <div class="brand-marquee-card"></div>
        <div class="brand-marquee-card"></div>
        <div class="brand-marquee-card"></div>
        <div class="brand-marquee-card"></div>
      </div>
    </div>
    
    <div class="right-marquee-banner">
      <div class="right-marquee-track">
          <div class="brand-marquee-card"></div>
          <div class="brand-marquee-card"></div>
          <div class="brand-marquee-card"></div>
          <div class="brand-marquee-card"></div>
          <div class="brand-marquee-card"></div>
          <div class="brand-marquee-card"></div>
          <div class="brand-marquee-card"></div>
          <div class="brand-marquee-card"></div>
          <div class="brand-marquee-card"></div>
          <div class="brand-marquee-card"></div>
          <div class="brand-marquee-card"></div>
          <div class="brand-marquee-card"></div>
          <div class="brand-marquee-card"></div>
          <div class="brand-marquee-card"></div>
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
        padding-top: 1rem;
        padding-bottom: 2rem;
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
        rgba(109, 54, 146, 0.75) 15%,
        rgba(109, 54, 146, 0.25) 30%,
        rgba(109, 54, 146, 0.02) 50%,
        rgba(0, 172, 237, 0.25) 60%,
        rgba(0, 172, 237, 0.75) 85%,
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
    }

    .left-marquee-banner {
       overflow-x: hidden;
       width: 100%;
       z-index: 1;
    }

    .right-marquee-banner {
       overflow-x: hidden;
       width: 100%;
       z-index: 1;
    }

    .left-marquee-track {
      display: flex;
      width: max-content;
      animation: left-marquee 30s linear infinite;
      gap: 1rem;
      padding-top: 1rem;
    }

    .right-marquee-track {
      display: flex;
      width: max-content;
      animation: right-marquee 35s linear infinite;
      gap: 1rem;
      padding-top: 1rem;
    }



    .brand-marquee-card{
      flex: 11rem;
      height: 7rem;
      background-color: #9dabd5;
      border-radius: 5px;
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

    

    



    .brand-marquee-card {
      height: 7rem;
      width: 11rem;
      background-color: #9DABD5;
      border-radius: 5px;
    }

</style>

