<template>
  <aside class="w-64 bg-white shadow-lg p-4">
    <h2 class="text-xl font-bold mb-6">Admin Dashboard</h2>
    <nav class="space-y-2">
      <NuxtLink to="/admin" class="block px-3 py-2 rounded hover:bg-gray-100">
        📊 Overview
      </NuxtLink>
      <NuxtLink
        to="/admin/resorts"
        class="block px-3 py-2 rounded hover:bg-gray-100"
      >
        🏝 Resorts
      </NuxtLink>
      <NuxtLink
        to="/admin/rooms"
        class="block px-3 py-2 rounded hover:bg-gray-100"
      >
        🛏 Rooms
      </NuxtLink>
      <NuxtLink
        to="/admin/bookings"
        class="block px-3 py-2 rounded hover:bg-gray-100"
      >
        📅 Bookings
      </NuxtLink>
    </nav>
  </aside>
</template>

<script lang="ts" setup></script>

<style></style>
