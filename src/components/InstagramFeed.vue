<template>
  <div class="meta-embed-container">
    
    <div class="embed-header">
      <h3>Featured Social Post</h3>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="embed-status loading">
      <span>Loading post preview...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="embed-status error">
      {{ error }}
    </div>

    <!-- Container where the native tokenless oEmbed media mounts -->
    <div 
      v-else-if="embedHtml" 
      ref="embedWrapper" 
      class="embed-content"
      v-html="embedHtml"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

// 1. HARDCODE YOUR POST URL DIRECTLY HERE (No parent binding needed)
const targetPostUrl = 'https://instagram.com';

const embedHtml = ref('');
const loading = ref(true);
const error = ref(null);
const embedWrapper = ref(null);

// Decodes the layout endpoint matching the graph structure
const getEndpoint = (url) => {
  if (url.includes('instagram.com')) {
    return 'https://facebook.com';
  } else if (url.includes('facebook.com')) {
    return 'https://facebook.com';
  }
  return null;
};

const fetchEmbedData = async () => {
  loading.value = true;
  error.value = null;

  const apiEndpoint = getEndpoint(targetPostUrl);
  if (!apiEndpoint) {
    error.value = 'The provided URL is not a supported Facebook or Instagram layout link.';
    loading.value = false;
    return;
  }

  try {
    // Making a clean tokenless GET request directly to Meta Graph API
    const targetUrl = `${apiEndpoint}?url=${encodeURIComponent(targetPostUrl)}&omitscript=false`;
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      throw new Error(`Meta API error: ${response.statusText}`);
    }

    const data = await response.json();
    embedHtml.value = data.html;
    
    // Trigger script parsing once HTML is painted into DOM
    await nextTick();
    processMetaScripts();
  } catch (err) {
    error.value = 'Failed to load media preview. Ensure the post is public and embeds are enabled.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Re-triggers native layouts scripts (embed.js) to convert plain block quotes into functional frames
const processMetaScripts = () => {
  if (window.instgrm?.Embeds) {
    window.instgrm.Embeds.process();
  } else if (window.FB) {
    window.FB.XFBML.parse();
  } else {
    // If the window scripts haven't been globally cached yet, force evaluate nested scripts
    const scripts = embedWrapper.value?.querySelectorAll('script') || [];
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }
};

onMounted(() => {
  fetchEmbedData();
});
</script>

<style scoped>
.meta-embed-container {
  width: 100%;
  max-width: 540px; 
  margin: 1.5rem auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
.embed-header {
  margin-bottom: 1rem;
  text-align: center;
}
.embed-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
}
.embed-status {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  border: 1px dashed #dbdbdb;
  border-radius: 8px;
  background-color: #fafafa;
  color: #8e8e8e;
}
.embed-status.error {
  color: #ed4956;
  border-color: #ed4956;
  background-color: #fff2f3;
}
.embed-content {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
