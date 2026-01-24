<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useUserStore } from '@/entities/user/model/store';

const userStore = useUserStore();
const router = useRouter();

// Состояние для мобильного меню и уведомлений
const isMobileMenuOpen = ref(false);
const isNotifOpen = ref(false);

const logout = () => {
  userStore.logout();
  isMobileMenuOpen.value = false;
  router.push('/');
};
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-surface-border bg-[#111a22]/95 backdrop-blur-sm">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      
      <!-- Логотип -->
      <RouterLink to="/" class="flex items-center gap-4 text-white cursor-pointer group z-50">
        <div class="flex items-center justify-center size-8 rounded-lg bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <span class="material-symbols-outlined text-[20px]">terminal</span>
        </div>
        <h2 class="text-white text-xl font-bold leading-tight tracking-tight">CodeQuest</h2>
      </RouterLink>

      <!-- Навигация (Десктоп) -->
      <nav class="hidden md:flex items-center gap-8">
        <RouterLink to="/" class="text-text-secondary hover:text-white text-sm font-medium transition-colors" active-class="text-white font-bold">Главная</RouterLink>
        <RouterLink to="/contests" class="text-text-secondary hover:text-white text-sm font-medium transition-colors" active-class="text-white font-bold">Соревнования</RouterLink>
        <RouterLink to="/calendar" class="text-text-secondary hover:text-white text-sm font-medium transition-colors" active-class="text-white font-bold">Календарь</RouterLink>
        <RouterLink to="/info" class="text-text-secondary hover:text-white text-sm font-medium transition-colors" active-class="text-white font-bold">О нас</RouterLink>
      </nav>

      <!-- Правая часть (Десктоп) -->
      <div class="hidden md:flex items-center gap-4">
        <template v-if="userStore.user">
          <div class="relative">
            <button @click="isNotifOpen = !isNotifOpen" class="flex items-center justify-center rounded-full size-10 hover:bg-surface-dark text-white transition-colors relative">
              <span class="material-symbols-outlined">notifications</span>
              <span class="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-background-dark"></span>
            </button>
            <div v-if="isNotifOpen" @click.stop class="absolute right-0 mt-2 w-64 bg-surface-dark border border-surface-border rounded-xl shadow-xl z-50 p-4 animate-fadeIn">
              <h4 class="text-white font-bold text-sm mb-2">Уведомления</h4>
              <p class="text-text-secondary text-xs">Здесь пока пусто.</p>
            </div>
          </div>
          
          <RouterLink to="/profile" class="relative cursor-pointer group">
            <div class="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-primary" 
                 :style="{ backgroundImage: `url('${userStore.user.avatar || 'https://ui-avatars.com/api/?background=2b8cee&color=fff&name=' + userStore.user.username}')` }">
            </div>
          </RouterLink>
          
          <button @click="logout" class="flex items-center justify-center gap-2 rounded-lg h-9 px-3 bg-surface-dark hover:bg-red-900/50 border border-surface-border hover:border-red-500/50 text-white text-xs font-bold transition-all ml-2">
            <span class="material-symbols-outlined text-[16px]">logout</span>
          </button>
        </template>
        
        <template v-else>
          <RouterLink to="/auth" class="flex items-center justify-center rounded-lg h-9 px-4 bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all shadow-lg shadow-primary/20">
            <span>Войти</span>
          </RouterLink>
        </template>
      </div>

      <!-- Кнопка Мобильного меню (Гамбургер) -->
      <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden text-white p-2 z-50">
        <span class="material-symbols-outlined text-[28px]">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
      </button>
    </div>

    <!-- МОБИЛЬНОЕ МЕНЮ (Выезжает поверх всего) -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-[#111a22] z-[100] flex flex-col pt-24 px-6 animate-fadeIn md:hidden overflow-y-auto">
        <nav class="flex flex-col gap-6 text-xl font-bold">
            <RouterLink to="/" @click="isMobileMenuOpen = false" class="text-white border-b border-surface-border pb-4">Главная</RouterLink>
            <RouterLink to="/contests" @click="isMobileMenuOpen = false" class="text-white border-b border-surface-border pb-4">Соревнования</RouterLink>
            <RouterLink to="/calendar" @click="isMobileMenuOpen = false" class="text-white border-b border-surface-border pb-4">Календарь</RouterLink>
            <RouterLink to="/info" @click="isMobileMenuOpen = false" class="text-white border-b border-surface-border pb-4">О нас</RouterLink>
            
            <template v-if="!userStore.user">
                <RouterLink to="/auth" @click="isMobileMenuOpen = false" class="mt-4 bg-primary text-white h-14 flex items-center justify-center rounded-xl shadow-lg">
                    Войти
                </RouterLink>
            </template>
            <template v-else>
                <RouterLink to="/profile" @click="isMobileMenuOpen = false" class="mt-4 bg-surface-dark text-white h-14 flex items-center justify-center rounded-xl border border-surface-border">
                   Мой профиль
                </RouterLink>
                <button @click="logout" class="mt-2 text-red-500 font-bold h-14 flex items-center justify-center">
                   Выйти
                </button>
            </template>
        </nav>
    </div>
  </header>
</template>