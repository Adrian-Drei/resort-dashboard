<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const client = useSupabaseClient();
const user = useSupabaseUser();
const bookings = ref<any[]>([]);

onMounted(async () => {
  if (!user.value) return;
  const { data } = await client
    .from("bookings")
    .select("id, start_date, end_date, status, total_amount")
    .eq("user_id", user.value.id);
  bookings.value = data || [];
});
</script>

<template>
  <div>
    <h1 class="text-xl font-bold mb-4">My Bookings</h1>
    <ul>
      <li v-for="b in bookings" :key="b.id" class="border-b py-2">
        {{ b.start_date }} → {{ b.end_date }} | {{ b.status }} | ₱{{
          b.total_amount
        }}
      </li>
    </ul>
  </div>
</template>
