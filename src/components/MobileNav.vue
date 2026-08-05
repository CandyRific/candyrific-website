<template>
    <div class="mobile-nav">
        <div>Home</div>
        <div>About Us</div>
        <div>Products</div>
        <div>Contact Us</div>
    </div>
</template>

<script setup>

</script>

<style g="scss" scoped>
.mobile-nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: blue;
    align-items: center;
    padding: 1rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 2;
}

@media (min-width: 450px) {
    .mobile-nav {
        display: none;
    }
}
</style>