<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {useUserStore} from '@/stores/user';
import {useI18nStore} from '@/stores/i18n';
import BaseModal from '@/shared/ui/BaseModal.vue';
import {useContestsStore} from '@/stores/contests';
import type {Contest} from '@/stores/contests';

const router = useRouter();
const userStore = useUserStore();
const contestsStore = useContestsStore();
const i18n = useI18nStore();

const isContestModalOpen = ref(false);
const isDeleting = ref(false);

const selectedContestId = ref<string | null>(null);

const query = ref('');
const platformFilter = ref('all');
const difficultyFilter = ref('all');
const showFavorites = ref(false);

const platformOptions = computed(() => {
  return Array.from(new Set(contestsStore.contests.map((item) => item.platform))).filter(Boolean);
});

const difficultyOptions = computed(() => {
  return Array.from(new Set(contestsStore.contests.map((item) => item.difficulty))).filter(Boolean);
});

const difficultyBadge = (difficulty?: string | null) => {
  switch (difficulty) {
    case 'easy':
    case 'beginner':
      return 'bg-green-500/10 border-green-500/20 text-green-400';
    case 'sprint':
      return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    case 'hard':
      return 'bg-red-500/10 border-red-500/20 text-red-400';
    case 'intermediate':
      return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
    case 'mixed':
      return 'bg-slate-500/10 border-slate-500/20 text-slate-300';
    default:
      return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
  }
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

const mapContest = (item: Contest) => {
  const difficulty = item.difficulty ?? 'medium';
  return {
    ...item,
    title: item.title,
    desc: item.description || '',
    diff: difficulty,
    diffLabel: i18n.t(`contests.difficulty.${difficulty}`),
    time: formatTime(item.startTime),
    date: formatDate(item.startTime),
    icon: item.icon || 'emoji_events',
    badgeClass: difficultyBadge(difficulty),
    img: item.imageUrl || '',
    background: item.background || ''
  };
};

const filteredContests = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase();
  return contestsStore.contests
    .filter((item) => {
      if (platformFilter.value !== 'all' && item.platform !== platformFilter.value) return false;
      if (difficultyFilter.value !== 'all' && item.difficulty !== difficultyFilter.value) return false;
      if (showFavorites.value && !contestsStore.isFavorite(item.id)) return false;
      if (!normalizedQuery) return true;
      const title = item.title.toLowerCase();
      return title.includes(normalizedQuery);
    })
    .map(mapContest);
});

const selectedContest = computed(() => {
  const item = contestsStore.contests.find((contest) => contest.id === selectedContestId.value);
  return item ? mapContest(item) : null;
});

const canCreateContest = computed(() => {
  return userStore.user?.role === 'admin' || userStore.user?.role === 'organizer';
});

const openContestModal = (id: string) => {
  selectedContestId.value = id;
  isContestModalOpen.value = true;
};

const goToCreatePage = () => {
  router.push('/contests/create');
};

const registerForEvent = () => {
  if (!userStore.user) {
    if (confirm(i18n.t('contests.registerConfirm'))) {
      router.push('/auth');
    }
    return;
  }
  alert(i18n.t('contests.registerSuccess'));
  isContestModalOpen.value = false;
};

const deleteContest = async () => {
  if (!selectedContestId.value || isDeleting.value) return;
  if (!confirm(i18n.t('contests.deleteConfirm'))) return;
  try {
    isDeleting.value = true;
    await contestsStore.deleteContest(selectedContestId.value);
    alert(i18n.t('contests.deleteSuccess'));
    isContestModalOpen.value = false;
    selectedContestId.value = null;
  } catch (e) {
    alert(i18n.t('contests.deleteError'));
  } finally {
    isDeleting.value = false;
  }
};

const resetFilters = () => {
  query.value = '';
  platformFilter.value = 'all';
  difficultyFilter.value = 'all';
};

const toggleFavoritesView = () => {
  showFavorites.value = !showFavorites.value;
};

const toggleFavorite = (id: string) => {
  contestsStore.toggleFavorite(id);
};

const favoriteLabel = (id: string) => {
  return contestsStore.isFavorite(id) ? i18n.t('contests.favoritesRemove') : i18n.t('contests.favoritesAdd');
};

onMounted(() => {
  if (!contestsStore.contests.length) {
    contestsStore.fetchContests();
  }
});
</script>

<template>
  <div class="flex-1 flex justify-center w-full px-4 md:px-10 py-6 md:py-10">
    <div class="flex flex-col max-w-[1200px] w-full gap-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 class="text-4xl lg:text-6xl font-black leading-tight tracking-tight text-white">{{ i18n.t('contests.title') }}</h1>
        <button v-if="canCreateContest" @click="goToCreatePage" class="flex h-12 px-6 items-center justify-center gap-2 rounded-xl bg-primary text-white text-base font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/20">
          <span class="material-symbols-outlined text-[20px]">add</span>
          <span>{{ i18n.t('contests.create') }}</span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 rounded-xl border border-surface-border bg-[#111a22] p-4">
        <label class="flex flex-col gap-2 lg:col-span-2">
          <span class="text-xs text-text-secondary font-semibold uppercase tracking-wide">{{ i18n.t('common.search') }}</span>
          <div class="relative">
            <span class="material-symbols-outlined text-slate-400 text-[18px] absolute left-3 top-1/2 -translate-y-1/2">search</span>
            <input
              v-model="query"
              :placeholder="i18n.t('contests.searchPlaceholder')"
              class="w-full h-11 rounded-lg bg-surface-dark border border-surface-border text-white pl-10 pr-3 text-sm focus:ring-primary focus:border-primary"
            />
          </div>
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs text-text-secondary font-semibold uppercase tracking-wide">{{ i18n.t('common.platform') }}</span>
          <select v-model="platformFilter" class="w-full h-11 rounded-lg bg-surface-dark border border-surface-border text-white px-3 text-sm">
            <option value="all">{{ i18n.t('contests.platformAll') }}</option>
            <option v-for="platform in platformOptions" :key="platform" :value="platform">{{ platform }}</option>
          </select>
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs text-text-secondary font-semibold uppercase tracking-wide">{{ i18n.t('common.difficulty') }}</span>
          <select v-model="difficultyFilter" class="w-full h-11 rounded-lg bg-surface-dark border border-surface-border text-white px-3 text-sm">
            <option value="all">{{ i18n.t('contests.difficultyAll') }}</option>
            <option v-for="difficulty in difficultyOptions" :key="difficulty" :value="difficulty">{{ i18n.t(`contests.difficulty.${difficulty}`) }}</option>
          </select>
        </label>
        <div class="lg:col-span-4 flex flex-wrap items-center justify-between gap-3">
          <button @click="resetFilters" class="h-10 px-4 rounded-lg border border-surface-border bg-surface-dark text-text-secondary hover:text-white hover:border-primary transition-colors text-xs font-bold">
            {{ i18n.t('contests.reset') }}
          </button>
          <button
            @click="toggleFavoritesView"
            class="h-10 px-4 rounded-lg border border-surface-border bg-surface-dark text-text-secondary hover:text-white hover:border-primary transition-colors text-xs font-bold flex items-center gap-2"
          >
            <span class="material-symbols-outlined text-[18px]">bookmark</span>
            <span>{{ showFavorites ? i18n.t('contests.showAll') : i18n.t('contests.showFavorites') }}</span>
            <span v-if="contestsStore.favoritesCount" class="text-primary">({{ contestsStore.favoritesCount }})</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="contest in filteredContests"
          :key="contest.id"
          @click="openContestModal(contest.id)"
          class="cursor-pointer flex flex-col gap-4 rounded-xl border border-surface-border bg-[#192633] p-5 hover:border-primary hover:shadow-lg transition-all duration-300 group"
        >
          <div class="h-24 rounded-lg overflow-hidden relative">
            <img v-if="contest.img" :src="contest.img" class="w-full h-full object-cover opacity-70" />
            <div v-else class="w-full h-full" :style="{ background: contest.background || 'linear-gradient(135deg, #1f2a37, #0f172a)' }"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-[#111a22] to-transparent"></div>
            <div class="absolute inset-0 flex items-center gap-3 px-4">
              <span class="material-symbols-outlined text-white text-[28px]">{{ contest.icon }}</span>
              <div>
                <p class="text-xs text-[#92adc9] uppercase font-semibold">{{ i18n.t('common.platform') }}</p>
                <p class="text-white font-bold text-sm">{{ contest.platform }}</p>
              </div>
            </div>
          </div>
          <div class="flex justify-between items-start">
            <span class="px-2.5 py-1 rounded-md border text-xs font-bold uppercase" :class="contest.badgeClass">{{ contest.diffLabel }}</span>
            <button
              @click.stop="toggleFavorite(contest.id)"
              :title="favoriteLabel(contest.id)"
              class="size-9 rounded-lg border border-surface-border bg-surface-dark text-text-secondary hover:text-primary hover:border-primary transition-colors flex items-center justify-center"
            >
              <span class="material-symbols-outlined text-[18px]">{{ contestsStore.isFavorite(contest.id) ? 'bookmark' : 'bookmark_border' }}</span>
            </button>
          </div>
          <div class="py-2 flex-1">
            <h3 class="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{{ contest.title }}</h3>
            <div class="flex items-center gap-2 text-[#92adc9] text-sm"><span class="material-symbols-outlined text-[18px]">calendar_month</span><span>{{ contest.date }} {{ contest.time }}</span></div>
            <p v-if="isAdmin" class="mt-2 text-xs text-[#92adc9] break-all">
              <span class="font-semibold">{{ i18n.t('contests.idLabel') }}:</span> {{ contest.id }}
            </p>
          </div>
          <div class="w-full bg-surface-border h-[1px]"></div>
          <button class="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">{{ i18n.t('common.details') }}</button>
        </div>
      </div>

      <div v-if="!filteredContests.length && !contestsStore.loading" class="rounded-xl border border-dashed border-surface-border bg-[#111a22] p-10 text-center text-text-secondary">
        <p class="text-sm">{{ showFavorites ? i18n.t('contests.favoritesEmpty') : i18n.t('contests.empty') }}</p>
      </div>
    </div>

    <!-- Contest Modal -->
    <BaseModal :is-open="isContestModalOpen" @close="isContestModalOpen = false" class="!p-0 !max-w-2xl">
      <div v-if="selectedContest" class="flex flex-col">
        <div class="h-48 w-full relative">
          <img v-if="selectedContest.img" :src="selectedContest.img" class="w-full h-full object-cover opacity-60" />
          <div v-else class="w-full h-full" :style="{ background: selectedContest.background || 'linear-gradient(135deg, #1f2a37, #0f172a)' }"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-[#111a22] to-transparent"></div>
          <button @click="isContestModalOpen = false" class="absolute top-4 right-4 bg-black/50 hover:bg-black/80 rounded-full p-2 text-white transition-colors backdrop-blur-md">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
          <div class="absolute bottom-4 left-8">
            <span class="text-primary font-bold tracking-widest text-xs uppercase mb-1 block">{{ selectedContest.platform }}</span>
            <h2 class="text-3xl font-bold text-white shadow-black drop-shadow-lg">{{ selectedContest.title }}</h2>
          </div>
        </div>
        <div class="p-8 pb-4 bg-[#111a22]">
          <div class="flex flex-wrap gap-4 mb-6">
            <div class="flex items-center gap-2 text-text-secondary bg-surface-dark px-3 py-1.5 rounded-lg border border-surface-border">
              <span class="material-symbols-outlined text-[18px]">schedule</span><span class="text-sm font-medium">{{ selectedContest.date }} {{ selectedContest.time }}</span>
            </div>
            <div class="flex items-center gap-2 text-text-secondary bg-surface-dark px-3 py-1.5 rounded-lg border border-surface-border">
              <span class="material-symbols-outlined text-[18px]">signal_cellular_alt</span><span class="text-sm font-medium">{{ selectedContest.diffLabel }}</span>
            </div>
            <div v-if="selectedContest.duration" class="flex items-center gap-2 text-text-secondary bg-surface-dark px-3 py-1.5 rounded-lg border border-surface-border">
              <span class="material-symbols-outlined text-[18px]">timer</span><span class="text-sm font-medium">{{ selectedContest.duration }}</span>
            </div>
            <div v-if="selectedContest.url" class="flex items-center gap-2 text-text-secondary bg-surface-dark px-3 py-1.5 rounded-lg border border-surface-border">
              <span class="material-symbols-outlined text-[18px]">link</span>
              <a :href="selectedContest.url" target="_blank" rel="noopener" class="text-sm font-medium text-primary hover:text-blue-300 underline">{{ i18n.t('contests.openLink') }}</a>
            </div>
            <div v-if="isAdmin" class="flex items-center gap-2 text-text-secondary bg-surface-dark px-3 py-1.5 rounded-lg border border-surface-border">
              <span class="material-symbols-outlined text-[18px]">tag</span>
              <span class="text-sm font-medium">{{ i18n.t('contests.idLabel') }}: {{ selectedContest.id }}</span>
            </div>
          </div>
          <div class="prose prose-invert max-w-none">
            <h4 class="text-white font-bold mb-2 text-lg">{{ i18n.t('contests.aboutTitle') }}</h4>
            <p class="text-slate-300 text-sm leading-relaxed">{{ selectedContest.desc || i18n.t('contests.noDescription') }}</p>
          </div>
        </div>
        <div class="p-6 border-t border-surface-border flex flex-col sm:flex-row gap-3 bg-[#16212e]">
          <button @click="registerForEvent" class="flex-1 h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">how_to_reg</span>{{ i18n.t('contests.register') }}
          </button>
          <button v-if="isAdmin" @click="deleteContest" :disabled="isDeleting" class="flex-1 h-12 bg-red-500/10 border border-red-400/30 text-red-200 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors disabled:opacity-50">
            <span class="material-symbols-outlined text-[18px]">delete</span>
            {{ i18n.t('contests.deleteEvent') }}
          </button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
