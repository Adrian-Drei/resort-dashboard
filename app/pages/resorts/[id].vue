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
  <div v-if="resort" class="max-w-5xl mx-auto px-4 py-8">
    <!-- Resort Info -->
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 mb-2">
        {{ resort.name }}
      </h1>
      <p class="text-sm text-gray-500 mb-2">{{ resort.location }}</p>
      <p class="text-gray-700">{{ resort.description }}</p>
    </div>

    <!-- Rooms -->
    <h2 class="text-2xl font-semibold mb-4">Rooms</h2>
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="room in rooms"
        :key="room.id"
        class="list-none bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col justify-between"
      >
        <div>
          <p class="text-lg font-medium text-gray-800">
            Room {{ room.number }}
          </p>
          <p class="text-sm text-gray-600 mt-1">
            {{ room.room_types.name }} - ₱{{ room.room_types.price }}
          </p>
        </div>

        <NuxtLink
          :to="`/rooms/${room.id}`"
          class="mt-4 text-blue-600 font-medium hover:text-blue-800 inline-block"
        >
          Book this Room →
        </NuxtLink>
      </li>
    </div>
  </div>
</template>
