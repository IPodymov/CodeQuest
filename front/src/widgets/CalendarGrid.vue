<script setup lang="ts">
const emit = defineEmits(['openEvent']);

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
const daysInMonth = 31;
const startOffset = 3;
</script>

<template>
  <div class="flex flex-col bg-[#111a22] rounded-xl border border-surface-border overflow-hidden shadow-2xl">
    <div class="grid grid-cols-7 border-b border-surface-border bg-surface-dark">
      <div v-for="day in days" :key="day" class="py-3 text-center text-xs sm:text-sm font-bold text-slate-300 uppercase">
        {{ day }}
      </div>
    </div>
    
    <div class="grid grid-cols-7 auto-rows-[minmax(120px,1fr)] gap-px bg-surface-border">
      <div v-for="i in startOffset" :key="'empty-'+i" class="bg-[#111a22] p-2 min-h-[120px] border-r border-b border-[#233648] opacity-50"></div>
      
      <div v-for="day in daysInMonth" :key="day" class="bg-[#111a22] p-2 min-h-[120px] border-r border-b border-[#233648] relative group hover:bg-[#16212e] transition-colors">
        <span class="text-slate-300 text-sm font-bold group-hover:text-white">{{ day }}</span>
        
        <div v-if="day === 5" @click.stop="emit('openEvent', {title: 'Codeforces Round #920', platform: 'Codeforces', time: '17:35', difficulty: 'Div 2', desc: 'Desc...', img: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1000&auto=format&fit=crop'})" 
        class="w-full bg-primary/20 border-l-2 border-primary rounded px-2 py-1 mt-1 cursor-pointer hover:bg-primary/30 transition-colors">
          <p class="text-xs text-white truncate font-medium">Codeforces</p>
        </div>
      </div>
    </div>
  </div>
</template>