<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const client = useSupabaseClient();
const rooms = ref<any[]>([]);

onMounted(async () => {
  const { data } = await client.from("rooms").select(`
      id,
      number,
      resort:resort_id ( name ),
      room_type:room_type_id ( name, price )
    `);
  rooms.value = data || [];
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">🛏 Manage Rooms</h1>

    <table class="w-full border text-sm">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border">Room #</th>
          <th class="p-2 border">Resort</th>
          <th class="p-2 border">Type</th>
          <th class="p-2 border">Price</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="room in rooms" :key="room.id">
          <td class="p-2 border">{{ room.number }}</td>
          <td class="p-2 border">{{ room.resort.name }}</td>
          <td class="p-2 border">{{ room.room_type.name }}</td>
          <td class="p-2 border">₱{{ room.room_type.price }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
