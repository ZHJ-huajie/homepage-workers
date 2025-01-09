<template>
  <div class="ab">
    3334
    <div v-for="link in links">
        {{link.title}}
    </div>
  </div>
  </template>
  
  <script setup>
  
  import { ref, onMounted } from 'vue';
  
  const links = ref([]);
  
  onMounted(async () => {
    try {
      const response = await $fetch('/safarigo_collection/links'); // 假设这是你的 API 路径
      console.log(response);
      
      links.value = response;
    } catch (error) {
      console.error('Error fetching links data:', error);
    } finally {
    }
  });
  </script>
  