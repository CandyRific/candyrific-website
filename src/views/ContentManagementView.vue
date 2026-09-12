<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

import ProductManagement from '../components/CMS/ProductManagement.vue'
import BrandManagement from '../components/CMS/BrandManagement.vue'

const authStore = useAuthStore()

const activeSection = ref('products')

const setActiveSection = (section) => {
  activeSection.value = section
}
</script>

<template>
  <div class="content-management-page">

    <h1 class="title-div">
      Content Management
    </h1>

    <div class="dashboard-wrapper">

      <nav
        class="cms-navigation"
        aria-label="Content management navigation"
      >
        <button
          type="button"
          class="cms-nav-button"
          :class="{ active: activeSection === 'products' }"
          @click="setActiveSection('products')"
        >
          Products
        </button>

        <button
          type="button"
          class="cms-nav-button"
          :class="{ active: activeSection === 'brands' }"
          @click="setActiveSection('brands')"
        >
          Brands
        </button>
      </nav>

      <div class="dashboard-card">

        <div class="user-info">
          <p>
            Logged in as
            <strong>{{ authStore.currentUser?.email }}</strong>
          </p>
        </div>

        <ProductManagement
          v-if="activeSection === 'products'"
        />

        <BrandManagement
          v-if="activeSection === 'brands'"
        />

      </div>

    </div>

  </div>
</template>

<style scoped>
.content-management-page {
  min-height: 100vh;

  padding-bottom: 3rem;

  background: #e6f4fd;

  font-family: 'Fredoka', sans-serif;
}


/* ========================================
   PAGE TITLE
======================================== */

.title-div {
  margin: 0;

  padding: clamp(1.5rem, 3vw, 3rem);

  text-align: center;

  color: #703795;

  font-size: clamp(3.25rem, 5vw, 6rem);
  line-height: 1;
  font-weight: 600;
}


/* ========================================
   DASHBOARD LAYOUT
======================================== */

.dashboard-wrapper {
  width: min(94%, 75rem);

  margin: 0 auto;

  display: flex;
  flex-direction: column;

  gap: 1rem;
}


/* ========================================
   CMS NAV
======================================== */

.cms-navigation {
  display: flex;

  width: 100%;

  overflow-x: auto;

  background: white;

  border-radius: 10px;
}

.cms-nav-button {
  flex: 1;

  min-width: 8rem;

  padding: 1rem 1.25rem;

  background: transparent;

  color: #703795;

  border: none;

  font: inherit;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.cms-nav-button:hover {
  background: #f3eefa;
}

.cms-nav-button.active {
  background: #703795;

  color: white;
}


/* ========================================
   DASHBOARD CARD
======================================== */

.dashboard-card {
  width: 100%;

  padding: clamp(1rem, 3vw, 2rem);

  background: white;

  border-radius: 10px;

  color: #703795;

  box-sizing: border-box;
}


/* ========================================
   USER INFO
======================================== */

.user-info {
  margin-bottom: 1rem;
}

.user-info p {
  margin: 0;
}


/* ========================================
   DESKTOP
======================================== */

@media (min-width: 768px) {
  .dashboard-wrapper {
    display: grid;

    grid-template-columns: 12rem minmax(0, 1fr);

    align-items: start;

    gap: 1.5rem;
  }

  .cms-navigation {
    flex-direction: column;

    position: sticky;
    top: 1rem;

    overflow: hidden;
  }

  .cms-nav-button {
    flex: none;

    width: 100%;

    text-align: left;
  }

  .dashboard-card {
    min-width: 0;
  }
}
</style>