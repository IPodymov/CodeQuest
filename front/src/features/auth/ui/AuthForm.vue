<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/entities/user/model/store';

const props = defineProps<{ 
  mode: 'login' | 'register' 
}>();

const userStore = useUserStore();
const router = useRouter();

const formData = ref({
  name: '',
  email: '',
  password: ''
});

const handleSubmit = () => {
  if (props.mode === 'login') {
    if (!formData.value.email) return alert('Введите Email');
    userStore.login(formData.value.email);
    router.push('/profile');
  } else {
    if (!formData.value.name || !formData.value.email || !formData.value.password) {
      return alert('Заполните все поля');
    }
    const newUser = {
      username: formData.value.name,
      email: formData.value.email,
      handle: '@' + formData.value.name.toLowerCase().replace(/\s/g, '_'),
      location: 'Не указано',
      avatar: null
    };
    userStore.register(newUser);
    router.push('/profile');
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
    <label v-if="mode === 'register'" class="flex flex-col gap-1.5">
      <span class="text-slate-700 dark:text-slate-200 text-sm font-medium">Имя пользователя</span>
      <div class="relative flex items-center">
        <span class="material-symbols-outlined absolute left-4 text-slate-400 text-[20px]">person</span>
        <input 
          v-model="formData.name" 
          class="w-full h-12 rounded-lg bg-slate-50 dark:bg-[#111a22] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white pl-11 pr-4 focus:ring-primary focus:border-primary" 
          placeholder="ivan_coder" 
          type="text" 
        />
      </div>
    </label>
    
    <label class="flex flex-col gap-1.5">
      <span class="text-slate-700 dark:text-slate-200 text-sm font-medium">Email</span>
      <div class="relative flex items-center">
        <span class="material-symbols-outlined absolute left-4 text-slate-400 text-[20px]">mail</span>
        <input 
          v-model="formData.email" 
          class="w-full h-12 rounded-lg bg-slate-50 dark:bg-[#111a22] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white pl-11 pr-4 focus:ring-primary focus:border-primary" 
          placeholder="student@example.com" 
          type="email" 
        />
      </div>
    </label>

    <label class="flex flex-col gap-1.5">
      <span class="text-slate-700 dark:text-slate-200 text-sm font-medium">Пароль</span>
      <div class="relative flex items-center">
        <span class="material-symbols-outlined absolute left-4 text-slate-400 text-[20px]">lock</span>
        <input 
          v-model="formData.password" 
          class="w-full h-12 rounded-lg bg-slate-50 dark:bg-[#111a22] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white pl-11 pr-12 focus:ring-primary focus:border-primary" 
          placeholder="••••••••" 
          type="password" 
        />
      </div>
    </label>

    <button class="w-full h-12 mt-2 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2">
      <span>{{ mode === 'login' ? 'Войти' : 'Создать аккаунт' }}</span>
      <span class="material-symbols-outlined text-lg">{{ mode === 'login' ? 'login' : 'person_add' }}</span>
    </button>
  </form>
</template>