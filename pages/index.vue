<script setup lang="ts">
const { data: resorts } = await useFetch("/api/resorts");
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Local Resorts</h1>
    <div class="grid gap-4 md:grid-cols-2">
      <div
        v-for="resort in resorts"
        :key="resort.id"
        class="p-4 border rounded-lg shadow"
      >
        <h2 class="text-xl font-semibold">{{ resort.name }}</h2>
        <p class="text-gray-600">{{ resort.location }}</p>
        <div class="mt-2">
          <h3 class="font-medium">Rooms:</h3>
          <ul>
            <li v-for="room in resort.rooms" :key="room.id">
              <NuxtLink
                :to="`/rooms/${room.id}`"
                class="text-blue-600 underline"
              >
                {{ room.name }} - ₱{{ room.price }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
