<template>
    <div class="carousel-mobile-slider">
        <div class="carousel-mobile-card">
            <a>
                <img src="../assets/Carousel_MOBILE-02_01.jpg" alt="carousel image" />
            </a>
        </div>
        <div class="carousel-mobile-card">
            <a>
                <img src="../assets/Carousel_MOBILE-02_02.jpg" alt="carousel image" />
            </a>
        </div>
        <div class="carousel-mobile-card">
            <a>
                <img src="../assets/Carousel_MOBILE-02_03.jpg" alt="carousel image" />
            </a>
        </div>
    </div>

</template>

<script setup>

</script>

<style scoped>
.carousel-mobile-slider{
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    /* scroll-snap-type: x mandatory; */
    -webkit-overflow-scrolling: touch;
}

@media (min-width: 768px) {
    .carousel-mobile-slider {
        display: none;
    }
}



.carousel-mobile-card {
    /* border: 1px solid red; */
    border-radius: 15px;
    height: 33rem;
    width: 22rem;
    flex-shrink: 0;
    scroll-snap-align: center;
    margin: 1rem;
    box-shadow: 5px 5px 10px gray;


    /* margin-bottom: -3rem;
    margin-left: -1.8rem;
    margin-top: -1rem; */
}

.carousel-mobile-card:active {
    box-shadow: none;
}

.carousel-mobile-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1rem;
}
</style>