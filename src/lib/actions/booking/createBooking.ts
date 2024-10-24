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

    // Create date objects for the selected date
    const [year, month, day] = dateStr.split("-").map(Number);

    // Create local dates for validation
    const bookingDate = new Date(year, month - 1, day);
    bookingDate.setHours(0, 0, 0, 0);

    const now = new Date();
    const todayDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    todayDate.setHours(0, 0, 0, 0);

    // Create UTC dates for database
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

    // Check if booking is in the past
    if (bookingDate.getTime() < todayDate.getTime()) {
      // Si es un día anterior
      throw new Error("No se puede crear una reserva en el pasado");
    } else if (bookingDate.getTime() === todayDate.getTime()) {
      // Si es hoy, verificar la hora
      const currentHour = now.getHours();
      if (startHour <= currentHour) {
        throw new Error("No se puede crear una reserva en el pasado");
      }
    }
    // Si es un día futuro, permitir cualquier hora

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

    // Función modificada para formatear la hora correctamente
    const formatTime = (hour: number): string => {
      // Aseguramos que la hora esté en formato 24 horas con dos dígitos
      return hour.toString().padStart(2, "0") + ":00";
    };

    // Función para formatear la fecha completa
    const formatFullDate = (date: Date) => {
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "America/Mexico_City",
      };
      return new Intl.DateTimeFormat("es-MX", options).format(date);
    };

    try {
      // Usar directamente las horas originales del formulario
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
