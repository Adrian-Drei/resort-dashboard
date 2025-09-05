<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const message = ref("");
const router = useRouter();

async function login() {
  try {
    await $fetch("/api/admin/login", {
      method: "POST",
      body: { email: email.value, password: password.value },
    });
    router.push("/admin"); // redirect to dashboard
  } catch (err: any) {
    message.value = err?.data?.statusMessage || "Login failed";
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white shadow-lg rounded-xl p-6 w-96">
      <h1 class="text-2xl font-bold mb-4 text-center">Admin Login</h1>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="border p-2 rounded w-full mb-3"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="border p-2 rounded w-full mb-3"
      />
      <button
        @click="login"
        class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
      <p v-if="message" class="text-red-500 text-sm mt-3">{{ message }}</p>
    </div>
  </div>
</template>
