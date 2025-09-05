export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const id = Number(event.context.params?.id);

  if (!id)
    throw createError({ statusCode: 400, statusMessage: "Invalid room id" });

  await prisma.booking.deleteMany({ where: { roomId: id } });
  return prisma.room.delete({ where: { id } });
});
