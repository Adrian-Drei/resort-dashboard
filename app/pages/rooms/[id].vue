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
const messageType = ref<"error" | "success" | "info">("info");

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
    messageType.value = "error";
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
    messageType.value = "error";
  } else {
    message.value = "✅ Booking successful! We’ll contact you soon.";
    messageType.value = "success";
    startDate.value = "";
    endDate.value = "";
    fullName.value = "";
    email.value = "";
    phone.value = "";
  }
};
</script>

<template>
  <div
    v-if="room"
    class="max-w-lg mx-auto bg-white rounded-xl shadow-md p-6 mt-8"
  >
    <!-- Room Info -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-1">
        Room {{ room.number }}
      </h1>
      <p class="text-gray-700 mb-1">
        {{ room.room_types.name }} - ₱{{ room.room_types.price }}
      </p>
      <p class="text-gray-600">{{ room.room_types.description }}</p>
    </div>

    <!-- Booking Form -->
    <div class="space-y-4">
      <label class="block">
        <span class="text-gray-700 font-medium">Full Name</span>
        <input
          type="text"
          v-model="fullName"
          class="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </label>

      <label class="block">
        <span class="text-gray-700 font-medium">Email</span>
        <input
          type="email"
          v-model="email"
          class="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </label>

      <label class="block">
        <span class="text-gray-700 font-medium">Phone</span>
        <input
          type="text"
          v-model="phone"
          class="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </label>

      <label class="block">
        <span class="text-gray-700 font-medium">Start Date</span>
        <input
          type="date"
          v-model="startDate"
          class="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </label>

      <label class="block">
        <span class="text-gray-700 font-medium">End Date</span>
        <input
          type="date"
          v-model="endDate"
          class="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </label>

      <button
        @click="bookRoom"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors duration-200"
      >
        Book this Room
      </button>
    </div>

    <!-- Message -->
    <p
      v-if="message"
      :class="[
        'mt-4 text-center font-medium',
        messageType === 'success' ? 'text-green-600' : 'text-red-600',
      ]"
    >
      {{ message }}
    </p>
  </div>
</template>
