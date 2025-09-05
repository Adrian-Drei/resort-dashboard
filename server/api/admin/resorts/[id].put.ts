export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const id = Number(event.context.params?.id);
  const body = await readBody(event);
  const { name, location } = body ?? {};

  if (!id)
    throw createError({ statusCode: 400, statusMessage: "Invalid resort id" });

  return prisma.resort.update({
    where: { id },
    data: { name, location },
  });
});
