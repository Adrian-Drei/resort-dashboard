<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const client = useSupabaseClient();
const resorts = ref<any[]>([]);

type Resort = {
  id: string;
  name: string;
  location: string;
  description: string;
  image_url?: string;
  rooms?: { id: string }[];
};

onMounted(async () => {
  const { data } = await client
    .from("resorts")
    .select("id, name, location, description, image_url, rooms(id)");

  resorts.value = (data as Resort[]).map((r) => ({
    ...r,
    room_count: r.rooms?.length || 0,
  }));
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-extrabold mb-6 text-gray-900">Resorts</h1>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="r in resorts"
        :key="r.id"
        class="list-none bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
      >
        <div class="relative h-48">
          <img
            :src="
              r.image_url || 'https://via.placeholder.com/400x300?text=No+Image'
            "
            alt="Resort image"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-800">{{ r.name }}</h2>
            <p class="text-sm text-gray-500">{{ r.location }}</p>
            <p class="mt-2 text-gray-700 text-sm line-clamp-3">
              {{ r.description }}
            </p>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <span class="text-gray-600 text-sm">{{ r.room_count }} Rooms</span>
            <NuxtLink
              :to="`/resorts/${r.id}`"
              class="text-blue-600 font-medium hover:text-blue-800"
            >
              View Rooms →
            </NuxtLink>
          </div>
        </div>
      </li>
    </div>
  </div>
</template>
