<script setup>
import { ref } from 'vue'

import AddProductsManagement from './AddProductManagement.vue'
import EditProductsManagement from './EditProductsManagement.vue'

const managementMode = ref('add')

const setManagementMode = (mode) => {
  managementMode.value = mode
}
</script>

<template>
  <section class="product-management">
    <h2 class="section-title">
      Product Management
    </h2>

    <div class="management-toggle">
      <button
        type="button"
        class="management-toggle-button"
        :class="{
          active: managementMode === 'add'
        }"
        @click="setManagementMode('add')"
      >
        Add
      </button>

      <button
        type="button"
        class="management-toggle-button"
        :class="{
          active: managementMode === 'edit'
        }"
        @click="setManagementMode('edit')"
      >
        Edit
      </button>
    </div>

    <AddProductsManagement
      v-if="managementMode === 'add'"
    />

    <EditProductsManagement
      v-else
    />
  </section>
</template>

<style scoped>
.product-management {
  width: min(90%, 50rem);

  margin: 0 auto;
  padding: 2rem 0;

  font-family: 'Fredoka', sans-serif;
}

.section-title {
  margin: 0 0 1.5rem;

  color: #703795;

  font-size: clamp(2rem, 3vw, 3rem);
  font-weight: 600;
}

/* ========================================
   ADD / EDIT TOGGLE
======================================== */

.management-toggle {
  width: 100%;

  margin-bottom: 1.5rem;

  display: flex;
  flex-direction: row;

  gap: 0.75rem;
}

.management-toggle-button {
  flex: 1;

  padding: 0.8rem 1rem;

  background: white;

  color: #703795;

  border: 2px solid #703795;
  border-radius: 8px;

  font: inherit;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.management-toggle-button:hover {
  background: #f5eff8;
}

.management-toggle-button.active {
  background: #703795;

  color: white;
}
</style>