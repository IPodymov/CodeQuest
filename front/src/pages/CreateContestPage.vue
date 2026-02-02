<script setup lang="ts">
import {computed, ref} from 'vue';
import {RouterLink, useRouter} from 'vue-router';
import {useUserStore} from '@/stores/user';
import {useI18nStore} from '@/stores/i18n';
import {useContestsStore} from '@/stores/contests';

const userStore = useUserStore();
const contestsStore = useContestsStore();
const i18n = useI18nStore();
const router = useRouter();

const hasAccess = computed(() => {
  return userStore.user?.role === 'admin' || userStore.user?.role === 'organizer';
});

const iconOptions = [
  'emoji_events',
  'code',
  'rocket_launch',
  'timer',
  'groups',
  'school',
  'stars',
  'flash_on',
  'hub'
];

const backgroundOptions = [
  {label: 'Ocean', value: 'linear-gradient(135deg, #0ea5e9, #1e3a8a)'},
  {label: 'Sunset', value: 'linear-gradient(135deg, #f97316, #be123c)'},
  {label: 'Forest', value: 'linear-gradient(135deg, #16a34a, #065f46)'},
  {label: 'Midnight', value: 'linear-gradient(135deg, #0f172a, #334155)'},
  {label: 'Aurora', value: 'linear-gradient(135deg, #14b8a6, #6366f1)'},
  {label: 'Sand', value: 'linear-gradient(135deg, #facc15, #ea580c)'}
];

const form = ref({
  title: '',
  date: '',
  time: '',
  platform: 'CodeQuest',
  difficulty: 'medium',
  duration: '',
  url: '',
  description: '',
  icon: iconOptions[0],
  imageUrl: '',
  background: backgroundOptions[0].value
});

const platformOptions = ['Codeforces', 'AtCoder', 'LeetCode', 'ICPC', 'HackerRank', 'CodeQuest'];
const difficultyOptions = ['easy', 'beginner', 'medium', 'intermediate', 'hard', 'mixed', 'sprint'];
const error = ref<string | null>(null);
const imageError = ref<string | null>(null);

const previewStyle = computed(() => {
  if (form.value.imageUrl) {
    return {backgroundImage: `url('${form.value.imageUrl}')`};
  }
  return {backgroundImage: form.value.background};
});

const handleFileChange = (event: Event) => {
  imageError.value = null;
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    imageError.value = i18n.t('contests.imageTooLarge');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    form.value.imageUrl = String(reader.result || '');
  };
  reader.readAsDataURL(file);
};

const clearImage = () => {
  form.value.imageUrl = '';
};

const submit = async () => {
  error.value = null;
  if (!form.value.title || !form.value.date || !form.value.time) {
    error.value = i18n.t('contests.createRequired');
    return;
  }

  const start = new Date(`${form.value.date}T${form.value.time}`);
  if (Number.isNaN(start.getTime())) {
    error.value = i18n.t('contests.createRequired');
    return;
  }

  try {
    await contestsStore.createContest({
      title: form.value.title,
      platform: form.value.platform,
      startTime: start.toISOString(),
      duration: form.value.duration || null,
      url: form.value.url || null,
      description: form.value.description || null,
      difficulty: form.value.difficulty || null,
      icon: form.value.icon || null,
      imageUrl: form.value.imageUrl || null,
      background: form.value.imageUrl ? null : (form.value.background || null)
    });
    alert(i18n.t('contests.createSuccess'));
    router.push('/contests');
  } catch (e: any) {
    error.value = e?.message ?? i18n.t('contests.createError');
  }
};

const cancel = () => {
  router.push('/contests');
};
</script>

<template>
  <main class="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
    <div v-if="!userStore.user"
         class="w-full max-w-[800px] bg-surface-dark border border-surface-border rounded-2xl p-8 text-center">
      <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">{{ i18n.t('admin.loginTitle') }}</h1>
      <p class="text-text-secondary mb-6">{{ i18n.t('admin.loginText') }}</p>
      <RouterLink to="/auth"
                  class="inline-flex h-11 items-center justify-center rounded-xl px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold">
        {{ i18n.t('header.login') }}
      </RouterLink>
    </div>

    <div v-else-if="!hasAccess"
         class="w-full max-w-[800px] bg-surface-dark border border-surface-border rounded-2xl p-8 text-center">
      <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">{{ i18n.t('admin.accessDeniedTitle') }}</h1>
      <p class="text-text-secondary mb-6">{{ i18n.t('admin.accessDeniedText') }}</p>
      <RouterLink to="/contests"
                  class="inline-flex h-11 items-center justify-center rounded-xl px-6 bg-surface-highlight border border-surface-border text-white text-sm font-bold">
        {{ i18n.t('contests.title') }}
      </RouterLink>
    </div>

    <div v-else class="w-full max-w-[900px] flex flex-col gap-8">
      <section class="rounded-2xl border border-surface-border bg-[#111a22] p-6 sm:p-8">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl sm:text-4xl font-black text-white">{{ i18n.t('contests.addModalTitle') }}</h1>
          <p class="text-text-secondary">{{ i18n.t('contests.createNote') }}</p>
        </div>
      </section>

      <section class="bg-surface-dark border border-surface-border rounded-2xl p-6 sm:p-8">
        <form class="grid grid-cols-1 md:grid-cols-2 gap-4" @submit.prevent="submit">
          <label class="flex flex-col gap-2 md:col-span-2">
            <span class="text-xs uppercase tracking-wide text-text-secondary">{{
                i18n.t('contests.addNameLabel')
              }}</span>
            <input
                v-model="form.title"
                type="text"
                :placeholder="i18n.t('contests.addNamePlaceholder')"
                class="h-11 rounded-lg bg-surface-highlight border border-surface-border text-white px-3 text-sm focus:ring-primary focus:border-primary"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs uppercase tracking-wide text-text-secondary">{{ i18n.t('contests.addDate') }}</span>
            <input v-model="form.date" type="date"
                   class="h-11 rounded-lg bg-surface-highlight border border-surface-border text-white px-3 text-sm"/>
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs uppercase tracking-wide text-text-secondary">{{ i18n.t('contests.addTime') }}</span>
            <input v-model="form.time" type="time"
                   class="h-11 rounded-lg bg-surface-highlight border border-surface-border text-white px-3 text-sm"/>
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs uppercase tracking-wide text-text-secondary">{{ i18n.t('common.platform') }}</span>
            <select v-model="form.platform"
                    class="h-11 rounded-lg bg-surface-highlight border border-surface-border text-white px-3 text-sm">
              <option v-for="platform in platformOptions" :key="platform" :value="platform">{{ platform }}</option>
            </select>
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs uppercase tracking-wide text-text-secondary">{{ i18n.t('common.difficulty') }}</span>
            <select v-model="form.difficulty"
                    class="h-11 rounded-lg bg-surface-highlight border border-surface-border text-white px-3 text-sm">
              <option v-for="difficulty in difficultyOptions" :key="difficulty" :value="difficulty">
                {{ i18n.t(`contests.difficulty.${difficulty}`) }}
              </option>
            </select>
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs uppercase tracking-wide text-text-secondary">{{ i18n.t('contests.addDuration') }}</span>
            <input v-model="form.duration" type="text"
                   :placeholder="i18n.t('contests.addDurationPlaceholder')"
                   class="h-11 rounded-lg bg-surface-highlight border border-surface-border text-white px-3 text-sm"/>
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs uppercase tracking-wide text-text-secondary">{{ i18n.t('contests.addUrl') }}</span>
            <input v-model="form.url" type="url"
                   :placeholder="i18n.t('contests.addUrlPlaceholder')"
                   class="h-11 rounded-lg bg-surface-highlight border border-surface-border text-white px-3 text-sm"/>
          </label>
          <label class="flex flex-col gap-2 md:col-span-2">
            <span class="text-xs uppercase tracking-wide text-text-secondary">{{ i18n.t('contests.addDescription') }}</span>
            <textarea v-model="form.description" rows="4"
                      :placeholder="i18n.t('contests.addDescriptionPlaceholder')"
                      class="rounded-lg bg-surface-highlight border border-surface-border text-white px-3 py-2 text-sm focus:ring-primary focus:border-primary"></textarea>
          </label>

          <div class="flex flex-col gap-2 md:col-span-2">
            <span class="text-xs uppercase tracking-wide text-text-secondary">{{ i18n.t('contests.addIcon') }}</span>
            <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <button
                  v-for="icon in iconOptions"
                  :key="icon"
                  type="button"
                  @click="form.icon = icon"
                  class="h-11 rounded-lg border border-surface-border bg-surface-highlight text-white flex items-center justify-center hover:border-primary transition-colors"
                  :class="form.icon === icon ? 'ring-2 ring-primary' : ''"
              >
                <span class="material-symbols-outlined text-[22px]">{{ icon }}</span>
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-2 md:col-span-2">
            <span class="text-xs uppercase tracking-wide text-text-secondary">{{ i18n.t('contests.addBackground') }}</span>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                  v-for="bg in backgroundOptions"
                  :key="bg.label"
                  type="button"
                  @click="form.background = bg.value"
                  class="h-12 rounded-lg border border-surface-border overflow-hidden relative"
                  :class="form.background === bg.value ? 'ring-2 ring-primary' : ''"
              >
                <span class="absolute inset-0" :style="{ backgroundImage: bg.value }"></span>
                <span class="relative z-10 text-white text-xs font-bold drop-shadow-md">{{ bg.label }}</span>
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-2 md:col-span-2">
            <span class="text-xs uppercase tracking-wide text-text-secondary">{{ i18n.t('contests.addImage') }}</span>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label class="flex flex-col gap-2">
                <span class="text-xs text-text-secondary">{{ i18n.t('contests.addImageUrl') }}</span>
                <input v-model="form.imageUrl" type="url"
                       :placeholder="i18n.t('contests.addImageUrlPlaceholder')"
                       class="h-11 rounded-lg bg-surface-highlight border border-surface-border text-white px-3 text-sm"/>
              </label>
              <label class="flex flex-col gap-2">
                <span class="text-xs text-text-secondary">{{ i18n.t('contests.addImageUpload') }}</span>
                <input type="file" accept="image/*" @change="handleFileChange"
                       class="h-11 rounded-lg bg-surface-highlight border border-surface-border text-white px-3 text-sm file:bg-primary file:text-white file:border-0 file:rounded-md file:px-3 file:py-1"/>
              </label>
            </div>
            <div v-if="form.imageUrl" class="flex items-center gap-3">
              <button type="button" @click="clearImage"
                      class="text-xs font-bold text-red-400 hover:text-red-300 underline">
                {{ i18n.t('contests.clearImage') }}
              </button>
              <span class="text-xs text-text-secondary">{{ i18n.t('contests.imageHint') }}</span>
            </div>
            <p v-if="imageError" class="text-xs text-red-400">{{ imageError }}</p>
          </div>

          <div class="md:col-span-2 rounded-xl border border-surface-border overflow-hidden">
            <div class="h-36 w-full relative bg-center bg-cover" :style="previewStyle">
              <div class="absolute inset-0 bg-black/40"></div>
              <div class="absolute inset-0 flex items-center gap-4 px-6">
                <span class="material-symbols-outlined text-white text-[36px]">{{ form.icon }}</span>
                <div>
                  <p class="text-xs text-slate-200 uppercase font-semibold">{{ form.platform }}</p>
                  <h3 class="text-lg font-bold text-white">{{ form.title || i18n.t('contests.previewTitle') }}</h3>
                </div>
              </div>
            </div>
            <div class="p-4 bg-[#111a22]">
              <p class="text-sm text-slate-300">{{ form.description || i18n.t('contests.previewDescription') }}</p>
            </div>
          </div>

          <div class="md:col-span-2 flex flex-col sm:flex-row gap-3 mt-2">
            <button type="submit"
                    :disabled="contestsStore.loading"
                    class="flex-1 h-11 rounded-lg bg-primary text-white font-bold hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
              {{ contestsStore.loading ? i18n.t('common.save') : i18n.t('contests.addCreate') }}
            </button>
            <button type="button" @click="cancel"
                    class="flex-1 h-11 rounded-lg bg-surface-highlight border border-surface-border text-white font-bold hover:bg-surface-border transition-colors">
              {{ i18n.t('contests.addCancel') }}
            </button>
          </div>
          <p v-if="error" class="md:col-span-2 text-sm text-red-400">{{ error }}</p>
        </form>
      </section>
    </div>
  </main>
</template>
