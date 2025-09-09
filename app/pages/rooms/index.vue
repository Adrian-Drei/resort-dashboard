<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const client = useSupabaseClient();
const rooms = ref<any[]>([]);

onMounted(async () => {
  const { data } = await client
    .from("rooms")
    .select("id, number, room_type_id");
  rooms.value = data || [];
});
</script>

<template>
  <div>
    <h1 class="text-xl font-bold mb-4">Rooms</h1>
    <ul>
      <li v-for="room in rooms" :key="room.id">
        Room {{ room.number }} (Type: {{ room.room_type_id }})
      </li>
    </ul>
  </div>
</template>
