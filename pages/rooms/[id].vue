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
    message.value = "🎉 Booking successful! We'll contact you soon.";
  } catch (err: any) {
    message.value =
      err?.data?.statusMessage || "❌ Booking failed, please try again.";
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Room Header -->
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
      <img
        src="https://source.unsplash.com/1200x600/?resort,room"
        alt="Room"
        class="w-full h-64 object-cover"
      />
      <div class="p-6">
        <h1 class="text-3xl font-bold text-gray-800">{{ room?.name }}</h1>
        <p class="text-lg text-gray-600 mt-1">₱{{ room?.price }} / night</p>
      </div>
    </div>

    <!-- Booking Form -->
    <div class="mt-8 bg-white rounded-2xl shadow-lg p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Book Your Stay</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          v-model="guestName"
          type="text"
          placeholder="Your Full Name"
          class="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 rounded-xl"
        />
        <input
          v-model="startDate"
          type="date"
          class="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 rounded-xl"
        />
        <input
          v-model="endDate"
          type="date"
          class="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 rounded-xl"
        />
      </div>

      <button
        @click="book"
        class="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-md transition"
      >
        Confirm Booking
      </button>

      <!-- Feedback Message -->
      <p
        v-if="message"
        class="mt-4 text-center font-medium"
        :class="
          message.includes('successful') ? 'text-green-600' : 'text-red-600'
        "
      >
        {{ message }}
      </p>
    </div>
  </div>
</template>
