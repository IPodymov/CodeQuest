<script setup lang="ts">
import {computed, onMounted, ref, watchEffect} from 'vue';
import CalendarGrid from '@/widgets/CalendarGrid.vue';
import {useUserStore} from '@/stores/user';
import {useI18nStore} from '@/stores/i18n';
import {useRouter} from 'vue-router';
import {useContestsStore} from '@/stores/contests';
import BaseModal from '@/shared/ui/BaseModal.vue';

const isDetailModalOpen = ref(false);
const selectedEvent = ref<any>(null);
const userStore = useUserStore();
const contestsStore = useContestsStore();
const router = useRouter();
const i18n = useI18nStore();
const isDeleting = ref(false);
const monthsAhead = 4;
const selectedMonthKey = ref('');

const handleOpenEvent = (event: any) => {
    selectedEvent.value = event;
    isDetailModalOpen.value = true;
};

const registerForEvent = () => {
    if (!userStore.user) {
        if (confirm(i18n.t('calendar.registerConfirm'))) {
            router.push('/auth');
        }
        return;
    }
    alert(i18n.t('calendar.registerSuccess'));
    isDetailModalOpen.value = false;
};

const dateLocale = computed(() => (i18n.locale.value === 'ru' ? 'ru-RU' : 'en-US'));
const isAdmin = computed(() => userStore.user?.role === 'admin');

const formatTime = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString(dateLocale.value, {hour: '2-digit', minute: '2-digit'});
};

const formatDate = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(dateLocale.value, {day: '2-digit', month: 'short'});
};

const formatMonthLabel = (date: Date) => {
    const label = date.toLocaleDateString(dateLocale.value, {month: 'long', year: 'numeric'});
    return label.charAt(0).toUpperCase() + label.slice(1);
};

const calendarEvents = computed(() => {
    return contestsStore.contests.map((contest) => ({
        id: contest.id,
        title: contest.title,
        platform: contest.platform,
        startTime: contest.startTime,
        difficulty: contest.difficulty,
        desc: contest.description,
        icon: contest.icon,
        imageUrl: contest.imageUrl,
        background: contest.background,
        timeLabel: formatTime(contest.startTime),
        dateLabel: formatDate(contest.startTime),
        duration: contest.duration,
        url: contest.url
    }));
});

const monthBuckets = computed(() => {
    const base = new Date();
    base.setDate(1);
    return Array.from({length: monthsAhead}, (_, index) => {
        const date = new Date(base.getFullYear(), base.getMonth() + index, 1);
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            label: formatMonthLabel(date)
        };
    });
});

const monthOptions = computed(() => {
    return monthBuckets.value.map((bucket) => ({
        key: `${bucket.year}-${bucket.month}`,
        label: bucket.label,
        year: bucket.year,
        month: bucket.month
    }));
});

const selectedBucket = computed(() => {
    if (!selectedMonthKey.value) return null;
    return monthBuckets.value.find((bucket) => `${bucket.year}-${bucket.month}` === selectedMonthKey.value) ?? null;
});

const shownBuckets = computed(() => {
    return selectedBucket.value ? [selectedBucket.value] : [];
});

const visibleEvents = computed(() => {
    const bucket = selectedBucket.value;
    if (!bucket) return [];
    return calendarEvents.value.filter((event) => {
        const date = new Date(event.startTime);
        if (Number.isNaN(date.getTime())) return false;
        return date.getFullYear() === bucket.year && date.getMonth() === bucket.month;
    });
});

const deleteEvent = async () => {
    if (!selectedEvent.value?.id || isDeleting.value) return;
    if (!confirm(i18n.t('calendar.deleteConfirm'))) return;
    try {
        isDeleting.value = true;
        await contestsStore.deleteContest(selectedEvent.value.id);
        alert(i18n.t('calendar.deleteSuccess'));
        isDetailModalOpen.value = false;
        selectedEvent.value = null;
    } catch (e) {
        alert(i18n.t('calendar.deleteError'));
    } finally {
        isDeleting.value = false;
    }
};

onMounted(() => {
    if (!contestsStore.contests.length) {
        contestsStore.fetchContests();
    }
});

watchEffect(() => {
    if (!monthOptions.value.length) return;
    const exists = monthOptions.value.some((option) => option.key === selectedMonthKey.value);
    if (!selectedMonthKey.value || !exists) {
        selectedMonthKey.value = monthOptions.value[0].key;
    }
});
</script>

<template>
  <div class="flex flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-8 flex-col gap-8 relative">
     <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 class="text-4xl lg:text-6xl font-black leading-tight tracking-tight text-white">{{ i18n.t('header.nav.calendar') }}</h1>
        <label class="flex flex-col gap-2 min-w-[220px]">
          <span class="text-xs text-text-secondary font-semibold uppercase tracking-wide">{{ i18n.t('calendar.selectMonth') }}</span>
          <select v-model="selectedMonthKey" class="w-full h-11 rounded-lg bg-surface-dark border border-surface-border text-white px-3 text-sm">
            <option v-for="option in monthOptions" :key="option.key" :value="option.key">{{ option.label }}</option>
          </select>
        </label>
     </div>
     
     <div class="flex flex-col gap-8">
        <div v-for="bucket in shownBuckets" :key="`${bucket.year}-${bucket.month}`" class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <span class="text-sm font-bold uppercase tracking-[0.3em] text-primary/80">{{ bucket.label }}</span>
            <div class="flex-1 h-px bg-surface-border"></div>
          </div>
          <CalendarGrid :events="calendarEvents" :month="bucket.month" :year="bucket.year" @open-event="handleOpenEvent" />
        </div>
     </div>

     <div v-if="!visibleEvents.length && !contestsStore.loading" class="rounded-xl border border-dashed border-surface-border bg-[#111a22] p-10 text-center text-text-secondary">
        <p class="text-sm">{{ i18n.t('calendar.empty') }}</p>
     </div>
     
     <BaseModal :is-open="isDetailModalOpen" @close="isDetailModalOpen = false" class="!max-w-lg">
        <div v-if="selectedEvent" class="flex flex-col">
          <div class="h-40 w-full relative">
             <img v-if="selectedEvent?.imageUrl" :src="selectedEvent.imageUrl" class="w-full h-full object-cover opacity-60">
             <div v-else class="w-full h-full" :style="{ background: selectedEvent?.background || 'linear-gradient(135deg, #1f2a37, #0f172a)' }"></div>
             <div class="absolute inset-0 bg-gradient-to-t from-[#111a22] to-transparent"></div>
             <button @click="isDetailModalOpen = false" class="absolute top-3 right-3 bg-black/50 hover:bg-black/80 rounded-full p-1.5 text-white transition-colors cursor-pointer z-20">
                <span class="material-symbols-outlined text-[20px]">close</span>
             </button>
             <div class="absolute bottom-3 left-6 right-6">
                <span class="text-primary font-bold tracking-widest text-[10px] uppercase mb-1 block">{{ selectedEvent.platform }}</span>
                <h2 class="text-2xl font-bold text-white leading-tight shadow-black drop-shadow-md">{{ selectedEvent.title }}</h2>
             </div>
          </div>
          <div class="p-6 bg-[#111a22]">
              <div class="flex flex-wrap gap-3 text-xs text-text-secondary mb-4">
                <div v-if="selectedEvent?.dateLabel" class="flex items-center gap-2 bg-surface-dark px-3 py-1.5 rounded-lg border border-surface-border">
                  <span class="material-symbols-outlined text-[16px]">calendar_month</span>{{ selectedEvent.dateLabel }}
                </div>
                <div v-if="selectedEvent?.timeLabel" class="flex items-center gap-2 bg-surface-dark px-3 py-1.5 rounded-lg border border-surface-border">
                  <span class="material-symbols-outlined text-[16px]">schedule</span>{{ selectedEvent.timeLabel }}
                </div>
                <div v-if="selectedEvent?.difficulty" class="flex items-center gap-2 bg-surface-dark px-3 py-1.5 rounded-lg border border-surface-border">
                  <span class="material-symbols-outlined text-[16px]">signal_cellular_alt</span>{{ i18n.t(`contests.difficulty.${selectedEvent.difficulty}`) }}
                </div>
                <div v-if="selectedEvent?.duration" class="flex items-center gap-2 bg-surface-dark px-3 py-1.5 rounded-lg border border-surface-border">
                  <span class="material-symbols-outlined text-[16px]">timer</span>{{ selectedEvent.duration }}
                </div>
              </div>
              <p class="text-slate-300 text-sm leading-relaxed mb-6">{{ selectedEvent.desc || i18n.t('calendar.noDescription') }}</p>
              <a v-if="selectedEvent?.url" :href="selectedEvent.url" target="_blank" rel="noopener" class="text-sm text-primary hover:text-blue-300 underline inline-flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-[18px]">link</span>{{ i18n.t('calendar.openLink') }}
              </a>
              <div class="flex flex-col gap-2">
                <button @click="registerForEvent" class="w-full h-11 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                    {{ i18n.t('contests.register') }}
                </button>
                <button v-if="isAdmin" @click="deleteEvent" :disabled="isDeleting" class="w-full h-11 bg-red-500/10 border border-red-400/30 text-red-200 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors disabled:opacity-50">
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                    {{ i18n.t('calendar.deleteEvent') }}
                </button>
              </div>
          </div>
        </div>
     </BaseModal>
  </div>
</template>
