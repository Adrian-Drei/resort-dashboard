export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const body = await readBody(event);
  const { name, location } = body ?? {};

  if (!name)
    throw createError({
      statusCode: 400,
      statusMessage: "Resort name required",
    });

  return prisma.resort.create({
    data: { name, location: location ?? "" },
  });
});
