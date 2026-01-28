<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/entities/user/model/store';
import { useI18nStore } from '@/entities/i18n/model/store';
import { RouterLink } from 'vue-router';

const userStore = useUserStore();
const i18n = useI18nStore();

const hasAccess = computed(() => {
  const roles = userStore.user?.roles ?? [];
  return roles.includes('admin') || roles.includes('organizer');
});
</script>

<template>
  <main class="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
    <div v-if="!userStore.user" class="w-full max-w-[800px] bg-surface-dark border border-surface-border rounded-2xl p-8 text-center">
      <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">{{ i18n.t('admin.loginTitle') }}</h1>
      <p class="text-text-secondary mb-6">{{ i18n.t('admin.loginText') }}</p>
      <RouterLink to="/auth" class="inline-flex h-11 items-center justify-center rounded-xl px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold">
        {{ i18n.t('header.login') }}
      </RouterLink>
    </div>

    <div v-else-if="!hasAccess" class="w-full max-w-[800px] bg-surface-dark border border-surface-border rounded-2xl p-8 text-center">
      <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">{{ i18n.t('admin.accessDeniedTitle') }}</h1>
      <p class="text-text-secondary">{{ i18n.t('admin.accessDeniedText') }}</p>
    </div>

    <div v-else class="w-full max-w-[1200px] flex flex-col gap-8">
      <section class="rounded-2xl border border-surface-border bg-[#111a22] p-6 sm:p-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl sm:text-4xl font-black text-white">{{ i18n.t('admin.title') }}</h1>
            <p class="text-text-secondary mt-2 max-w-2xl">{{ i18n.t('admin.subtitle') }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs uppercase tracking-widest text-primary font-bold">{{ i18n.t('admin.badge') }}</span>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-surface-dark border border-surface-border rounded-xl p-5">
          <p class="text-xs text-text-secondary uppercase tracking-wide">{{ i18n.t('admin.stats.users') }}</p>
          <p class="text-3xl font-black text-white mt-2">0</p>
        </div>
        <div class="bg-surface-dark border border-surface-border rounded-xl p-5">
          <p class="text-xs text-text-secondary uppercase tracking-wide">{{ i18n.t('admin.stats.contests') }}</p>
          <p class="text-3xl font-black text-white mt-2">0</p>
        </div>
        <div class="bg-surface-dark border border-surface-border rounded-xl p-5">
          <p class="text-xs text-text-secondary uppercase tracking-wide">{{ i18n.t('admin.stats.reports') }}</p>
          <p class="text-3xl font-black text-white mt-2">0</p>
        </div>
        <div class="bg-surface-dark border border-surface-border rounded-xl p-5">
          <p class="text-xs text-text-secondary uppercase tracking-wide">{{ i18n.t('admin.stats.roles') }}</p>
          <p class="text-3xl font-black text-white mt-2">3</p>
        </div>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-surface-dark border border-surface-border rounded-2xl p-6">
          <h2 class="text-xl font-bold text-white mb-4">{{ i18n.t('admin.actions.title') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button class="h-12 rounded-xl bg-primary text-white font-bold hover:bg-blue-600 transition-colors">
              {{ i18n.t('admin.actions.createContest') }}
            </button>
            <button class="h-12 rounded-xl bg-surface-highlight text-white font-bold border border-surface-border">
              {{ i18n.t('admin.actions.manageUsers') }}
            </button>
            <button class="h-12 rounded-xl bg-surface-highlight text-white font-bold border border-surface-border">
              {{ i18n.t('admin.actions.manageRoles') }}
            </button>
            <button class="h-12 rounded-xl bg-surface-highlight text-white font-bold border border-surface-border">
              {{ i18n.t('admin.actions.reviewReports') }}
            </button>
          </div>
        </div>
        <div class="bg-[#111a22] border border-surface-border rounded-2xl p-6">
          <h3 class="text-lg font-bold text-white mb-3">{{ i18n.t('admin.statusTitle') }}</h3>
          <div class="flex flex-col gap-3 text-sm text-text-secondary">
            <div class="flex items-center justify-between">
              <span>{{ i18n.t('admin.status.api') }}</span>
              <span class="text-green-400 font-semibold">OK</span>
            </div>
            <div class="flex items-center justify-between">
              <span>{{ i18n.t('admin.status.database') }}</span>
              <span class="text-green-400 font-semibold">OK</span>
            </div>
            <div class="flex items-center justify-between">
              <span>{{ i18n.t('admin.status.version') }}</span>
              <span class="text-slate-300">0.1</span>
            </div>
          </div>
          <p class="mt-4 text-xs text-text-secondary">{{ i18n.t('admin.comingSoon') }}</p>
        </div>
      </section>
    </div>
  </main>
</template>
