<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import {useUserStore} from '@/stores/user';
import {useProfileStore} from '@/stores/profile';
import {useI18nStore} from '@/stores/i18n';
import EditProfileModal from '@/features/profile/ui/EditProfileModal.vue';

const userStore = useUserStore();
const profileStore = useProfileStore();
const isEditOpen = ref(false);
const i18n = useI18nStore();

const stats = computed(() => {
  return profileStore.stats ?? {
    rating: userStore.user?.rating ?? 0,
    participations: userStore.user?.participations ?? 0,
    solved: userStore.user?.solved ?? 0,
    wins: 0
  };
});

const achievementPalette = {
  gold: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  blue: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
} as const;

type AchievementTone = keyof typeof achievementPalette;

type AchievementDefinition = {
  id: string;
  threshold: number;
  icon: string;
  tone: AchievementTone;
  title: string;
  description: string;
};

const achievementDefinitions = computed<AchievementDefinition[]>(() => ([
  {
    id: 'first-win',
    threshold: 1,
    icon: 'emoji_events',
    tone: 'gold',
    title: i18n.t('profile.badges.firstWin'),
    description: i18n.t('profile.badgesDesc.firstWin')
  },
  {
    id: 'triple-win',
    threshold: 3,
    icon: 'military_tech',
    tone: 'blue',
    title: i18n.t('profile.badges.tripleWin'),
    description: i18n.t('profile.badgesDesc.tripleWin')
  },
  {
    id: 'legend',
    threshold: 5,
    icon: 'workspace_premium',
    tone: 'emerald',
    title: i18n.t('profile.badges.legend'),
    description: i18n.t('profile.badgesDesc.legend')
  }
]));

const achievements = computed(() => {
  const wins = stats.value.wins ?? 0;
  return achievementDefinitions.value.filter((achievement) => wins >= achievement.threshold);
});

const formatDelta = (value: number) => {
  const delta = Number.isFinite(value) ? value : 0;
  return `${delta >= 0 ? '+' : ''}${delta}`;
};

const formatDate = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat(i18n.locale.value, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

watch(
  () => userStore.user?.id,
  (id) => {
    if (id) {
      profileStore.fetchProfile();
    } else {
      profileStore.reset();
    }
  },
  { immediate: true }
);
</script>

<template>
  <main class="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
    <div v-if="userStore.user" class="w-full max-w-[1100px] flex flex-col gap-8">
      <section class="rounded-xl bg-surface-dark border border-surface-highlight p-6 sm:p-8 shadow-sm">
        <div class="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div class="flex items-center gap-6">
            <div
                class="bg-center bg-no-repeat bg-cover rounded-full size-24 sm:size-32 ring-4 ring-background-dark bg-slate-700"
                :style="{ backgroundImage: `url('${userStore.user.avatar || 'https://ui-avatars.com/api/?background=2b8cee&color=fff&size=128&name=' + userStore.user.name}')` }"></div>
            <div class="flex flex-col gap-1">
              <h1 class="text-white text-2xl sm:text-3xl font-bold leading-tight">{{ userStore.user.name }}</h1>
              <p class="text-primary text-base sm:text-lg font-medium">@{{ userStore.user.name }}</p>
              <div class="flex items-center gap-1 text-text-secondary text-sm">
                <span class="material-symbols-outlined text-[16px]">location_on</span>
                <span>{{ userStore.user.location || i18n.t('authForm.locationDefault') }}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button @click="isEditOpen = true"
                    class="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-surface-highlight hover:bg-[#2e455c] text-white text-sm font-bold transition-colors w-full sm:w-auto">
              <span class="material-symbols-outlined text-[20px]">edit</span>
              <span>{{ i18n.t('profile.edit') }}</span>
            </button>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-surface-dark border border-surface-highlight rounded-xl p-6 flex flex-col gap-2">
          <p class="text-sm font-medium uppercase tracking-wider text-text-secondary">{{ i18n.t('profile.rating') }}</p>
          <p class="text-white text-4xl font-bold">{{ stats.rating }}</p>
        </div>
        <div class="bg-surface-dark border border-surface-highlight rounded-xl p-6 flex flex-col gap-2">
          <p class="text-sm font-medium uppercase tracking-wider text-text-secondary">
            {{ i18n.t('profile.participations') }}</p>
          <p class="text-white text-4xl font-bold">{{ stats.participations }}</p>
        </div>
        <div class="bg-surface-dark border border-surface-highlight rounded-xl p-6 flex flex-col gap-2">
          <p class="text-sm font-medium uppercase tracking-wider text-text-secondary">{{ i18n.t('profile.solved') }}</p>
          <p class="text-white text-4xl font-bold">{{ stats.solved }}</p>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 flex flex-col gap-6">
          <h3 class="text-xl font-bold text-white">{{ i18n.t('profile.history') }}</h3>
          <div v-if="profileStore.history.length" class="flex flex-col gap-3">
            <div
                v-for="item in profileStore.history"
                :key="item.id"
                class="bg-surface-dark border border-surface-highlight rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div
                    class="size-10 rounded-lg flex items-center justify-center"
                    :class="item.isWinner ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'">
                  <span class="material-symbols-outlined">{{ item.isWinner ? 'emoji_events' : 'flag' }}</span>
                </div>
                <div>
                  <h4 class="font-bold text-white">{{ item.title }}</h4>
                  <p class="text-xs text-text-secondary">{{ formatDate(item.startTime) }}</p>
                  <p class="text-xs text-text-secondary">{{ item.platform }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-right">
                  <p class="text-sm font-bold text-white">{{ i18n.t('profile.rankLabel') }} {{ item.rank }}</p>
                  <p
                      class="text-xs"
                      :class="item.ratingDelta >= 0 ? 'text-green-400' : 'text-red-400'">
                    {{ i18n.t('profile.ratingDelta', { value: formatDelta(item.ratingDelta) }) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="bg-surface-dark border border-surface-highlight rounded-xl p-6 text-sm text-text-secondary">
            {{ i18n.t('profile.historyEmpty') }}
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <h3 class="text-xl font-bold text-white">{{ i18n.t('profile.achievements') }}</h3>
          <div v-if="achievements.length" class="bg-surface-dark border border-surface-highlight rounded-xl p-6 grid grid-cols-2 gap-4">
            <div v-for="achievement in achievements" :key="achievement.id" class="flex flex-col items-center gap-2 text-center group cursor-help">
              <div
                  class="size-12 rounded-full flex items-center justify-center border"
                  :class="achievementPalette[achievement.tone]">
                <span class="material-symbols-outlined text-[24px]">{{ achievement.icon }}</span>
              </div>
              <span class="text-xs text-white font-medium">{{ achievement.title }}</span>
              <span class="text-[11px] text-text-secondary">{{ achievement.description }}</span>
            </div>
          </div>
          <div v-else class="bg-surface-dark border border-surface-highlight rounded-xl p-6 text-sm text-text-secondary">
            {{ i18n.t('profile.achievementsEmpty') }}
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20 text-text-secondary">
      {{ i18n.t('profile.loginPrompt') }}
    </div>

    <!-- Edit Profile Modal -->
    <EditProfileModal
        v-if="isEditOpen"
        :is-open="isEditOpen"
        @close="isEditOpen = false"
    />
  </main>
</template>
