<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const client = useSupabaseClient();
const resorts = ref<any[]>([]);
const name = ref("");
const description = ref("");

// State for edit mode per room
const editingRoomId = ref<string | null>(null);

// State for new room per resort
const newRooms = ref<{
  [key: string]: { number: string; typeName: string; price: number };
}>({});

// Load resorts + rooms
onMounted(async () => {
  await loadResorts();
});

const loadResorts = async () => {
  const { data, error } = await client.from("resorts").select(`
      id, name, description,
      rooms (
        id, number,
        room_types (
          id, name, price
        )
      )
    `);

  if (error) {
    console.error(error);
  } else {
    resorts.value = data || [];

    // Initialize newRooms state for each resort
    resorts.value.forEach((r) => {
      newRooms.value[r.id] = { number: "", typeName: "", price: 0 };
    });
  }
};

const addResort = async () => {
  if (!name.value) return;
  const { data, error } = await client
    .from("resorts")
    .insert({ name: name.value, description: description.value })
    .select()
    .single();

  if (!error && data) {
    resorts.value.push(data);
    newRooms.value[data.id] = { number: "", typeName: "", price: 0 };
  }
  name.value = "";
  description.value = "";
};

// Update room
const updateRoom = async (
  roomId: string,
  roomTypeId: string,
  newNumber: string,
  newName: string,
  newPrice: number
) => {
  // Update room number
  const { error: roomError } = await client
    .from("rooms")
    .update({ number: newNumber })
    .eq("id", roomId);

  if (roomError) {
    console.error(roomError);
    return;
  }

  // Update room type
  const { error: typeError } = await client
    .from("room_types")
    .update({ name: newName, price: newPrice })
    .eq("id", roomTypeId);

  if (typeError) {
    console.error(typeError);
    return;
  }

  editingRoomId.value = null;
  await loadResorts();
};

// Add new room to resort
const addRoom = async (resortId: string) => {
  const payload = newRooms.value[resortId];
  if (!payload.number || !payload.typeName || !payload.price) return;

  // Create room type first
  const { data: type, error: typeError } = await client
    .from("room_types")
    .insert({ name: payload.typeName, price: payload.price })
    .select()
    .single();

  if (typeError) {
    console.error(typeError);
    return;
  }

  // Then create room linked to resort + type
  const { error: roomError } = await client.from("rooms").insert({
    number: payload.number,
    resort_id: resortId,
    room_type_id: type.id,
  });

  if (roomError) {
    console.error(roomError);
    return;
  }

  newRooms.value[resortId] = { number: "", typeName: "", price: 0 };
  await loadResorts();
};
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">🏝 Manage Resorts</h1>

    <!-- Add Resort Form -->
    <form @submit.prevent="addResort" class="mb-4 space-x-2">
      <input
        v-model="name"
        placeholder="Resort name"
        class="border px-2 py-1"
      />
      <input
        v-model="description"
        placeholder="Description"
        class="border px-2 py-1"
      />
      <button class="bg-blue-500 text-white px-3 py-1 rounded">
        Add Resort
      </button>
    </form>

    <!-- Resorts List -->
    <ul class="divide-y border rounded">
      <li v-for="r in resorts" :key="r.id" class="p-3">
        <strong>{{ r.name }}</strong>
        <br />
        <small class="text-gray-600">{{ r.description }}</small>

        <!-- Rooms -->
        <div v-if="r.rooms?.length" class="mt-3 pl-4">
          <h3 class="font-semibold">Rooms</h3>
          <div
            v-for="room in r.rooms"
            :key="room.id"
            class="mt-2 p-2 border rounded"
          >
            <!-- View Mode -->
            <div v-if="editingRoomId !== room.id">
              <p>
                Room:
                <strong>{{ room.number }}</strong>
              </p>
              <p>
                Type: {{ room.room_types.name }} (₱{{ room.room_types.price }})
              </p>
              <button
                class="bg-yellow-500 text-white px-3 py-1 rounded mt-2"
                @click="editingRoomId = room.id"
              >
                ✏️ Edit
              </button>
            </div>

            <!-- Edit Mode -->
            <div v-else>
              <label class="block mb-1">Room Number</label>
              <input
                v-model="room.number"
                class="border px-2 py-1 w-full mb-2"
              />

              <label class="block mb-1">Room Type Name</label>
              <input
                v-model="room.room_types.name"
                class="border px-2 py-1 w-full mb-2"
              />

              <label class="block mb-1">Price</label>
              <input
                type="number"
                v-model="room.room_types.price"
                class="border px-2 py-1 w-full mb-2"
              />

              <button
                class="bg-green-500 text-white px-3 py-1 rounded mr-2"
                @click="
                  updateRoom(
                    room.id,
                    room.room_types.id,
                    room.number,
                    room.room_types.name,
                    room.room_types.price
                  )
                "
              >
                💾 Save
              </button>
              <button
                class="bg-gray-500 text-white px-3 py-1 rounded"
                @click="editingRoomId = null"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- Add Room Form -->
        <div class="mt-3 pl-4">
          <h4 class="font-semibold">➕ Add Room</h4>
          <input
            v-model="newRooms[r.id].number"
            placeholder="Room number"
            class="border px-2 py-1 mb-2 w-full"
          />
          <input
            v-model="newRooms[r.id].typeName"
            placeholder="Room type name"
            class="border px-2 py-1 mb-2 w-full"
          />
          <input
            type="number"
            v-model="newRooms[r.id].price"
            placeholder="Price"
            class="border px-2 py-1 mb-2 w-full"
          />
          <button
            class="bg-blue-600 text-white px-3 py-1 rounded"
            @click="addRoom(r.id)"
          >
            Add Room
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
