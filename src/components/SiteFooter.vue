<template>
    <div class="footer-div">
        <div class="additional-links">
            <div>Products</div>
            <div>Contact Us</div>
            <div>Resources</div>
            <div>FAQ</div>
        </div>
        <div class="social-media-links">
            <div><a href="https://www.youtube.com/@Candyrific" target="_blank" rel="noopener noreferrer"><img src="../assets/youtube_icon.png" alt="YouTube"></a></div>
            <div><a href="https://www.facebook.com/CandyrificLLC/" target="_blank" rel="noopener noreferrer"><img src="../assets/facebook_icon.png" alt="Facebook"></a></div>
            <div><a href="https://www.instagram.com/candyrificllc/" target="_blank" rel="noopener noreferrer"><img src="../assets/insta_icon.png" alt="Instagram"></a></div>
        </div>
        <div class="all-rights">
            Copyright &copy CandyRific 2026. All Rights Reserved.
        </div>
        <img class="nw-design" src="../assets/nw_design.png">
    </div>
</template>

<script setup>

</script>

<style scoped>
    .footer-div {
        position: relative;
        width: 100%;
        /* height: 30vh; */
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


    .nw-design {
        position: absolute;
        height: 8rem;
        right: 0;
        bottom: 0;
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
        z-index: 1;
    }

    .social-media-links div {
        height: 3.5rem;
        width: 3.5rem;
    }

    .social-media-links img {
        height: 100%;
        width: 100%;
        object-fit: contain;
    }

    .social-media-links img:hover {
        transform: scale(1.1);
    }

    .all-rights {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-size: .75rem;
        z-index: 1;
        text-shadow: 0px 0px 2px black;
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
            /* border: 1px solid red; */
            z-index: 1;
        }

        .social-media-links {
            grid-column: 3 / 5;
            grid-row: 1 / 4;
            justify-content: flex-end;
            align-items: center;
            padding: .5rem;
            /* border: 1px solid red; */
            z-index: 1;
        }

        .all-rights {
            grid-column: 1 / 5;
            grid-row: 5 / 6;
            /* border: 1px solid red; */
            z-index: 1;
            text-shadow: 0px 0px 2px black;
        }
    }
</style>