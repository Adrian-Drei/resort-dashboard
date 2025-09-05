export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  return prisma.resort.findMany({
    include: { rooms: true },
    orderBy: { name: "asc" },
  });
});
