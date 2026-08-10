<template>
    <div class="amazon-div">
        <div class="amazon-div-image">
            <div class="amazon-div-image-textbox">
                <div class="amazon-div-image-textbox-title">
                    Link to our <br> 
                    Amazon Storefront
                </div>

                <div class="amazon-div-image-textbox-text">
                    <p>
                        CandyRific is a wholesale distributor, but we also sell our products
                        directly to consumers through our Amazon storefront so individual
                        customers can our products.
                    </p>
                </div>

                <div>
                    <button>
                        SHOP
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>

/* ========================================
   MOBILE FIRST
   Default = smallest screens
======================================== */

.amazon-div {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.amazon-div-image {
    overflow: hidden;
    border-radius: 5px;
    position: relative;

    background-image: url('/src/assets/candy-bags.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    width: min(100%, 65rem);
    min-height: 32rem;

    display: flex;
    justify-content: center;
}

.amazon-div-image-textbox {
    width: 90%;
    padding: 1rem;

    position: absolute;
    transform: translate(0, 20px);

    background-color: white;

    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    box-shadow: 0 8px 40px 10px #333333;
    border-radius: 2rem;
}

.amazon-div-image-textbox-title {
    color: #1C8BC3;
    font-size: 2.5rem;
    font-family: 'Fredoka', sans-serif;
    line-height: 2.5rem;
    flex: 0 0 55%;
    font-weight: bold;
}

.amazon-div-image-textbox-text {
    font-family: 'Fredoka', sans-serif;

    display: flex;
    align-items: center;
    justify-content: center;

    flex: 0 0 45%;

    color: #703795;
    font-size: 1rem;
}

.amazon-div-image-textbox button {
    color: white;
    border: 1px solid #703795;
    background: #703795;

    font-family: 'Fredoka', sans-serif;
    font-size: 1.5rem;

    border-radius: 5px 5px 15px 15px;
    width: 100%;
    box-shadow: 1px 2px 1px black;
    transition:
        transform 0.1s ease,
        box-shadow 0.1s ease;
}

.amazon-div-image-textbox button:hover {
    color: white;
    background: #703795;
    cursor: pointer;
}


/* ========================================
   516px+
   Larger phones / tablets
======================================== */

@media (min-width: 516px) {

    .amazon-div-image-textbox {
        width: min(60%, 40rem);
        border-radius: 0 0 2rem 0;
    }

}


/* ========================================
   769px+
   Desktop
======================================== */

@media (min-width: 769px) {

    .amazon-div {
        padding: 3rem;
    }

    .amazon-div-image {
        min-height: 20rem;
        border-radius: 2rem;
        display: block;
    }

}

</style>