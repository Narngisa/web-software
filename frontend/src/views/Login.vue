<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const username = ref('');
const password = ref('');
const router = useRouter();
const auth = useAuthStore();

function handleLogin() {
  if (username.value === 'admin' && password.value === 'admin') {
    auth.login();
    router.push('/dashboard');
  } else {
    alert('Invalid credentials');
  }
}
</script>