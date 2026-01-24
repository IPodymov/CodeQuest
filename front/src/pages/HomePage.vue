<script setup lang="ts">
import { useUserStore } from '@/entities/user/model/store';
import { RouterLink } from 'vue-router';

const userStore = useUserStore();

// Фейковые данные для Топа игроков
const topPlayers = [
  { rank: 1, name: 'tourist', rating: 3850, avatar: 'https://ui-avatars.com/api/?name=T&background=ff0000&color=fff' },
  { rank: 2, name: 'Benq', rating: 3600, avatar: 'https://ui-avatars.com/api/?name=B&background=0000ff&color=fff' },
  { rank: 3, name: 'Petr', rating: 3450, avatar: 'https://ui-avatars.com/api/?name=P&background=008000&color=fff' },
];
</script>

<template>
  <main class="flex-1">
    <!-- Hero Section -->
    <section class="relative px-6 py-12 lg:px-20 lg:py-24 flex justify-center items-center min-h-[600px]">
      <div class="max-w-[1200px] w-full">
        <div class="flex flex-col-reverse lg:flex-row gap-16 items-center">
          
          <!-- Левая часть: Текст -->
          <div class="flex flex-col gap-6 flex-1 text-center lg:text-left z-10">
            <template v-if="userStore.user">
              <h1 class="text-4xl lg:text-6xl font-black leading-tight tracking-tight text-white">
                Добро пожаловать, <span class="text-primary">{{ userStore.user.username }}</span>!
              </h1>
              <p class="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Твой рейтинг: <span class="text-white font-bold">1854</span>. Новые соревнования уже ждут.
                Готов побить свой рекорд сегодня?
              </p>
              <div class="pt-4 flex justify-center lg:justify-start gap-4">
                <RouterLink to="/contests" class="flex h-12 items-center justify-center rounded-xl px-8 bg-primary hover:bg-blue-600 text-white text-base font-bold shadow-lg shadow-blue-500/25 transition-all">
                  Каталог турниров
                </RouterLink>
                <RouterLink to="/profile" class="flex h-12 items-center justify-center rounded-xl px-8 bg-surface-dark border border-surface-border hover:bg-surface-highlight text-white text-base font-bold transition-all">
                  Мой профиль
                </RouterLink>
              </div>
            </template>

            <template v-else>
              <h1 class="text-4xl lg:text-6xl font-black leading-tight tracking-tight text-white">
                <span class="text-primary">Код</span> — это только начало пути
              </h1>
              <p class="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                CodeQuest — это экосистема для роста. Мы объединяем лучшие ресурсы и людей, чтобы вы могли сосредоточиться на главном — решении задач.
              </p>
              <div class="pt-4 flex justify-center lg:justify-start gap-4">
                <RouterLink to="/auth" class="flex h-12 items-center justify-center rounded-xl px-8 bg-primary hover:bg-blue-600 text-white text-base font-bold shadow-lg shadow-blue-500/25 transition-all">
                  Войти
                </RouterLink>
                <RouterLink to="/info" class="flex h-12 items-center justify-center rounded-xl px-8 bg-white/10 hover:bg-white/20 text-white text-base font-bold border border-white/10 backdrop-blur-sm transition-all">
                  Подробнее о нас
                </RouterLink>
              </div>
            </template>
          </div>

          <!-- Правая часть: Картинка и Топ игроков -->
          <div class="flex-1 w-full max-w-[600px] relative">
            <div class="aspect-[4/3] w-full bg-gradient-to-br from-surface-dark to-background-dark border border-surface-border rounded-2xl overflow-hidden relative shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500">
              <img src="https://img.freepik.com/premium-photo/professional-programmer-engineer-writing-code_1029473-73206.jpg" class="w-full h-full object-cover opacity-80 mix-blend-overlay" alt="Coding Background" />
              <div class="absolute bottom-6 left-6 right-6 p-4 bg-surface-dark/90 backdrop-blur-md rounded-lg border border-surface-border flex items-center gap-4">
                <div class="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span class="material-symbols-outlined">emoji_events</span>
                </div>
                <div>
                  <p class="text-xs text-text-secondary uppercase font-bold tracking-wider">Актуально сейчас</p>
                  <p class="text-sm text-white font-medium">Финал ICPC 2026</p>
                </div>
              </div>
            </div>

            <div class="absolute -bottom-10 -right-4 lg:-right-12 bg-[#111a22] border border-surface-border p-4 rounded-xl shadow-2xl max-w-[260px] w-full hidden sm:block">
              <h3 class="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <span class="material-symbols-outlined text-yellow-500">trophy</span> Топ рейтинга
              </h3>
              <div class="flex flex-col gap-3">
                <div v-for="player in topPlayers" :key="player.rank" class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-text-secondary font-bold w-4">{{ player.rank }}</span>
                    <img :src="player.avatar" class="size-6 rounded-full">
                    <span class="text-sm text-white font-medium">{{ player.name }}</span>
                  </div>
                  <span class="text-xs text-primary font-bold">{{ player.rating }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <div class="w-full border-y border-surface-border bg-surface-dark/30">
      <div class="max-w-[1200px] mx-auto px-6 py-12 flex flex-wrap justify-center gap-10 lg:justify-between text-center lg:text-left">
        <div class="flex flex-col gap-1"><span class="text-4xl font-black text-white">500+</span><span class="text-sm text-text-secondary font-medium uppercase tracking-wide">Турниров</span></div>
        <div class="flex flex-col gap-1"><span class="text-4xl font-black text-white">12k+</span><span class="text-sm text-text-secondary font-medium uppercase tracking-wide">Участников</span></div>
        <div class="flex flex-col gap-1"><span class="text-4xl font-black text-white">50+</span><span class="text-sm text-text-secondary font-medium uppercase tracking-wide">Стран</span></div>
      </div>
    </div>
  </main>
</template>