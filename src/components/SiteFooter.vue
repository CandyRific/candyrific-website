<template>
    <div class="footer-div">
        <div class="additional-links">
            <div>Products</div>
            <div>Contact Us</div>
            <div>Resources</div>
            <div>FAQ</div>
        </div>
        <div class="social-media-links">
            <div>Image 1</div>
            <div>Image 2</div>
            <div>Image 3</div>
        </div>
        <div class="all-rights">
            Copyright &copy CandyRific. All Rights Reserved.
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
    .footer-div {
        width: 100%;
        height: 30vh;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
        font-family: 'Fredoka', sans-serif;
        background: linear-gradient(
    90deg,
    #6d3692 0%,
    #6250a1 25%,
    #3f6fb5 50%,
    #007fc5 65%,
    #00aced 100%
    );
    color: white;
    }


    .additional-links{
        display: flex;
        flex-direction: column;
        align-items: center;
    }


    .social-media-links {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        justify-content: center;
    }

    .all-rights {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-size: .75rem;
    }


    @media (min-width: 768px){
        
        .footer-div {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
        }

        .additional-links {
            grid-column: 1 / 3;
            grid-row: 1 / 4;
            align-items: flex-start;
            border: 1px solid red;
        }

        .social-media-links {
            grid-column: 3 / 5;
            grid-row: 1 / 4;
            justify-content: flex-end;
            align-items: center;
            padding: .5rem;
            border: 1px solid red;
        }

        .all-rights {
            grid-column: 1 / 5;
            grid-row: 4 / 6;
            border: 1px solid red;
        }
    }
</style>