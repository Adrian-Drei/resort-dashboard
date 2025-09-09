<script setup lang="ts"></script>

<template>
  <aside class="w-64 bg-gray-800 text-white h-auto min-h-svh flex flex-col p-4">
    <div class="sticky top-20">
      <h1 class="text-2xl font-bold mb-6">🏝 Resort Dashboard</h1>
      <nav class="flex flex-col gap-2">
        <NuxtLink
          :to="Routes.Dashboard"
          class="px-3 py-2 rounded hover:bg-gray-700 transition"
          active-class="bg-gray-700"
        >
          Dashboard
        </NuxtLink>
        <NuxtLink
          :to="Routes.DashboardResorts"
          class="px-3 py-2 rounded hover:bg-gray-700 transition"
          active-class="bg-gray-700"
        >
          Resorts
        </NuxtLink>
        <NuxtLink
          :to="Routes.DashboardBookings"
          class="px-3 py-2 rounded hover:bg-gray-700 transition"
          active-class="bg-gray-700"
        >
          Bookings
        </NuxtLink>
      </nav>
    </div>
  </aside>
</template>
