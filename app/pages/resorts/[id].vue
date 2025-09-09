<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const client = useSupabaseClient();
const route = useRoute();
const resort = ref<any>(null);
const rooms = ref<any[]>([]);

onMounted(async () => {
  const { data: r } = await client
    .from("resorts")
    .select("id, name, location, description")
    .eq("id", route.params.id)
    .single();
  resort.value = r;

  const { data: rm } = await client
    .from("rooms")
    .select("id, number, room_types(name, price)")
    .eq("resort_id", route.params.id);
  rooms.value = rm || [];
});
</script>

<template>
  <div v-if="resort">
    <h1 class="text-2xl font-bold mb-2">{{ resort.name }}</h1>
    <p class="text-sm text-gray-600">{{ resort.location }}</p>
    <p class="mb-4">{{ resort.description }}</p>

    <h2 class="text-xl font-semibold mb-3">Rooms</h2>
    <ul class="space-y-3">
      <li v-for="room in rooms" :key="room.id" class="border p-3 rounded">
        <p class="font-medium">Room {{ room.number }}</p>
        <p class="text-sm text-gray-600">{{ room.room_types.name }} - ₱{{ room.room_types.price }}</p>
        <NuxtLink :to="`/rooms/${room.id}`" class="text-blue-600 underline mt-2 inline-block">
          Book this Room
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
