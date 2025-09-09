<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const client = useSupabaseClient();
const roomTypes = ref<any[]>([]);
const name = ref("");
const price = ref<number | null>(null);

onMounted(async () => {
  const { data } = await client.from("room_types").select("id, name, price");
  roomTypes.value = data || [];
});

const addRoomType = async () => {
  if (!name.value || !price.value) return;
  const { data, error } = await client
    .from("room_types")
    .insert({ name: name.value, price: price.value })
    .select()
    .single();

  if (!error && data) {
    roomTypes.value.push(data);
    name.value = "";
    price.value = null;
  }
};

const removeRoomType = async (id: string) => {
  roomTypes.value = roomTypes.value.filter((t) => t.id !== id);
  await client.from("room_types").delete().eq("id", id);
};
</script>

<template>
  <div>
    <h1 class="text-xl font-bold mb-4">Manage Room Types</h1>
    <ul>
      <li v-for="t in roomTypes" :key="t.id" class="flex gap-2 items-center">
        {{ t.name }} - ₱{{ t.price }}
        <button @click="removeRoomType(t.id)" class="text-red-500">x</button>
      </li>
    </ul>

    <div class="mt-4 flex gap-2">
      <input
        v-model="name"
        type="text"
        placeholder="Type name"
        class="border px-2 py-1"
      />
      <input
        v-model="price"
        type="number"
        placeholder="Price"
        class="border px-2 py-1 w-28"
      />
      <button
        @click="addRoomType"
        class="bg-green-500 text-white px-3 py-1 rounded"
      >
        Add
      </button>
    </div>
  </div>
</template>
