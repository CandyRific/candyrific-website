<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="content-management-page">

    <h1 class="title-div">
      Content Management
    </h1>

    <div class="dashboard-card">
      <p>
        Logged in as
        <strong>{{ authStore.currentUser?.email }}</strong>
      </p>

      <p>
        Product management will live here.
      </p>
    </div>

  </div>
</template>

<style scoped>
.content-management-page {
  min-height: 100vh;

  background: #e6f4fd;

  font-family: 'Fredoka', sans-serif;
}

.title-div {
  margin: 0;

  padding: clamp(1.5rem, 3vw, 3rem);

  text-align: center;

  color: #703795;

  font-size: clamp(3.25rem, 5vw, 6rem);
  line-height: 1;
  font-weight: 600;
}

.dashboard-card {
  width: min(90%, 50rem);

  margin: 0 auto;
  padding: 2rem;

  background: white;

  border-radius: 10px;

  color: #703795;
}
</style>