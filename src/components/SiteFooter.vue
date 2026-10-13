<script setup>
import { RouterLink } from 'vue-router'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <img
      class="footer-design"
      src="../assets/nw_design.png"
      alt=""
      aria-hidden="true"
    >

    <div class="footer-container">

      <!-- ========================================
           MAIN FOOTER CONTENT
      ========================================= -->

      <div class="footer-main">

        <!-- Navigation -->
        <nav
          class="footer-navigation"
          aria-label="Footer navigation"
        >
          <RouterLink to="/products">
            Products
          </RouterLink>

          <RouterLink to="/about">
            About Us
          </RouterLink>

          <RouterLink to="/contact">
            Contact Us
          </RouterLink>
        </nav>


        <!-- Social Media -->
        <div class="social-media-links">

          <a
            href="https://www.youtube.com/@Candyrific"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CandyRific on YouTube"
            class="social-link"
          >
            <img
              src="../assets/youtube_icon.png"
              alt=""
            >
          </a>

          <a
            href="https://www.facebook.com/CandyrificLLC/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CandyRific on Facebook"
            class="social-link"
          >
            <img
              src="../assets/facebook_icon.png"
              alt=""
            >
          </a>

          <a
            href="https://www.instagram.com/candyrificllc/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CandyRific on Instagram"
            class="social-link"
          >
            <img
              src="../assets/insta_icon.png"
              alt=""
            >
          </a>

        </div>

      </div>


      <!-- ========================================
           BOTTOM FOOTER
      ========================================= -->

      <div class="footer-bottom">
        <p>
          Copyright &copy; CandyRific {{ currentYear }}.
          All Rights Reserved.
        </p>
      </div>

    </div>
  </footer>
</template>

<style scoped>
/* ========================================
   FOOTER
======================================== */

.footer {
  position: relative;

  width: 100%;

  overflow: hidden;

  padding:
    clamp(2.75rem, 5vw, 4rem)
    clamp(1.25rem, 4vw, 3rem)
    1.5rem;

  font-family:
    'Fredoka',
    sans-serif;

  color: #ffffff;

  background:
    linear-gradient(
      90deg,
      #6d3692 0%,
      #6250a1 25%,
      #3f6fb5 50%,
      #007fc5 65%,
      #00aced 100%
    );

  border-top:
    1px solid
    rgba(255, 255, 255, 0.2);
}


/* ========================================
   CONTENT CONTAINER
======================================== */

.footer-container {
  position: relative;

  z-index: 2;

  width: 100%;
  max-width: 1400px;

  margin: 0 auto;
}


/* ========================================
   MAIN CONTENT
======================================== */

.footer-main {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 2rem;
}


/* ========================================
   NAVIGATION
======================================== */

.footer-navigation {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 0.6rem;
}

.footer-navigation a {
  position: relative;

  color: #ffffff;

  font-size:
    clamp(
      1.15rem,
      2vw,
      1.4rem
    );

  font-weight: 500;

  line-height: 1.4;

  text-decoration: none;

  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}


/* Underline accent */
.footer-navigation a::after {
  content: '';

  position: absolute;

  left: 50%;
  bottom: -0.2rem;

  width: 0;
  height: 2px;

  background: #ffffff;

  transform:
    translateX(-50%);

  border-radius: 2px;

  transition:
    width 0.2s ease;
}

.footer-navigation a:hover {
  transform:
    translateY(-1px);
}

.footer-navigation a:hover::after {
  width: 100%;
}

.footer-navigation a:focus-visible {
  outline:
    3px solid
    rgba(250, 209, 65, 0.9);

  outline-offset: 5px;

  border-radius: 3px;
}


/* ========================================
   SOCIAL MEDIA
======================================== */

.social-media-links {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 0.85rem;
}

.social-link {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 3.5rem;
  height: 3.5rem;

  padding: 0.45rem;

  border:
    1px solid
    rgba(255, 255, 255, 0.3);

  border-radius: 50%;

  background:
    rgba(255, 255, 255, 0.1);

  backdrop-filter: blur(3px);

  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.social-link img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: contain;
}

.social-link:hover {
  transform:
    translateY(-3px)
    scale(1.05);

  background:
    rgba(255, 255, 255, 0.18);

  box-shadow:
    0
    8px
    18px
    rgba(53, 36, 84, 0.22);
}

.social-link:active {
  transform:
    translateY(0)
    scale(0.98);
}

.social-link:focus-visible {
  outline:
    3px solid
    rgba(250, 209, 65, 0.9);

  outline-offset: 4px;
}


/* ========================================
   BOTTOM SECTION
======================================== */

.footer-bottom {
  display: flex;

  align-items: center;
  justify-content: center;

  margin-top: 2.5rem;

  padding-top: 1.25rem;

  border-top:
    1px solid
    rgba(255, 255, 255, 0.2);
}

.footer-bottom p {
  margin: 0;

  color:
    rgba(255, 255, 255, 0.88);

  font-size: 0.8rem;

  font-weight: 400;

  line-height: 1.4;

  text-align: center;
}


/* ========================================
   DECORATIVE ART
======================================== */

.footer-design {
  position: absolute;

  right: 0;
  bottom: 0;

  z-index: 1;

  width: auto;
  height:
    clamp(
      6rem,
      15vw,
      11rem
    );

  opacity: 0.8;

  pointer-events: none;

  user-select: none;
}


/* ========================================
   DESKTOP
======================================== */

@media (min-width: 768px) {

  .footer-main {
    flex-direction: row;

    align-items: flex-start;
    justify-content: space-between;

    min-height: 7rem;
  }


  /* Navigation */

  .footer-navigation {
    align-items: flex-start;

    gap: 0.45rem;
  }


  /* Social */

  .social-media-links {
    justify-content: flex-end;
  }


  /* Copyright */

  .footer-bottom {
    justify-content: flex-start;
  }

  .footer-bottom p {
    text-align: left;
  }

}


/* ========================================
   SMALL MOBILE
======================================== */

@media (max-width: 480px) {

  .footer {
    padding:
      2.5rem
      1rem
      1.25rem;
  }

  .footer-main {
    gap: 1.75rem;
  }

  .footer-design {
    height: 6rem;

    opacity: 0.65;
  }

  .social-link {
    width: 3.25rem;
    height: 3.25rem;
  }

}
</style>