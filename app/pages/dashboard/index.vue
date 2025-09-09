<script setup lang="ts">
import DashboardSidebar from "~/components/DashboardSidebar.vue";

definePageMeta({ layout: "default" });

const client = useSupabaseClient();
const bookings = ref<any[]>([]);
const resorts = ref<any[]>([]);

// Dropdown selection for chart granularity
const chartPeriod = ref<"daily" | "weekly" | "monthly">("monthly");

// Fetch bookings and resorts
onMounted(async () => {
  const { data: bookingData } = await client
    .from("bookings")
    .select(
      `
      id,
      start_date,
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
    .order("start_date", { ascending: true });

  bookings.value = bookingData || [];

  const { data: resortData } = await client.from("resorts").select("*");
  resorts.value = resortData || [];
});

const totalBookings = computed(() => bookings.value.length);
const totalResorts = computed(() => resorts.value.length);

// --- Transform bookings based on selected period ---
const chartData = computed(() => {
  const data: Record<string, number> = {};

  if (chartPeriod.value === "monthly") {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    monthNames.forEach((m) => (data[m] = 0));

    bookings.value.forEach((b) => {
      const d = new Date(b.start_date);
      if (!isNaN(d.getTime())) {
        const month = d.toLocaleString("default", { month: "short" });
        data[month] = (data[month] || 0) + 1;
      }
    });

    return monthNames.map((m) => ({ month: m, bookings: data[m] }));
  }

  if (chartPeriod.value === "weekly") {
    bookings.value.forEach((b) => {
      const d = new Date(b.start_date);
      if (!isNaN(d.getTime())) {
        const week = `Week ${Math.ceil(d.getDate() / 7)}`;
        data[week] = (data[week] || 0) + 1;
      }
    });

    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
    return weeks.map((w) => ({ month: w, bookings: data[w] || 0 }));
  }

  // Daily: show day of month
  if (chartPeriod.value === "daily") {
    bookings.value.forEach((b) => {
      const d = new Date(b.start_date);
      if (!isNaN(d.getTime())) {
        const day = `${d.getDate()}`;
        data[day] = (data[day] || 0) + 1;
      }
    });

    const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
    return days.map((day) => ({ month: day, bookings: data[day] || 0 }));
  }

  return [];
});

const categories = { bookings: { name: "Bookings", color: "#3b82f6" } };
const xFormatter = (i: number) => chartData.value[i]?.month || "";
</script>

<template>
  <div class="flex w-full">
    <DashboardSidebar />
    <div class="flex-1 p-6">
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
      <ul class="divide-y border rounded mb-6">
        <li v-for="b in bookings.slice(-5)" :key="b.id" class="p-3 text-sm">
          {{ b.full_name }} booked
          <strong>{{ b.room?.room_type?.name }}</strong>
          at
          <em>{{ b.room?.resort?.name }}</em>
          ({{ b.start_date }} → {{ b.end_date }})
        </li>
      </ul>

      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Bookings Chart</h2>
        <select
          v-model="chartPeriod"
          class="px-3 py-1 border rounded shadow-sm focus:ring focus:ring-blue-300 bg-white text-gray-800"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div class="bg-white p-4 shadow rounded">
        <LineChart
          :data="chartData"
          :categories="categories"
          :height="300"
          :width="800"
          :x-formatter="xFormatter"
          x-label="Period"
          y-label="Bookings"
        />
      </div>
    </div>
  </div>
</template>
