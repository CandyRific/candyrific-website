<template>
    <div class="landing-hello">
        <div class="landing-hello-message">
            
                <div>Making Candy</div>
                <div>More Fun</div>
            
            
        </div>

        <div class="landing-hello-image">
            <img height="75rem" width="auto" src="/src/assets/loud-mouth-bites-award-hero.jpg" alt="">
        </div>

    </div>
</template>

<script setup>

</script>

<style scoped>
/* Mobile first styling */
    .landing-hello {
        display: flex;
        flex-direction: column;
        padding: 3rem;
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

    .landing-hello-image {
        border: 1px solid red;
        min-height: 250px;
    }

    .landing-hello-message {
        border: 1px solid red;
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        font-family: 'Fredoka', sans-serif;
        font-size: xx-large;
        color: white;
    }


    @media (min-width: 768px) {
        .landing-hello {
            display: flex;
            flex-direction: row-reverse;
        }

        .landing-hello-message {
            border: 1px solid red;
            align-items: flex-start;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-family: 'Fredoka', sans-serif;
            font-size: 3.5rem;
            color: white;
            width: 50%;
            padding: 0px 2rem;
            }

        .hello-message {

        }

        .landing-hello-image {
            border: 1px solid red;
            min-height: 250px;
            width: 50%;
            padding: 0px 2rem;
        }
    }
</style>