<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const client = useSupabaseClient();
const route = useRoute();

const room = ref<any>(null);
const startDate = ref("");
const endDate = ref("");
const fullName = ref("");
const email = ref("");
const phone = ref("");
const message = ref("");

// Load room details
onMounted(async () => {
  const { data } = await client
    .from("rooms")
    .select("id, number, room_types(name, price, description)")
    .eq("id", route.params.id)
    .single();
  room.value = data;
});

// Book the room (no login needed)
const bookRoom = async () => {
  if (
    !startDate.value ||
    !endDate.value ||
    !fullName.value ||
    !email.value ||
    !phone.value
  ) {
    message.value = "⚠️ Please fill out all fields.";
    return;
  }

  const { data: roomData } = await client
    .from("rooms")
    .select("id, resort_id, room_type_id")
    .eq("id", room.value.id)
    .single();

  const { data, error } = await client
    .from("bookings")
    .insert({
      room_id: roomData.id,
      resort_id: roomData.resort_id,
      room_type_id: roomData.room_type_id,
      start_date: startDate.value,
      end_date: endDate.value,
      full_name: fullName.value,
      email: email.value,
      phone: phone.value,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    message.value = "Booking failed: " + error.message;
  } else {
    message.value = "✅ Booking successful! We’ll contact you soon.";
    startDate.value = "";
    endDate.value = "";
    fullName.value = "";
    email.value = "";
    phone.value = "";
  }
};
</script>

<template>
  <div v-if="room" class="max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-2">Room {{ room.number }}</h1>
    <p class="mb-2">
      {{ room.room_types.name }} - ₱{{ room.room_types.price }}
    </p>
    <p class="mb-4 text-gray-700">{{ room.room_types.description }}</p>

    <div class="space-y-3">
      <label class="block">
        Full Name:
        <input type="text" v-model="fullName" class="border px-2 py-1 w-full" />
      </label>
      <label class="block">
        Email:
        <input type="email" v-model="email" class="border px-2 py-1 w-full" />
      </label>
      <label class="block">
        Phone:
        <input type="text" v-model="phone" class="border px-2 py-1 w-full" />
      </label>
      <label class="block">
        Start Date:
        <input
          type="date"
          v-model="startDate"
          class="border px-2 py-1 w-full"
        />
      </label>
      <label class="block">
        End Date:
        <input type="date" v-model="endDate" class="border px-2 py-1 w-full" />
      </label>
      <button
        @click="bookRoom"
        class="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Book this Room
      </button>
    </div>

    <p v-if="message" class="mt-3 text-green-600">{{ message }}</p>
  </div>
</template>
