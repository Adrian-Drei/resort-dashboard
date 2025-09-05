<script setup lang="ts">
import { ref } from "vue";

const name = ref("");
const location = ref("");
const { data: resorts, refresh } = await useFetch("/api/admin/resorts");

async function addResort() {
  if (!name.value) return;
  await $fetch("/api/admin/resorts", {
    method: "POST",
    body: { name: name.value, location: location.value },
  });
  name.value = "";
  location.value = "";
  refresh();
}

async function removeResort(id: number) {
  if (!confirm("Delete this resort and its rooms/bookings?")) return;
  await $fetch(`/api/admin/resorts/${id}`, { method: "DELETE" });
  refresh();
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <AdminSidebar />

    <div class="flex-1 p-8">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Manage Resorts</h1>

      <!-- Add Resort Form -->
      <div class="bg-white p-6 rounded-xl shadow-md mb-8">
        <form
          @submit.prevent="addResort"
          class="flex flex-col sm:flex-row gap-4"
        >
          <input
            v-model="name"
            placeholder="Resort name"
            class="border-gray-300 border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
          <input
            v-model="location"
            placeholder="Location (city, region)"
            class="border-gray-300 border p-3 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow transition"
          >
            Add Resort
          </button>
        </form>
      </div>

      <!-- Resort List -->
      <div class="grid gap-6">
        <div
          v-for="r in resorts"
          :key="r.id"
          class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex justify-between items-center"
        >
          <div>
            <div class="font-semibold text-lg text-gray-800">{{ r.name }}</div>
            <div class="text-sm text-gray-500">{{ r.location }}</div>
            <div class="text-sm text-gray-600 mt-1">
              Rooms: {{ r.rooms?.length ?? 0 }}
            </div>
          </div>

          <div class="flex gap-2">
            <NuxtLink
              :to="`/admin/rooms?resortId=${r.id}`"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Rooms
            </NuxtLink>
            <NuxtLink
              :to="`/admin/resorts/edit/${r.id}`"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Edit
            </NuxtLink>
            <button
              @click="removeResort(r.id)"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>

        <div v-if="!resorts?.length" class="text-gray-500 text-center py-6">
          No resorts yet — add your first resort above.
        </div>
      </div>
    </div>
  </div>
</template>
