<script setup lang="ts">
import BookingChart from "~/components/BookingChart.vue";

const { data: overview } = await useFetch("/api/admin/overview");
const bookingsLabels = computed(
  () =>
    overview.value?.bookingsLast30?.map((b) =>
      new Date(b.date).toLocaleDateString()
    ) ?? []
);
const bookingsData = computed(
  () => overview.value?.bookingsLast30?.map((b) => b.count) ?? []
);

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import AdminSidebar from "~/components/AdminSidebar.vue";

// Register
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const chartData = ref({
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      label: "Data One",
      backgroundColor: "#f87979",
      data: [40, 20, 12, 50, 10],
    },
  ],
});
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Main Content -->
    <main class="flex-1 p-6">
      <h1 class="text-3xl font-bold mb-6">Admin Overview</h1>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="bg-white p-5 rounded-xl shadow">
          <h2 class="font-semibold mb-3">Bookings Last 30 Days</h2>
          <BookingChart />
        </div>
        <div class="bg-white p-5 rounded-xl shadow">
          <p class="text-sm text-gray-500">Resorts</p>
          <p class="text-2xl font-semibold">
            {{ (overview as any)?.totalResorts ?? 0 }}
          </p>
        </div>
        <div class="bg-white p-5 rounded-xl shadow">
          <p class="text-sm text-gray-500">Rooms</p>
          <p class="text-2xl font-semibold">
            {{ (overview as any)?.totalRooms ?? 0 }}
          </p>
        </div>
        <div class="bg-white p-5 rounded-xl shadow">
          <p class="text-sm text-gray-500">Total Bookings</p>
          <p class="text-2xl font-semibold">
            {{ (overview as any)?.totalBookings ?? 0 }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-5 rounded-xl shadow">
          <h2 class="font-semibold mb-3">Upcoming bookings</h2>
          <ul class="space-y-3">
            <li
              v-for="b in (overview as any)?.upcomingBookings"
              :key="b.id"
              class="flex justify-between items-start"
            >
              <div>
                <div class="font-medium">{{ b.guestName }}</div>
                <div class="text-sm text-gray-500">
                  {{ b.room?.name }} • {{ b.room?.resort?.name }}
                </div>
              </div>
              <div class="text-sm text-gray-600">
                {{ new Date(b.startDate).toLocaleDateString() }} →
                {{ new Date(b.endDate).toLocaleDateString() }}
              </div>
            </li>
            <li
              v-if="!(overview as any)?.upcomingBookings?.length"
              class="text-sm text-gray-500"
            >
              No upcoming bookings
            </li>
          </ul>
        </div>

        <div class="bg-white p-5 rounded-xl shadow">
          <h2 class="font-semibold mb-3">Next 30 days</h2>
          <p class="text-4xl font-bold">
            {{ (overview as any)?.bookingsNext30 ?? 0 }}
          </p>
          <p class="text-sm text-gray-500 mt-2">
            Bookings that intersect the next 30 days
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
