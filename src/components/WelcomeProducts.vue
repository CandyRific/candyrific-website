<script setup>
</script>

<template>
    
  <section class="welcome-section" aria-label="Candyrific Loud Mouth Bites award hero image">
      <div class="inner-welcome">
        <p>Electrified Products.</p>
        Products Section - This is where "in style" products will be displayed. So if it's valentines day, may want to put valentiens day products here
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
  background: #01AEF0;
}
</style>
