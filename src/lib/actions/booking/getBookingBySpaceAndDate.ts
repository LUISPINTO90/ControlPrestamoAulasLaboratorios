// src/lib/actions/booking/getBookingsBySpaceAndDate.ts
"use server";

import { db } from "@/lib/db";

export async function getBookingsBySpaceAndDate(spaceId: string, date: string) {
  try {
    const [year, month, day] = date.split("-").map(Number);
    const queryDate = new Date(year, month - 1, day, 12, 0, 0);

    const bookings = await db.booking.findMany({
      where: {
        spaceId: parseInt(spaceId),
        date: queryDate,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });
    return bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}
