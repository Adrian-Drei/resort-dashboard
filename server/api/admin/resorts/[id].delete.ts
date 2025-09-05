export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const id = Number(event.context.params?.id);

  if (!id)
    throw createError({ statusCode: 400, statusMessage: "Invalid resort id" });

  // Delete bookings of rooms in this resort
  await prisma.booking.deleteMany({ where: { room: { resortId: id } } });
  // Delete rooms
  await prisma.room.deleteMany({ where: { resortId: id } });
  // Delete resort
  return prisma.resort.delete({ where: { id } });
});
