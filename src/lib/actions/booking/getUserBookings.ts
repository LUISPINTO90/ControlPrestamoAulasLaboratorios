// src/lib/actions/booking/getUserBookings.ts
"use server";

import { db } from "@/lib/db";

export async function getUserBookings(userId: number) {
  try {
    return await db.booking.findMany({
      where: {
        userId: userId,
        date: {
          gte: new Date(),
        },
      },
      include: {
        space: {
          select: {
            name: true,
            location: true,
          },
        },
      },
      orderBy: [
        {
          date: "asc",
        },
        {
          startTime: "asc",
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }
}
