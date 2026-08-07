<template>
    <div class="landing-hello">
        <img src="../assets/se_design.png" class="se-design">
        <div class="landing-hello-message">  
            
            <div>Making Candy</div>
            <div>More Fun</div>

            <div class="landing-hello-text">
                <p>
                We love what we do, and we think it shows in every product we make. Our team
                is always exploring new ideas, new flavors, and new ways to create candy
                that's a little different from everything else on the shelf.
                </p>
                <br/>
                <p>
                At the end of the day, we think candy should always be fun.
                </p>
            </div>
            
            
        </div>

        <div class="landing-hello-image">
            <img src="../assets/hello_page_image.png" alt="">
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
/* Mobile first styling */
    .landing-hello {
        display: flex;
        position: relative;
        flex-direction: column;
        padding: 2rem;
        gap: 1rem;
        background: linear-gradient(
    90deg,
    #6d3692 0%,
    #6250a1 25%,
    #3f6fb5 50%,
    #007fc5 65%,
    #00aced 100%
    );
    }

    .se-design {
        position: absolute;
        height: 30rem;
        left: 0;
        top: 0;
    }

    .landing-hello-image {
        /* border: 1px solid red; */
        min-height: 250px;
        z-index: 1;
    }

    .landing-hello-image img {
        object-fit: contain;
        height: 90%;
        width: 90%;
        /* border: 1px solid red; */
    }

    .landing-hello-message {
        /* border: 1px solid red; */
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        font-family: 'Fredoka', sans-serif;
        font-size: xx-large;
        color: white;
        z-index: 1;
        line-height: 2rem;
    }

    .landing-hello-text {
        background: white;
        border-radius: 15px;
        padding: 1rem;
        color: #352454;
        font-size: 1rem;
        margin-top: 1rem;
    }


    @media (min-width: 768px) {
        .landing-hello {
            display: flex;
            flex-direction: row-reverse;
            padding: 3rem 5rem;
        }

        .landing-hello-message {
            /* border: 1px solid red; */
            align-items: flex-start;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            font-family: 'Fredoka', sans-serif;
            font-size: 3.5rem;
            color: white;
            width: 45%;
            padding: 2rem 2rem;
            line-height: 3.5rem;
            }

        .landing-hello-image {
            /* border: 1px solid red; */
            min-height: 250px;
            width: 55%;
            padding: 0px 0rem;
            display: flex;
            justify-content: center;

        }

        .landing-hello-text {
        background: white;
        border-radius: 15px;
        padding: 2rem;
        color: #352454;
        font-size: 1.25rem;
        line-height: 2rem;
        margin-top: 1rem;
    }
    }
</style>