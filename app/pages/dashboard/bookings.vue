<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const client = useSupabaseClient();
const bookings = ref<any[]>([]);

onMounted(async () => {
  const { data } = await client
    .from("bookings")
    .select(
      `
      id,
      status,
      start_date,
      end_date,
      full_name,
      email,
      phone,
      room:room_id (
        number,
        room_type:room_type_id ( name, price ),
        resort:resort_id ( name )
      )
    `
    )
    .order("created_at", { ascending: false });
  bookings.value = data || [];
});

const updateStatus = async (id: string, status: string) => {
  await client.from("bookings").update({ status }).eq("id", id);
  bookings.value = bookings.value.map((b) =>
    b.id === id ? { ...b, status } : b
  );
};
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">📅 Manage Bookings</h1>

    <table class="w-full border text-sm">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border">Guest</th>
          <th class="p-2 border">Resort</th>
          <th class="p-2 border">Room</th>
          <th class="p-2 border">Dates</th>
          <th class="p-2 border">Status</th>
          <th class="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="b in bookings" :key="b.id">
          <td class="p-2 border">
            {{ b.full_name }}
            <br />
            <small>{{ b.email }} / {{ b.phone }}</small>
          </td>
          <td class="p-2 border">{{ b.room.resort.name }}</td>
          <td class="p-2 border">{{ b.room.room_type.name }}</td>
          <td class="p-2 border">{{ b.start_date }} → {{ b.end_date }}</td>
          <td class="p-2 border">{{ b.status }}</td>
          <td class="p-2 border">
            <button
              class="bg-green-500 text-white px-2 py-1 rounded text-xs mr-1"
              @click="updateStatus(b.id, 'confirmed')"
            >
              Confirm
            </button>
            <button
              class="bg-red-500 text-white px-2 py-1 rounded text-xs"
              @click="updateStatus(b.id, 'cancelled')"
            >
              Cancel
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
