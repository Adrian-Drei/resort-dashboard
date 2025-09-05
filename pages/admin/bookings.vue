<script setup lang="ts">
const { data: bookings } = await useFetch("/api/admin/bookings");
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <AdminSidebar />

    <div class="flex-1 p-8">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Bookings</h1>

      <div class="bg-white shadow-md rounded-xl overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
              >
                Guest
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
              >
                Room
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
              >
                Dates
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="b in bookings"
              :key="b.id"
              class="hover:bg-gray-50 transition cursor-pointer"
            >
              <td class="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                {{ b.guestName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                {{ b.room.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                {{ new Date(b.startDate).toLocaleDateString() }} →
                {{ new Date(b.endDate).toLocaleDateString() }}
              </td>
            </tr>

            <tr v-if="!bookings?.length">
              <td colspan="3" class="px-6 py-4 text-center text-gray-500">
                No bookings yet.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
