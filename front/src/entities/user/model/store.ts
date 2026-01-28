import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { useI18nStore } from '@/entities/i18n/model/store';

export interface User {
  id: string;
  username: string;
  email: string;
  handle: string;
  location: string;
  avatar: string | null;
  roles?: string[];
}

export const useUserStore = defineStore('user', () => {
  // useStorage Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё СЃРѕС…СЂР°РЅСЏРµС‚ РґР°РЅРЅС‹Рµ РІ localStorage
  const user = useStorage<User | null>('codequest_user', null, localStorage, { mergeDefaults: true });
  const i18n = useI18nStore();
  const apiBase = import.meta.env.VITE_API_BASE ?? 'http://localhost:3001';

  async function apiPost<T>(path: string, payload: Record<string, unknown>) {
    const response = await fetch(`${apiBase}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.message ?? 'Request failed');
    }
    return data as T;
  }

  async function login(identifier: string, password: string) {
    const data = await apiPost<{ user: User }>('/api/login', { identifier, password });
    user.value = data.user;
  }

  async function register(data: { username: string; email: string; password: string; location?: string | null; avatar?: string | null }) {
    const payload = {
      ...data,
      location: data.location ?? i18n.t('authForm.locationDefault'),
      avatar: data.avatar ?? null
    };
    const result = await apiPost<{ user: User }>('/api/register', payload);
    user.value = result.user;
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
