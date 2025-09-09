<template>
  <form @submit.prevent="submit">
    <input v-model="start" type="date" required />
    <input v-model="end" type="date" required />
    <input v-model.number="guests" type="number" min="1" />
    <button :disabled="loading">{{ loading ? "Booking..." : "Book" }}</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
const props = defineProps({
  roomTypeId: { type: String, required: true },
  resortId: { type: String, required: true },
});
const start = ref("");
const end = ref("");
const guests = ref(1);
const loading = ref(false);
const { $supabase } = useNuxtApp();
async function submit() {
  loading.value = true;
  try {
    const res = await $supabase.from("bookings").insert([
      {
        user_id: (await $supabase.auth.getUser()).data.user?.id,
        resort_id: props.resortId,
        room_type_id: props.roomTypeId,
        start_date: start.value,
        end_date: end.value,
        guests: guests.value,
        status: "pending",
      },
    ]);
    // handle redirect to payment or confirmation
    console.log(res);
  } finally {
    loading.value = false;
  }
}
</script>
