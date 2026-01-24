<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();
const emit = defineEmits(['close']);
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div class="absolute inset-0" @click="emit('close')"></div>
    <div class="bg-[#111a22] border border-surface-border w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col relative animate-fadeIn overflow-hidden z-10 ring-1 ring-white/10" :class="$attrs.class">
      <slot></slot>
    </div>
  </div>
</template>