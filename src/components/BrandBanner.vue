<script setup>

</script>


<template>
  
</template>



<style scoped>

.marquee-container {
  overflow: hidden;
  width: 100%;
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


