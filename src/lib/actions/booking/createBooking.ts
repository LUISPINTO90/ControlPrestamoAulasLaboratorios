// src/lib/actions/booking/createBooking.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// lib/actions/booking/createBooking.ts
export async function createBooking(formData: FormData): Promise<void> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Usuario no autenticado");
    }

    const userId = parseInt(session.user.id);
    const spaceId = parseInt(formData.get("spaceId") as string);
    const dateStr = formData.get("date") as string;

    // Aseguramos que la fecha se crea correctamente
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0);

    // Creamos las fechas de inicio y fin con la hora correcta
    const startTime = new Date(
      year,
      month - 1,
      day,
      parseInt(formData.get("startTime") as string),
      0,
      0
    );
    const endTime = new Date(
      year,
      month - 1,
      day,
      parseInt(formData.get("endTime") as string),
      0,
      0
    );

    // Validaciones básicas
    if (!spaceId || !date || !startTime || !endTime) {
      throw new Error("Todos los campos son requeridos");
    }

    if (startTime >= endTime) {
      throw new Error("La hora de inicio debe ser anterior a la hora de fin");
    }

    // Verificar si hay traslapes para el espacio seleccionado
    const overlappingBooking = await db.booking.findFirst({
      where: {
        spaceId,
        date,
        AND: [
          {
            OR: [
              {
                AND: [
                  { startTime: { lte: startTime } },
                  { endTime: { gt: startTime } },
                ],
              },
              {
                AND: [
                  { startTime: { lt: endTime } },
                  { endTime: { gte: endTime } },
                ],
              },
              {
                AND: [
                  { startTime: { gte: startTime } },
                  { endTime: { lte: endTime } },
                ],
              },
            ],
          },
        ],
      },
    });

    if (overlappingBooking) {
      throw new Error(
        "El horario seleccionado se traslapa con una reserva existente"
      );
    }

    // Crear la reservación
    const booking = await db.booking.create({
      data: {
        userId,
        spaceId,
        date,
        startTime,
        endTime,
      },
    });

    // Crear el historial
    await db.bookingHistory.create({
      data: {
        bookingId: booking.id,
        status: "Reserved",
        changeDate: new Date(),
      },
    });

    revalidatePath("/home");
    redirect("/home");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error al crear la reservación");
  }
}
