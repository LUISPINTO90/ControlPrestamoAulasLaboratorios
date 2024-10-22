// src/lib/actions/booking/getAvailableHours.ts
"use server";

import { db } from "@/lib/db";

export async function getAvailableHours(date: string, spaceId: string) {
  try {
    // Get all bookings for the selected date and space
    const bookings = await db.booking.findMany({
      where: {
        spaceId: parseInt(spaceId),
        date: new Date(date),
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    // Generate all possible hours (7:00 - 22:00)
    const allHours = Array.from({ length: 16 }, (_, i) => {
      const hour = i + 7;
      return `${hour.toString().padStart(2, "0")}:00`;
    });

    // Create time blocks for existing bookings
    const bookedTimeBlocks = bookings.map((booking) => ({
      start: booking.startTime.getHours(),
      end: booking.endTime.getHours(),
    }));

    // Filter out hours that fall within any booking time block
    const availableHours = allHours.filter((hour) => {
      const currentHour = parseInt(hour.split(":")[0]);

      // Check if this hour is not within any booked time block
      return !bookedTimeBlocks.some(
        (block) => currentHour >= block.start && currentHour < block.end
      );
    });

    return { availableHours };
  } catch (error) {
    console.error("Error getting available hours:", error);
    return { error: "Error al obtener horas disponibles" };
  }
}
