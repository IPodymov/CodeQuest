<script setup lang="ts">
import {computed} from 'vue';
import {useI18nStore} from '@/stores/i18n';

type CalendarEvent = {
  id?: string;
  title: string;
  platform: string;
  startTime: string;
  difficulty?: string | null;
  desc?: string | null;
  icon?: string | null;
  imageUrl?: string | null;
  background?: string | null;
};

const props = defineProps<{
  events: CalendarEvent[];
  month: number;
  year: number;
}>();

const emit = defineEmits(['openEvent']);
const i18n = useI18nStore();

const days = computed(() => (i18n.tm('calendar.days') as string[]) || []);
const daysInMonth = computed(() => new Date(props.year, props.month + 1, 0).getDate());
const startOffset = computed(() => {
  const firstDay = new Date(props.year, props.month, 1).getDay();
  return (firstDay + 6) % 7;
});

const eventsByDay = computed(() => {
  return props.events.reduce<Record<number, CalendarEvent[]>>((acc, event) => {
    const eventDate = new Date(event.startTime);
    if (Number.isNaN(eventDate.getTime())) return acc;
    if (eventDate.getFullYear() !== props.year || eventDate.getMonth() !== props.month) return acc;
    const day = eventDate.getDate();
    if (!acc[day]) acc[day] = [];
    acc[day]!.push(event);
    return acc;
  }, {});
});

const getEventsForDay = (day: number) => {
  return eventsByDay.value[day] || [];
};
</script>

<template>
  <div class="flex flex-col bg-[#111a22] rounded-xl border border-surface-border overflow-hidden shadow-2xl">
    <div class="grid grid-cols-7 border-b border-surface-border bg-surface-dark">
      <div v-for="day in days" :key="day"
           class="py-3 text-center text-xs sm:text-sm font-bold text-slate-300 uppercase">
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 auto-rows-[minmax(120px,1fr)] gap-px bg-surface-border">
      <div v-for="i in startOffset" :key="'empty-'+i"
           class="bg-[#111a22] p-2 min-h-[120px] border-r border-b border-[#233648] opacity-50"></div>

      <div v-for="day in daysInMonth" :key="day"
           class="bg-[#111a22] p-2 min-h-[120px] border-r border-b border-[#233648] relative group hover:bg-[#16212e] transition-colors">
        <span class="text-slate-300 text-sm font-bold group-hover:text-white">{{ day }}</span>
        <div
            v-for="event in getEventsForDay(day)"
            :key="event.id || `${day}-${event.title}`"
            @click.stop="emit('openEvent', event)"
            class="w-full bg-primary/20 border-l-2 border-primary rounded px-2 py-1 mt-1 cursor-pointer hover:bg-primary/30 transition-colors"
        >
          <p class="text-xs text-white truncate font-medium">{{ event.platform }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
