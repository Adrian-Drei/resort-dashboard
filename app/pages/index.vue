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
  rooms?: { id: string }[];
};

onMounted(async () => {
  // get resorts with room counts
  const { data } = await client
    .from("resorts")
    .select("id, name, location, description, rooms(id)");

  resorts.value = (data as Resort[]).map((r) => ({
    ...r,
    room_count: r.rooms?.length || 0,
  }));
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Resorts</h1>
    <ul class="space-y-4">
      <li v-for="r in resorts" :key="r.id" class="border p-4 rounded shadow">
        <img
          :src="r.image_url"
          alt="Resort image"
          class="w-full h-40 object-cover rounded mb-3"
        />
        <h2 class="text-lg font-semibold">{{ r.name }}</h2>
        <p class="text-sm text-gray-600">{{ r.location }}</p>
        <p class="mt-2">{{ r.description }}</p>
        <NuxtLink
          :to="`/resorts/${r.id}`"
          class="text-blue-600 underline mt-2 inline-block"
        >
          View Rooms
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
