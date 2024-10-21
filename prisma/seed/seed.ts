import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker/locale/en"; // Changed to English locale
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.bookingHistory.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.space.deleteMany({});

  // Create users
  const users = await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      return await prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          password: await bcrypt.hash("password123", 10),
          userType: faker.helpers.arrayElement([
            "Student",
            "Teacher",
            "Administrator",
          ]),
        },
      });
    })
  );

  // Create spaces
  const spaces = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      return await prisma.space.create({
        data: {
          name:
            faker.helpers.arrayElement([
              "Computer Lab",
              "Chemistry Lab",
              "Main Hall",
              "Conference Room",
              "Regular Classroom",
            ]) +
            " " +
            faker.number.int({ min: 100, max: 999 }),
          spaceType: faker.helpers.arrayElement(["Laboratory", "Classroom"]),
          capacity: faker.number.int({ min: 20, max: 100 }),
          location: `Building ${faker.helpers.arrayElement([
            "A",
            "B",
            "C",
            "D",
          ])}, Floor ${faker.number.int({ min: 1, max: 5 })}`,
        },
      });
    })
  );

  // Create bookings
  const bookings = await Promise.all(
    Array.from({ length: 30 }).map(async () => {
      const baseDate = faker.date.future();
      const startTime = new Date(baseDate);
      startTime.setHours(faker.number.int({ min: 7, max: 18 }), 0, 0);

      const endTime = new Date(startTime);
      endTime.setHours(
        startTime.getHours() + faker.number.int({ min: 1, max: 3 })
      );

      return await prisma.booking.create({
        data: {
          userId: faker.helpers.arrayElement(users).id,
          spaceId: faker.helpers.arrayElement(spaces).id,
          date: baseDate,
          startTime: startTime,
          endTime: endTime,
        },
      });
    })
  );

  // Create booking history
  await Promise.all(
    bookings.map(async (booking) => {
      return await prisma.bookingHistory.create({
        data: {
          bookingId: booking.id,
          status: faker.helpers.arrayElement([
            "Reserved",
            "Cancelled",
            "Completed",
          ]),
          changeDate: faker.date.recent(),
        },
      });
    })
  );

  console.log("Database successfully seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
