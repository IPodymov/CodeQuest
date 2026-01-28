import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { useI18nStore } from '@/entities/i18n/model/store';

export interface User {
  username: string;
  email: string;
  handle: string;
  location: string;
  avatar: string | null;
}

export const useUserStore = defineStore('user', () => {
  // useStorage автоматически сохраняет данные в localStorage
  const user = useStorage<User | null>('codequest_user', null, localStorage, { mergeDefaults: true });
  const i18n = useI18nStore();

  function login(email: string) {
    // Имитация входа (как в твоем скрипте)
    user.value = {
      username: "Alex Coder",
      email: email,
      handle: "@alexcoder",
      location: i18n.locale === 'ru' ? 'Санкт-Петербург' : 'Saint Petersburg',
      avatar: null
    };
  }

  function register(data: User) {
    user.value = data;
  }

  function logout() {
    user.value = null;
  }

  function updateProfile(updatedData: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...updatedData };
    }
  }

  return { user, login, register, logout, updateProfile };
});
