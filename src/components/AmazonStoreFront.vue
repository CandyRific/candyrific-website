<template>
    <div class="amazon-div">
        <div class="amazon-div-image">
            <div class="amazon-div-image-textbox">
                <div class="amazon-div-image-textbox-title ">
                    Link to our Amazon Storefront
                </div>
                <div class="amazon-div-image-textbox-text">
                    Text stuff here and maybe a button
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
        background-image: url(/src/assets/brand_images/amazon_store_front.jpg);
        width: 60rem;
        height: 15rem;
    }

    .amazon-div-image-textbox {
        position: absolute;
        background: white;
        width: 60%;
        height: 70%;
        transform: translate(0px, 20px);
        padding: 1rem;
        
        display: flex;
        flex-direction: column;
    }

    .amazon-div-image-textbox-title {
        color: #1C8BC3;
        font-size: 3rem;
        font-family: 'Fredoka', sans-serif;
        line-height: 3rem;
    }

    .amazon-div-image-textbox-text {
        font-family: 'Fredoka', sans-serif;
    }
</style>