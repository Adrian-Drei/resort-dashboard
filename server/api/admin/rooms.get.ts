export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const query = getQuery(event);
  const resortId = query?.resortId ? Number(query.resortId) : undefined;

  return prisma.room.findMany({
    where: resortId ? { resortId } : undefined,
    include: { resort: true },
    orderBy: { id: "desc" },
  });
});
