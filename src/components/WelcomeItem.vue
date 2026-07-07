<script setup>
</script>

<template>
  <section class="welcome-section" aria-label="Candyrific Loud Mouth Bites award hero image">
    <section class="intro-section" aria-labelledby="intro-title">
      <div class="intro-copy">
        <p class="eyebrow">2026 Powerhouse Award Candy Winner</p>
        <h1 id="intro-title">Award-winning innovation with a seriously loud bite.</h1>
         <div>
        <button class="button-style">Loud Mouth Bites</button>
        <button class="button-style">View all products</button>
      </div>
      </div>

      <div class="quick-award-card" id="award">
        <span aria-hidden="true">★</span>
        <p>
          <strong>Loud Mouth Bites</strong><br />
          Most Innovative New Products — Candy Winner
        </p>
      </div>
    </section>
    </section>
</template>

<style scoped>
.button-style {
    border-radius: 25px;
    /* Soft gloss gradient layered on top of your #fad141 yellow */
    background: linear-gradient(
        to bottom, 
        rgba(255, 255, 255, 0.4) 0%, 
        rgba(255, 255, 255, 0) 50%, 
        rgba(0, 0, 0, 0.05) 50%, 
        rgba(0, 0, 0, 0.1) 100%
    ), #fad141;
    border: 2px solid #000000;
    color: #000000;
    font-weight: bold; /* Improves readability on bright yellow */
    padding: 1rem 2rem;
    margin: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: all 0.2s ease; /* Makes the hover transition smooth */
}

.button-style:hover {
    /* Maintains the black border structure while darkening the background */
    background: linear-gradient(
        to bottom, 
        rgba(255, 255, 255, 0.5) 0%, 
        rgba(255, 255, 255, 0) 50%, 
        rgba(0, 0, 0, 0.05) 50%, 
        rgba(0, 0, 0, 0.15) 100%
    ), #e0b826; /* Darker, richer gold on hover */
    border: 2px solid #000000; /* Kept black so the button edge stays sharp */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25); /* Increases shadow to look lifted */
    transform: translateY(-2px); /* Physical lift effect */
}

.button-style:active {
    transform: translateY(1px); /* Sinks down slightly when clicked */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}
  .welcome-section {
  width: min(var(--max-width), calc(100% - 2rem));
  margin-left: 16px;
  margin-top: 16px;
}

.inner-welcome {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  height: auto;
  object-fit: cover;
  background: linear-gradient(to bottom left, #F04D86, #703795);
}

.intro-section {
  width: min(var(--max-width), calc(100% - 2rem));
  margin: 3.5rem auto 1.5rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 390px);
  gap: 1.5rem;
  align-items: stretch;
}

.intro-copy,
.quick-award-card {
  border: 4px solid var(--ink);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-hard), var(--shadow-soft);
}

.intro-copy {
  padding: clamp(1.5rem, 4vw, 3rem);
  background:
    radial-gradient(circle at top right, rgba(242, 5, 140, 0.14), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(255, 243, 220, 0.96));
}

.eyebrow {
  margin: 0 0 0.85rem;
  color: var(--hot-pink);
  font-family: var(--font-main);
  font-size: 0.92rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.09em;
}

h1,
h2,
h3,
p {
  overflow-wrap: break-word;
}

h1 {
  margin: 0;
  max-width: 13ch;
  font-family: var(--font-main);
  font-size: clamp(2.9rem, 7vw, 6rem);
  line-height: 0.9;
  letter-spacing: -0.08em;
  text-transform: uppercase;
  color: var(--ink);
  text-shadow:
    4px 4px 0 #F04D86,
    8px 8px 0 #703795;
}


.intro-copy p:last-child {
  max-width: 800px;
  margin: 1.35rem 0 0;
  color: var(--muted);
  font-size: clamp(1.08rem, 2vw, 1.28rem);
  line-height: 1.55;
  font-weight: 800;
}

.quick-award-card {
  padding: clamp(1.25rem, 3vw, 2rem);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background:
    linear-gradient(135deg, var(--deep-purple), var(--acid-purple));
  color: var(--surface);
}

.quick-award-card span {
  width: 76px;
  height: 76px;
  border: 4px solid var(--surface);
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--award-gold);
  color: var(--ink);
  font-size: 2.1rem;
  box-shadow: 5px 5px 0 var(--hot-pink);
}

.quick-award-card p {
  margin: 1.5rem 0 0;
  font-family: var(--font-main);
  font-size: clamp(1.35rem, 3vw, 2rem);
  line-height: 1.05;
  text-transform: uppercase;
}
</style>
