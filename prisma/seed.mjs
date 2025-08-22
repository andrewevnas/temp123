// prisma/seed.mjs
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Services
  const bridal = await prisma.service.upsert({
    where: { slug: "bridal-makeup" },
    update: {},
    create: {
      name: "Bridal Makeup (with Trial)",
      slug: "bridal-makeup",
      durationMin: 90,
      basePricePence: 0, // you can fill real prices later
      depositPence: 2500, // £25 deposit example
      description: "Long-wear, camera-ready finish. Includes trial.",
    },
  });
  const party = await prisma.service.upsert({
    where: { slug: "bridal-party" },
    update: {},
    create: {
      name: "Bridal Party (per person)",
      slug: "bridal-party",
      durationMin: 55,
      basePricePence: 0,
      depositPence: 2000,
      description: "Bridesmaids / Mums. Lashes optional.",
    },
  });
  await prisma.service.upsert({
    where: { slug: "formal-occasion" },
    update: {},
    create: {
      name: "Formal / Occasion",
      slug: "formal-occasion",
      durationMin: 60,
      basePricePence: 0,
      depositPence: 2000,
      description: "Soft glam to statement looks for events.",
    },
  });
  await prisma.service.upsert({
    where: { slug: "lesson-1-1" },
    update: {},
    create: {
      name: "1:1 Makeup Lesson",
      slug: "lesson-1-1",
      durationMin: 90,
      basePricePence: 0,
      depositPence: 3000,
      description: "Tailored techniques and product guidance.",
    },
  });

  // Weekly availability (Mon off; Tue–Sun sample)
  const rules = [
    { weekday: 2, startTime: "10:00", endTime: "17:00" }, // Tue
    { weekday: 3, startTime: "10:00", endTime: "17:00" }, // Wed
    { weekday: 4, startTime: "10:00", endTime: "18:00" }, // Thu
    { weekday: 5, startTime: "09:00", endTime: "18:00" }, // Fri
    { weekday: 6, startTime: "09:00", endTime: "16:00" }, // Sat
    { weekday: 0, startTime: "10:00", endTime: "15:00" }, // Sun
  ];
  for (const r of rules) {
    await prisma.availabilityRule.upsert({
      where: {
        // name is the concatenation of the unique fields
        weekday_startTime_endTime: {
          weekday: r.weekday,
          startTime: r.startTime,
          endTime: r.endTime,
        },
      },
      update: {},
      create: { ...r },
    });
  }

  console.log("Seeded services + availability.");
}

main().finally(async () => {
  await prisma.$disconnect();
});
