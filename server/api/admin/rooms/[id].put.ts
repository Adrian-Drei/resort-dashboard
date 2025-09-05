export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const id = Number(event.context.params?.id);
  const body = await readBody(event);
  const { name, price, image } = body ?? {};

  if (!id)
    throw createError({ statusCode: 400, statusMessage: "Invalid room id" });

  return prisma.room.update({
    where: { id },
    data: { name, price: price ? Number(price) : undefined, image },
  });
});
