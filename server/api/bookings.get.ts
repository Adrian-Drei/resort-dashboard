export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  return prisma.booking.findMany({
    include: { room: true },
    orderBy: { startDate: "desc" },
  });
});
