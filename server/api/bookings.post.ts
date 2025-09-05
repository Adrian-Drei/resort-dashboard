export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const body = await readBody(event);
  const { guestName, startDate, endDate, roomId } = body ?? {};

  if (!guestName || !startDate || !endDate || !roomId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }

  // check for overlap
  const conflicts = await prisma.booking.findFirst({
    where: {
      roomId,
      OR: [
        {
          startDate: { lte: new Date(endDate) },
          endDate: { gte: new Date(startDate) },
        },
      ],
    },
  });

  if (conflicts) {
    throw createError({
      statusCode: 400,
      statusMessage: "Room already booked on selected dates",
    });
  }

  return prisma.booking.create({
    data: {
      guestName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      roomId: Number(roomId),
    },
  });
});
