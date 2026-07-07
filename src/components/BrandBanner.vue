<script setup>

</script>


<template>
  <div>
    <div class="marquee-container">
        <div class="marquee-track">
            <div class="marquee-item"><a><img src="/src/assets/brand_images/marvel-logo-115x50.png"></a></div>
            <div class="marquee-item"><a><img src="/src/assets/brand_images/kool-aid-115x50.png"></a></div>
            <div class="marquee-item"><a><img src="/src/assets/brand_images/marvel-logo-115x50.png"></a></div>
            <div class="marquee-item"><a><img src="/src/assets/brand_images/kool-aid-115x50.png"></a></div>
            <div class="marquee-item"><a><img src="/src/assets/brand_images/marvel-logo-115x50.png"></a></div>
            <div class="marquee-item"><a><img src="/src/assets/brand_images/kool-aid-115x50.png"></a></div>
            <div class="marquee-item"><a><img src="/src/assets/brand_images/marvel-logo-115x50.png"></a></div>
            <div class="marquee-item"><a><img src="/src/assets/brand_images/kool-aid-115x50.png"></a></div>
            <div class="marquee-item"><a><img src="/src/assets/brand_images/marvel-logo-115x50.png"></a></div>
            <div class="marquee-item"><a><img src="/src/assets/brand_images/kool-aid-115x50.png"></a></div>
            <div class="marquee-item"><a><img src="/src/assets/brand_images/marvel-logo-115x50.png"></a></div>
            <div class="marquee-item"><a><img src="/src/assets/brand_images/kool-aid-115x50.png"></a></div>
            <div class="marquee-item"><a><img src="/src/assets/brand_images/marvel-logo-115x50.png"></a></div>
            <div class="marquee-item"><a><img src="/src/assets/brand_images/kool-aid-115x50.png"></a></div>
            
        </div>
    </div>
  </div>
    
</template>



<style scoped>

.marquee-container {
  overflow: hidden;
  width: 95%;
  background-color: #FAD141;
  white-space: nowrap;
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: scroll 45s linear infinite;
}



.marquee-item {
  padding: 15px 0px;
  font-weight: bold;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}


</style>


