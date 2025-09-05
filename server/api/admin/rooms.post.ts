export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const body = await readBody(event);
  const { name, price, resortId, image } = body ?? {};

  if (!name || !price || !resortId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }

  return prisma.room.create({
    data: {
      name,
      price: Number(price),
      image: image ?? null,
      resortId: Number(resortId),
    },
  });
});
