<script setup lang="ts">
import TheHeader from '@/widgets/TheHeader.vue';
import TheFooter from '@/widgets/TheFooter.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col font-display bg-background-light dark:bg-background-dark">
    <TheHeader />
    <RouterView />
    <TheFooter />
  </div>
</template>