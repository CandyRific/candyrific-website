<template>
    <div class="amazon-div">
        <div class="amazon-div-image">
            <div class="amazon-div-image-textbox">
                <div class="amazon-div-image-textbox-title ">
                    Link to our <br> 
                    Amazon Storefront
                </div>
                <div class="amazon-div-image-textbox-text">
                   <p>
                    CandyRific is a wholesale distributor, but we also sell our products directly to consumers through our Amazon storefront
                    so individual customers can our products.
                    
                    </p>
                </div>
                <div >
                    <button>
                        SHOP NOW
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
    .amazon-div {
        min-height: 75vh;
        padding: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;

    }

    .amazon-div-image {
        overflow: hidden;
        border-radius: 2rem;
        position: relative;
        background-image: url(/src/assets/candy-bags.jpg);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        /* width: 60rem;
        height: 20rem; */
        width: min(100%, 65rem);
        min-height: 20rem;
    }

   

    .amazon-div-image-textbox {
        width: min(60%, 40rem);
        /* height: 12rem; */
        /* padding: clamp(1.25rem, 3vw, 2rem); */
        
        /* width: 60%;
        height: 60%; */
        padding: 1rem;

        position: absolute;
        transform: translate(0px, 20px);
        background-color: white;
        display: flex;
        flex-direction: column;
        gap: .5rem;
        box-shadow: 0px 8px 40px 10px #333333;
        border-radius: 0rem 0rem 2rem 0rem;

    }

    .amazon-div-image-textbox button {
        
        color: #703795;
        border: 1px solid #703795;
        border-radius: 5px;
        background: white;
        font-family: 'Fredoka', sans-serif;
        font-size: 1.5rem;
        border-radius: 5px 5px 15px 15px;
        width: 100%;

        transition: transform 0.1s ease, box-shadow 0.1s ease;
    }

    .amazon-div-image-textbox button:hover  {
        color: white;
        background: #703795;
    }




     @media (max-width: 515px) {
        .amazon-div-image-textbox {
            width: 90%;
            border-radius: 2rem 2rem 2rem 2rem;
        }
     }
     @media (max-width: 768px){
        .amazon-div {
            padding: 1rem .5rem;
        }
        
        .amazon-div-image{
            display: flex;
            justify-content: center;
            min-height: 32rem;
            border-radius: 5px;
        }
    }

    .amazon-div-image-textbox-title {
        color: #1C8BC3;
        font-size: 2.5rem;
        font-family: 'Fredoka', sans-serif;
        line-height: 2.5rem;
        /* border: 1px solid red; */
        flex: 0 0 55%;
        font-weight: bold;
    }

    .amazon-div-image-textbox-text {
        font-family: 'Fredoka', sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        /* border: 1px solid red; */
        flex: 0 0 45%;
        color: #703795;
        font-size: 1rem;
    }


    .shop-now {
        color: #703795;
        border: 1px solid #703795;
        border-radius: 5px;
        background: white;
        font-family: 'Fredoka', sans-serif;
        font-size: 2rem;
    }

    .shop-now:hover  {
        color: white;
        background: #703795;
        border: 1px solid #703795;
        border-radius: 5px;
        font-family: 'Fredoka', sans-serif;
        font-size: 2rem;
    }
</style>