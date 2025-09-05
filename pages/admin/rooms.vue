<script setup lang="ts">
import { ref } from "vue";

const { data: rooms, refresh } = await useFetch("/api/admin/rooms");
const name = ref("");
const price = ref("");
const resortId = ref("");

async function addRoom() {
  await $fetch("/api/admin/rooms", {
    method: "POST",
    body: {
      name: name.value,
      price: parseFloat(price.value),
      resortId: Number(resortId.value),
    },
  });
  name.value = "";
  price.value = "";
  resortId.value = "";
  refresh();
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <AdminSidebar />

    <div class="flex-1 p-8">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Rooms</h1>

      <!-- Add Room Form -->
      <div class="bg-white p-6 rounded-xl shadow-md mb-8">
        <form @submit.prevent="addRoom" class="flex flex-col sm:flex-row gap-4">
          <input
            v-model="name"
            placeholder="Room Name"
            class="border-gray-300 border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
          <input
            v-model="price"
            placeholder="Price"
            type="number"
            class="border-gray-300 border p-3 rounded-lg w-full sm:w-32 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
          <input
            v-model="resortId"
            placeholder="Resort ID"
            type="number"
            class="border-gray-300 border p-3 rounded-lg w-full sm:w-32 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow transition"
          >
            Add Room
          </button>
        </form>
      </div>

      <!-- Rooms Table -->
      <div class="bg-white shadow-md rounded-xl overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
              >
                Resort ID
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="r in rooms"
              :key="r.id"
              class="hover:bg-gray-50 transition cursor-pointer"
            >
              <td class="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                {{ r.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                ₱{{ r.price }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                {{ r.resortId }}
              </td>
            </tr>

            <tr v-if="!rooms?.length">
              <td colspan="3" class="px-6 py-4 text-center text-gray-500">
                No rooms yet — add your first room above.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
