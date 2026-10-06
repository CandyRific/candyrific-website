<template>
  <div class="instagram-embed-container">
    <!-- Input Section -->
    <div class="input-group">
      <label for="instagram-url">Instagram Post URL:</label>
      <input
        id="instagram-url"
        v-model="inputUrl"
        type="text"
        placeholder="https://www.instagram.com/p/..."
        @keyup.enter="fetchEmbedCode"
      />
      <button :disabled="loading || !inputUrl" @click="fetchEmbedCode">
        {{ loading ? 'Loading...' : 'Load Post' }}
      </button>
    </div>

    <!-- Error Message Display -->
    <div v-if="error" class="error-banner">
      {{ error }}
    </div>

    <!-- Target area where the script renders the post -->
    <div ref="embedContainer" class="embed-wrapper">
      <div v-html="embedHtml"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

// Template template reference for DOM targeting
const embedContainer = ref(null);

// Component State
const inputUrl = ref('');
const embedHtml = ref('');
const loading = ref(false);
const error = ref(null);

/**
 * Loads and executes the native Instagram embed script to render the UI
 */
const processInstagramEmbed = () => {
  // Check if script is already present on the page window object
  if (window.instgrm && window.instgrm.Embeds) {
    window.instgrm.Embeds.process();
  } else {
    // If not loaded yet, inject the standard widgets script dynamically
    const script = document.createElement('script');
    script.src = 'https://instagram.com';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
      }
    };
    document.head.appendChild(script);
  }
};

const fetchEmbedCode = async () => {
  if (!inputUrl.value) return;

  loading.value = true;
  error.value = null;
  embedHtml.value = '';

  try {
    // FIX: Make sure backticks are used and the variable method is wrapped in \${}
    const endpoint = `https://instagram.com{encodeURIComponent(inputUrl.value)}&omitscript=true`;

    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata. Status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data.html) {
      embedHtml.value = data.html;
      await nextTick();
      processInstagramEmbed();
    } else {
      throw new Error('No embed code returned from the api payload.');
    }
  } catch (err) {
    error.value = err.message || 'An error occurred while trying to process the endpoint string.';
  } finally {
    loading.value = false;
  }
};

</script>

<style scoped>
.instagram-embed-container {
  max-width: 550px;
  margin: 2rem auto;
  font-family: sans-serif;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.input-group label {
  font-weight: bold;
  color: #333;
}

.input-group input {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.input-group button {
  padding: 0.75rem;
  font-size: 1rem;
  background-color: #006699;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.input-group button:hover:not(:disabled) {
  background-color: #004f81;
}

.input-group button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-banner {
  background-color: #fce8e6;
  color: #c5221f;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #fad2cf;
}

.embed-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 300px;
}
</style>
