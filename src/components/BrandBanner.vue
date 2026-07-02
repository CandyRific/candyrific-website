<template>
    <div class="marquee-container">
        <div class="marquee-track">
            <div class="marquee-item"><a><img src="/src/assets/brand_images/marvel-logo.png"></a></div>
            <div class="marquee-item"><a><img src="/src/assets/brand_images/marvel-logo.png"></a></div>
            <div class="marquee-item"><a><img src="/src/assets/brand_images/marvel-logo.png"></a></div>
            <div class="marquee-item"><a><img src="/src/assets/brand_images/marvel-logo.png"></a></div>
            <div class="marquee-item"><a><img src="/src/assets/brand_images/marvel-logo.png"></a></div>

            
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>

.marquee-container {
  overflow: hidden;
  width: 100%;
  background-color: #ffcc00; /* Your banner color */
  white-space: nowrap;
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: scroll 15s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused; /* Pauses when users hover */
}

.marquee-item {
  padding: 15px 50px;
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


