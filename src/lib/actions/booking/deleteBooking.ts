// src/lib/actions/booking/deleteBooking.ts
"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function deleteBooking(bookingId: number): Promise<void> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Usuario no autenticado");
    }

    const userId = parseInt(session.user.id);

    // Verify the booking exists and belongs to the user
    const booking = await db.booking.findFirst({
      where: {
        id: bookingId,
        userId: userId,
      },
    });

    if (!booking) {
      throw new Error(
        "No se encontró la reserva o no tienes permiso para eliminarla"
      );
    }

    // Delete associated booking history first
    await db.bookingHistory.deleteMany({
      where: {
        bookingId: bookingId,
      },
    });

    // Delete the booking
    await db.booking.delete({
      where: {
        id: bookingId,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error al eliminar la reserva");
  }
}
