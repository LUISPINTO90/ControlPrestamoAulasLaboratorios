"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { transporter } from "@/lib/nodemailer";

export async function createBooking(formData: FormData): Promise<void> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Usuario no autenticado");
    }

    const userId = parseInt(session.user.id);
    const spaceId = parseInt(formData.get("spaceId") as string);
    const dateStr = formData.get("date") as string;
    const startHour = parseInt(formData.get("startTime") as string);
    const endHour = parseInt(formData.get("endTime") as string);

    // Check if user exists
    const userExists = await db.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new Error("Usuario no encontrado");
    }

    // Parse the date in Mexico City timezone
    const mexicoCityTZ = "America/Mexico_City";

    // Create date objects for validation using the local timezone (Mexico City)
    const [year, month, day] = dateStr.split("-").map(Number);

    // Get current time in Mexico City
    const nowInMexico = new Date(
      new Date().toLocaleString("en-US", { timeZone: mexicoCityTZ })
    );

    // Create booking date in Mexico City timezone
    const bookingDate = new Date(
      new Date(year, month - 1, day).toLocaleString("en-US", {
        timeZone: mexicoCityTZ,
      })
    );
    bookingDate.setHours(0, 0, 0, 0);

    // Create today's date in Mexico City timezone
    const todayDate = new Date(nowInMexico);
    todayDate.setHours(0, 0, 0, 0);

    // Create UTC dates for database storage
    const startTime = new Date(Date.UTC(year, month - 1, day, startHour));
    const endTime = new Date(Date.UTC(year, month - 1, day, endHour));
    const date = new Date(Date.UTC(year, month - 1, day, 12)); // noon UTC for consistent date handling

    // Validations
    if (!spaceId || !date || !startTime || !endTime) {
      throw new Error("Todos los campos son requeridos");
    }

    if (startTime >= endTime) {
      throw new Error("La hora de inicio debe ser anterior a la hora de fin");
    }

    // Enhanced past booking validation
    const currentHourInMexico = nowInMexico.getHours();

    if (bookingDate.getTime() < todayDate.getTime()) {
      // If it's a past date
      throw new Error("No se puede crear una reserva en el pasado");
    } else if (bookingDate.getTime() === todayDate.getTime()) {
      // If it's today, check the hour
      if (startHour <= currentHourInMexico) {
        throw new Error(
          "No se puede crear una reserva en el pasado o en la hora actual"
        );
      }
    }

    // Check for overlapping bookings
    const overlappingBooking = await db.booking.findFirst({
      where: {
        spaceId,
        date,
        AND: [
          {
            OR: [
              {
                startTime: {
                  lte: startTime,
                },
                endTime: {
                  gt: startTime,
                },
              },
              {
                startTime: {
                  lt: endTime,
                },
                endTime: {
                  gte: endTime,
                },
              },
              {
                startTime: {
                  gte: startTime,
                },
                endTime: {
                  lte: endTime,
                },
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

    const booking = await db.booking.create({
      data: {
        userId,
        spaceId,
        date,
        startTime,
        endTime,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        space: {
          select: {
            name: true,
          },
        },
      },
    });

    await db.bookingHistory.create({
      data: {
        bookingId: booking.id,
        status: "Reserved",
        changeDate: new Date(),
      },
    });

    const formatTime = (hour: number): string => {
      return hour.toString().padStart(2, "0") + ":00";
    };

    const formatFullDate = (date: Date) => {
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: mexicoCityTZ,
      };
      return new Intl.DateTimeFormat("es-MX", options).format(date);
    };

    try {
      const localDate = formatFullDate(date);
      const localStartTime = formatTime(startHour);
      const localEndTime = formatTime(endHour);

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: booking.user.email,
        subject: "Confirmación de Reservación",
        html: `
          <h1>¡Tu reservación ha sido confirmada!</h1>
          <p>Hola ${booking.user.email},</p>
          <p>Tu reservación ha sido creada exitosamente con los siguientes detalles:</p>
          <ul style="list-style-type: none; padding-left: 0;">
            <li><strong>Espacio:</strong> ${booking.space.name}</li>
            <li><strong>Fecha:</strong> ${localDate}</li>
            <li><strong>Hora de inicio:</strong> ${localStartTime}</li>
            <li><strong>Hora de fin:</strong> ${localEndTime}</li>
          </ul>
          <p>Si necesitas hacer algún cambio o tienes preguntas, por favor contáctanos.</p>
          <p>¡Gracias por usar nuestro servicio!</p>
        `,
      });

      console.log("Email sent successfully with local time:", {
        date: localDate,
        startTime: localStartTime,
        endTime: localEndTime,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      console.warn("Booking created but email notification failed");
    }
  } catch (error) {
    console.error("Error in createBooking:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error al crear la reservación");
  }
}
