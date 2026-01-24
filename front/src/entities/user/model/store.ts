import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';

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

  function login(email: string) {
    // Имитация входа (как в твоем скрипте)
    user.value = {
      username: "Alex Coder",
      email: email,
      handle: "@alexcoder",
      location: "Санкт-Петербург",
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