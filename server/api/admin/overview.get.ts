export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const now = new Date();

  // Next 30 days for your existing count
  const next30 = new Date(now);
  next30.setDate(next30.getDate() + 30);

  const totalResorts = await prisma.resort.count();
  const totalRooms = await prisma.room.count();
  const totalBookings = await prisma.booking.count();

  const bookingsNext30 = await prisma.booking.count({
    where: {
      OR: [
        { startDate: { gte: now, lte: next30 } },
        { AND: [{ startDate: { lte: now } }, { endDate: { gte: now } }] },
      ],
    },
  });

  const upcomingBookings = await prisma.booking.findMany({
    where: { startDate: { gte: now } },
    include: { room: { include: { resort: true } } },
    orderBy: { startDate: "asc" },
    take: 6,
  });

  // --- New part: bookings per day for last 30 days ---
  const past30 = new Date(now);
  past30.setDate(past30.getDate() - 29); // last 30 days including today

  const bookingsLast30Raw = await prisma.booking.findMany({
    where: { startDate: { gte: past30, lte: now } },
    select: { startDate: true },
  });

  // Initialize counts for each date
  const counts: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(past30);
    d.setDate(past30.getDate() + i);
    counts[d.toISOString().slice(0, 10)] = 0;
  }

  // Count bookings per start date
  bookingsLast30Raw.forEach((b) => {
    const date = b.startDate.toISOString().slice(0, 10);
    if (counts[date] !== undefined) counts[date]++;
  });

  const bookingsLast30 = Object.entries(counts).map(([date, count]) => ({
    date,
    count,
  }));

  return {
    totalResorts,
    totalRooms,
    totalBookings,
    bookingsNext30,
    upcomingBookings,
    bookingsLast30, // <-- for chart
  };
});
