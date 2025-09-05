<script setup lang="ts">
import { ref } from "vue";

const route = useRoute();
const roomId = Number(route.params.id);
const { data: resorts } = await useFetch("/api/resorts");
const room = resorts.value
  ?.flatMap((r) => r.rooms)
  .find((r) => r.id === roomId);

const guestName = ref("");
const startDate = ref("");
const endDate = ref("");
const message = ref("");

async function book() {
  try {
    await $fetch("/api/bookings", {
      method: "POST",
      body: {
        guestName: guestName.value,
        startDate: startDate.value,
        endDate: endDate.value,
        roomId,
      },
    });
    message.value = "Booking successful!";
  } catch (err: any) {
    message.value = err?.data?.statusMessage || "Booking failed";
  }
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">{{ room?.name }}</h1>
    <p class="text-gray-600">₱{{ room?.price }}</p>

    <div class="mt-4">
      <input
        v-model="guestName"
        type="text"
        placeholder="Your Name"
        class="border p-2 rounded w-full mb-2"
      />
      <input
        v-model="startDate"
        type="date"
        class="border p-2 rounded w-full mb-2"
      />
      <input
        v-model="endDate"
        type="date"
        class="border p-2 rounded w-full mb-2"
      />
      <button @click="book" class="bg-blue-600 text-white px-4 py-2 rounded">
        Book Now
      </button>
      <p class="mt-2 text-sm text-red-500">{{ message }}</p>
    </div>
  </div>
</template>
