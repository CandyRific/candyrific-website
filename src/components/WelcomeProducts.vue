<script setup>
</script>

<template>
    
  <section class="welcome-section" aria-label="Candyrific Loud Mouth Bites award hero image">
      <div class="inner-welcome">
        <p>Top Products</p>
        
      </div>

      
    </section>
</template>

<style scoped>
  .welcome-section {
  width: min(var(--max-width), calc(100% - 2rem));
  margin-left: 16px;
  margin-top: 16px;
}

.inner-welcome {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  height: auto;
  object-fit: cover;
  background:
  linear-gradient(
    115deg,
    #320152 0%,
    #3d075d 24%,
    #5e2783 52%,
    #316bb0 76%,
    #00afe0 100%
  );
}
</style>
