<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const client = useSupabaseClient();
const bookings = ref<any[]>([]);
const resorts = ref<any[]>([]);

onMounted(async () => {
  const { data: bookingData } = await client
    .from("bookings")
    .select(
      `
      id,
      start_date,
      end_date,
      full_name,
      room:room_id (
        number,
        room_type:room_type_id ( name ),
        resort:resort_id ( name )
      )
    `
    )
    .order("created_at", { ascending: false });

  bookings.value = bookingData || [];

  const { data: resortData } = await client.from("resorts").select("*");
  resorts.value = resortData || [];
});

const totalBookings = computed(() => bookings.value.length);
const totalResorts = computed(() => resorts.value.length);
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">📊 Dashboard Overview</h1>

    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="p-4 bg-white shadow rounded">
        <h2 class="text-lg font-semibold">Total Bookings</h2>
        <p class="text-3xl">{{ totalBookings }}</p>
      </div>
      <div class="p-4 bg-white shadow rounded">
        <h2 class="text-lg font-semibold">Total Resorts</h2>
        <p class="text-3xl">{{ totalResorts }}</p>
      </div>
    </div>

    <h2 class="text-xl font-semibold mb-2">Recent Bookings</h2>
    <ul class="divide-y border rounded">
      <li v-for="b in bookings.slice(0, 5)" :key="b.id" class="p-3 text-sm">
        {{ b.full_name }} booked
        <strong>{{ b.room.room_type.name }}</strong>
        at
        <em>{{ b.room.resort.name }}</em>
        ({{ b.start_date }} → {{ b.end_date }})
      </li>
    </ul>
  </div>
</template>
