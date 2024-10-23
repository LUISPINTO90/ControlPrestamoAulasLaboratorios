// getUserBookings.ts
"use server";

import { db } from "@/lib/db";
import { startOfDay } from "date-fns";

export async function getUserBookings(userId: number) {
  try {
    const bookings = await db.booking.findMany({
      where: {
        userId: userId,
        date: {
          gte: startOfDay(new Date()),
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

    return bookings.map((booking) => {
      const startTime = new Date(booking.startTime);
      const endTime = new Date(booking.endTime);

      // Convertir la fecha a string YYYY-MM-DD sin ajustes
      const bookingDate = new Date(booking.date);
      const dateStr = bookingDate.toISOString().split("T")[0];

      return {
        ...booking,
        date: dateStr,
        startTime: `${startTime
          .getUTCHours()
          .toString()
          .padStart(2, "0")}:${startTime
          .getUTCMinutes()
          .toString()
          .padStart(2, "0")}`,
        endTime: `${endTime.getUTCHours().toString().padStart(2, "0")}:${endTime
          .getUTCMinutes()
          .toString()
          .padStart(2, "0")}`,
      };
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }
}
