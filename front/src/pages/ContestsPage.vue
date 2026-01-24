<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/entities/user/model/store';
import BaseModal from '@/shared/ui/BaseModal.vue';

const router = useRouter();
const userStore = useUserStore();

const isAddModalOpen = ref(false);
const isContestModalOpen = ref(false);

const selectedContest = ref({
  title: '', platform: '', time: '', diff: '', desc: '', img: ''
});

const openContestModal = (title: string, platform: string, time: string, diff: string, desc: string, img: string) => {
  selectedContest.value = { title, platform, time, diff, desc, img };
  isContestModalOpen.value = true;
};

const registerForEvent = () => {
  if (!userStore.user) {
    if (confirm('Для регистрации на турнир необходимо войти в аккаунт. Перейти на страницу входа?')) {
      router.push('/auth');
    }
  } else {
    alert('Вы успешно зарегистрированы! Подтверждение отправлено на почту.');
    isContestModalOpen.value = false;
  }
};

const saveNewEvent = () => {
  isAddModalOpen.value = false;
};
</script>

<template>
  <div class="flex-1 flex justify-center w-full px-4 md:px-10 py-6 md:py-10">
    <div class="flex flex-col max-w-[1200px] w-full gap-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 class="text-4xl lg:text-6xl font-black leading-tight tracking-tight text-white">Предстоящие соревнования</h1>
        <button @click="isAddModalOpen = true" class="flex h-12 px-6 items-center justify-center gap-2 rounded-xl bg-primary text-white text-base font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/20">
          <span class="material-symbols-outlined text-[20px]">add</span>
          <span>Создать турнир</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div @click="openContestModal('Codeforces Round #930', 'Codeforces', '14:30', 'Div 2', 'Рейтинговый раунд...', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1000&auto=format&fit=crop')" class="cursor-pointer flex flex-col gap-4 rounded-xl border border-surface-border bg-[#192633] p-5 hover:border-primary hover:shadow-lg transition-all duration-300 group">
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-white text-[32px]">code</span>
              <div><p class="text-xs text-[#92adc9] uppercase font-semibold">Платформа</p><p class="text-white font-bold text-sm">Codeforces</p></div>
            </div>
            <span class="px-2.5 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase">Средний</span>
          </div>
          <div class="py-2 flex-1">
            <h3 class="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">Codeforces Round #930</h3>
            <div class="flex items-center gap-2 text-[#92adc9] text-sm"><span class="material-symbols-outlined text-[18px]">calendar_month</span><span>14:30</span></div>
          </div>
          <div class="w-full bg-surface-border h-[1px]"></div>
          <button class="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">Подробнее</button>
        </div>
      </div>
    </div>

    <!-- Contest Modal -->
    <BaseModal :is-open="isContestModalOpen" @close="isContestModalOpen = false" class="!p-0 !max-w-2xl">
      <div class="flex flex-col">
        <div class="h-48 w-full relative">
          <img :src="selectedContest.img" class="w-full h-full object-cover opacity-60" />
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
              <span class="material-symbols-outlined text-[18px]">schedule</span><span class="text-sm font-medium">{{ selectedContest.time }}</span>
            </div>
            <div class="flex items-center gap-2 text-text-secondary bg-surface-dark px-3 py-1.5 rounded-lg border border-surface-border">
              <span class="material-symbols-outlined text-[18px]">signal_cellular_alt</span><span class="text-sm font-medium">{{ selectedContest.diff }}</span>
            </div>
          </div>
          <div class="prose prose-invert max-w-none">
            <h4 class="text-white font-bold mb-2 text-lg">О соревновании</h4>
            <p class="text-slate-300 text-sm leading-relaxed">{{ selectedContest.desc }}</p>
          </div>
        </div>
        <div class="p-6 border-t border-surface-border flex gap-4 bg-[#16212e]">
          <button @click="registerForEvent" class="flex-1 h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">how_to_reg</span>Зарегистрироваться
          </button>
        </div>
      </div>
    </BaseModal>

    <!-- Add Tournament Modal -->
    <BaseModal :is-open="isAddModalOpen" @close="isAddModalOpen = false" class="max-w-md p-6">
      <h3 class="text-2xl font-bold text-white mb-6">Создать турнир</h3>
      <div class="flex flex-col gap-4">
        <label class="flex flex-col gap-1">
          <input type="text" placeholder="Например: CodeQuest Cup #1" class="rounded-lg bg-surface-dark border-surface-border text-white focus:ring-primary focus:border-primary" />
        </label>
        <div class="grid grid-cols-2 gap-4">
          <label class="flex flex-col gap-1"><span class="text-sm text-text-secondary">Дата</span><input type="date" class="rounded-lg bg-surface-dark border-surface-border text-white" /></label>
          <label class="flex flex-col gap-1"><span class="text-sm text-text-secondary">Время</span><input type="time" class="rounded-lg bg-surface-dark border-surface-border text-white" /></label>
        </div>
        <div class="flex gap-3 mt-4">
          <button @click="saveNewEvent" class="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg">Создать</button>
          <button @click="isAddModalOpen = false" class="flex-1 bg-surface-dark hover:bg-surface-border text-white font-bold py-3 rounded-lg border border-surface-border">Отмена</button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>