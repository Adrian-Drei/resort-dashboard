<script setup lang="ts">
import { ref, watch, computed } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Line } from "vue-chartjs";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

// Fetch overview data
const { data: overview } = await useFetch("/api/admin/overview");

// Interval state
const interval = ref<"daily" | "weekly" | "monthly">("daily");

// Helpers to generate past dates/weeks/months
function getLastNDates(n: number) {
  const dates: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function getLastNWeeks(n: number) {
  const weeks: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i * 7);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay()); // Sunday
    weeks.push(weekStart.toISOString().slice(0, 10));
  }
  return weeks;
}

function getLastNMonths(n: number) {
  const months: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    );
  }
  return months;
}

// Processed chart data based on interval
const processedData = computed(() => {
  if (!overview.value?.bookingsLast30) return [];

  const bookings = overview.value.bookingsLast30;

  if (interval.value === "daily") {
    const labels = getLastNDates(30);
    return labels.map((date) => ({
      date,
      count: bookings.find((b) => b.date === date)?.count ?? 0,
    }));
  }

  if (interval.value === "weekly") {
    const labels = getLastNWeeks(12);
    return labels.map((weekStart) => {
      const count = bookings
        .filter((b) => {
          const d = new Date(b.date);
          const start = new Date(weekStart);
          const end = new Date(start);
          end.setDate(start.getDate() + 6);
          return d >= start && d <= end;
        })
        .reduce((sum, b) => sum + b.count, 0);
      return { date: weekStart, count };
    });
  }

  if (interval.value === "monthly") {
    const labels = getLastNMonths(12);
    return labels.map((month) => {
      const count = bookings
        .filter((b) => b.date.startsWith(month))
        .reduce((sum, b) => sum + b.count, 0);
      return { date: month, count };
    });
  }

  return [];
});

// Chart data & options
const chartData = ref({
  labels: processedData.value.map((b) => b.date),
  datasets: [
    {
      label: "Bookings",
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      borderColor: "#3b82f6",
      data: processedData.value.map((b) => b.count),
      fill: true,
      tension: 0.4,
      pointRadius: 4,
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: "top" },
    title: { display: true, text: "Bookings" },
  },
});

// Update chart when overview or interval changes
watch([overview, interval], () => {
  chartData.value = {
    labels: processedData.value.map((b) => b.date),
    datasets: [
      {
        label: "Bookings",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "#3b82f6",
        data: processedData.value.map((b) => b.count),
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };
});
</script>

<template>
  <div class="h-96 mb-20">
    <div class="mb-4">
      <label class="mr-2 font-medium">Interval:</label>
      <select v-model="interval" class="border rounded p-1">
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
    </div>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
