const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function main() {
  const adminPassword = await hashPassword("admin123");
  await prisma.admin.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { email: "admin@example.com", password: adminPassword },
  });

  const resorts = [
    {
      name: "Sunset Beach Resort",
      location: "Boracay, Philippines",
      rooms: [
        {
          name: "Ocean View Room",
          price: 3500,
          image: "https://source.unsplash.com/600x400/?beach,room",
        },
        {
          name: "Garden Villa",
          price: 2500,
          image: "https://source.unsplash.com/600x400/?villa,resort",
        },
      ],
    },
    {
      name: "Mountain View Retreat",
      location: "Baguio, Philippines",
      rooms: [
        {
          name: "Hilltop Suite",
          price: 4000,
          image: "https://source.unsplash.com/600x400/?mountain,room",
        },
        {
          name: "Cozy Cabin",
          price: 2200,
          image: "https://source.unsplash.com/600x400/?cabin,mountain",
        },
      ],
    },
  ];

  for (const r of resorts) {
    await prisma.resort.create({
      data: {
        name: r.name,
        location: r.location,
        rooms: { create: r.rooms },
      },
    });
  }

  console.log("✅ Database seeded!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
