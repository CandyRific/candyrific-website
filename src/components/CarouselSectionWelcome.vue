<template>
  <div class="carousel-section">
    <div class="arrow-container">
      <button
        class="back-arrow"
        type="button"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          aria-hidden="true"
        >
          <path
            fill="rgb(112, 55, 149)"
            d="M201.4 297.4C188.9 309.9 188.9 330.2 201.4 342.7L361.4 502.7C373.9 515.2 394.2 515.2 406.7 502.7C419.2 490.2 419.2 469.9 406.7 457.4L269.3 320L406.6 182.6C419.1 170.1 419.1 149.8 406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3L201.3 297.3z"
          />
        </svg>
      </button>
    </div>

    <div class="carousel-image-section">
      <img
        class="carousel-image"
        src="/src/assets/carousel_image_loud.png"
        alt="Loud Mouth Bites carousel banner"
      >
    </div>

    <div class="arrow-container">
      <button
        class="forward-arrow"
        type="button"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          aria-hidden="true"
        >
          <path
            fill="rgb(1, 174, 240)"
            d="M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.carousel-section {
  padding: 2rem;
  border: 1px solid red;
}

.carousel-image-section {
  width: 100%;
}

.carousel-image {
  display: block;
  width: 100%;
  height: auto;
}

.arrow-container {
  display: none;
}

.back-arrow,
.forward-arrow {
  padding: 0;
  background: transparent;
  border: 1px solid #f04d86;
  border-radius: 5px;
  cursor: pointer;
}

.back-arrow svg,
.forward-arrow svg {
  width: 2rem;
  height: 2rem;
}

.back-arrow:hover,
.forward-arrow:hover {
  box-shadow: 0 4px 10px lightgray;
}

.back-arrow:focus-visible,
.forward-arrow:focus-visible {
  outline: 3px solid #01aef0;
  outline-offset: 3px;
}

@media (min-width: 768px) {
  .carousel-section {
    display: grid;
    grid-template-columns: 1.5fr 9fr 1.5fr;
    align-items: center;
    min-height: 30rem;
    margin: 1rem;
  }

  .carousel-image-section {
    grid-column: 2 / 3;
    border: 1px solid red;
  }

  .arrow-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .back-arrow,
  .forward-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5rem;
    height: 5rem;
  }
}
</style>