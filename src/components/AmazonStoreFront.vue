<template>
    <div class="amazon-div">
        <div class="amazon-div-image">
            <div class="amazon-div-image-textbox">
                <div class="amazon-div-image-textbox-title">
                    Buy Direct 
                </div>

                <div class="amazon-div-image-textbox-text">
                    <p class="light-p">
                        CandyRific is a wholesale distributor, but we also sell our
                        products directly to consumers through our Amazon storefront
                        and Pantryful.
                    </p>
                </div>

                <div class="amazon-button-div">
                    <!-- <a>
                        <button>
                        Shop on Amazon
                    </button>
                    </a> -->
                    
                    <a href="https://pantryful.com/collections/candyrific">
                        <button>
                        Shop on Pantryful
                    </button>
                    </a>
                    
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
    padding: 1rem 0rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.amazon-div-image {
    overflow: hidden;
    border-radius: 0px;
    position: relative;

    background-image: url('/src/assets/Candy_Background.jpg');
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
    gap: 0.75rem;

    box-shadow: 0 8px 40px 10px #333333;
    border-radius: 10px 10px 10px 10px;
}

.amazon-div-image-textbox-title {
    color: #1C8BC3;
    font-size: 3.5rem;
    font-family: 'Fredoka', sans-serif;
    line-height: 2.5rem;
    flex: 0 0 55%;
    font-weight: 600;
}

.amazon-div-image-textbox-text {
    font-family: 'Fredoka', sans-serif;

    display: flex;
    align-items: center;
    justify-content: center;

    flex: 0 0 45%;

    color: #703795;
    font-size: 1.25rem;
}

.light-p {
    font-weight: 300;
    padding-top: .5rem;
}

.amazon-button-div{
    display: flex;
    flex-direction: column;
    gap: 1rem;
    
    align-items: flex-start;
}

@media (min-width: 768px){
    .amazon-button-div{
        flex-direction: row;
        gap: 1.5rem;
        justify-content: flex-start;

    }
}

.amazon-button-div button {
     color: white;
    width: 100%;
    background: linear-gradient(
        90deg,
        #703795 0%,
        #4f5eab 45%,
        #01aef0 100%
    );

    border: none;
    border-radius: 0.75rem;
    padding: .75rem;
    font-family: 'Fredoka', sans-serif;
    font-size: 1.25rem;
    font-weight: 300;
    transition:
        transform 0.1s ease,
        box-shadow 0.1s ease;
}

.amazon-button-div a{
    width: 100%;
}

.amazon-button-div button:hover {
    cursor: pointer;
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

    .amazon-button-div a{
        width: auto;

    }

    .amazon-button-div button:hover {
        transform: translate(-1px, -1px);
        box-shadow: 1px 1px 2px black;
    }

    .amazon-button-div button:active {
        box-shadow: none;
        
    }



}

</style>