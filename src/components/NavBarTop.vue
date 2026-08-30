<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <nav class="top-nav">
    <ul class="bar">

      <li v-if="!authStore.currentUser">
        <RouterLink
          to="/login"
          class="broker-button"
        >
          LOGIN
        </RouterLink>
      </li>

      <li v-if="authStore.currentUser">
        <RouterLink
            to="/content-management"
            class="broker-button"
        >
            CMS
        </RouterLink>
        </li>

        <li v-if="authStore.currentUser">
        <button
            type="button"
            class="broker-button logout-button"
            @click="authStore.logoutUser"
        >
            LOGOUT
        </button>
        </li>

    </ul>
  </nav>
</template>

<style scoped>
.top-nav {
  width: 100%;
  z-index: 2;
}

.bar {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  gap: 1rem;

  margin: 0;
  padding: 1.5rem 1rem;

  color: transparent;

  background: linear-gradient(
    90deg,
    #6d3692 0%,
    #6250a1 25%,
    #3f6fb5 50%,
    #007fc5 65%,
    #00aced 100%
  );

  font-family: 'Fredoka', sans-serif;

  list-style-type: none;
}

.bar li {
  white-space: nowrap;

  font-size: clamp(0.75rem, 1vw, 1rem);
}

.broker-button {
  display: inline-block;

  padding: 0.5rem;

  color: white;
  background: transparent;

  border: 1px solid white;
  border-radius: 5px;

  font: inherit;

  text-decoration: none;

  cursor: pointer;
}

.broker-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.logout-button {
  appearance: none;
}

.top-button {
  padding: 0.5rem;

  border-radius: 5px;
}

.top-button:hover {
  padding: 0.5rem;

  background-color: rgba(0, 0, 0, 0.1);

  border-radius: 5px;
}
</style>