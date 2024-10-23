// src/components/spaces/ScheduleCalendar.tsx
"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteBooking } from "@/lib/actions/booking/deleteBooking";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Booking {
  id: number;
  startTime: Date;
  endTime: Date;
  userId: number;
  user: {
    firstName: string;
    lastName: string;
  };
}

interface ScheduleCalendarProps {
  bookings: Booking[];
  selectedDate: string;
  currentUserId: number;
}

export function ScheduleCalendar({
  bookings,
  selectedDate,
  currentUserId,
}: ScheduleCalendarProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<number | null>(null);

  const hourRanges = Array.from({ length: 15 }, (_, i) => ({
    start: i + 7,
    end: i + 8,
  }));

  const displayDate = (() => {
    const [year, month, day] = selectedDate.split("-").map(Number);
    return new Date(year, month - 1, day);
  })();

  const isTimeSlotPast = (date: Date, hour: number) => {
    const now = new Date();
    const timeSlot = new Date(date);
    timeSlot.setHours(hour, 0, 0, 0);
    return timeSlot < now;
  };

  // Función actualizada para obtener las horas UTC correctamente
  const getUTCHours = (date: Date): number => {
    return date.getUTCHours();
  };

  const getBookingForTimeRange = (startHour: number, endHour: number) => {
    return bookings.find((booking) => {
      const bookingStart = getUTCHours(new Date(booking.startTime));
      const bookingEnd = getUTCHours(new Date(booking.endTime));

      return (
        (startHour === bookingStart && endHour === bookingEnd) ||
        (startHour >= bookingStart && startHour < bookingEnd) ||
        (endHour > bookingStart && endHour <= bookingEnd) ||
        (startHour <= bookingStart && endHour >= bookingEnd)
      );
    });
  };

  const handleDeleteBooking = async (bookingId: number) => {
    try {
      setLoading(bookingId);
      await deleteBooking(bookingId);
      toast({
        title: "Reserva eliminada",
        description: "La reserva se ha eliminado exitosamente",
      });
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al eliminar la reserva",
      });
    } finally {
      setLoading(null);
    }
  };

  // Función para formatear la hora para mostrar
  const formatTimeDisplay = (hour: number): string => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Horario del {format(displayDate, "d 'de' MMMM, yyyy", { locale: es })}
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Horario</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Reservado por</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hourRanges.map(({ start, end }) => {
            const booking = getBookingForTimeRange(start, end);
            const isBooked = Boolean(booking);
            const canDelete = booking?.userId === currentUserId;

            return (
              <TableRow key={start}>
                <TableCell>
                  {`${formatTimeDisplay(start)} - ${formatTimeDisplay(end)}`}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isBooked
                        ? isTimeSlotPast(displayDate, end)
                          ? "bg-blue-500 text-white"
                          : "bg-red-500 text-white"
                        : isTimeSlotPast(displayDate, start)
                        ? "bg-gray-300 text-gray-800"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {isBooked
                      ? isTimeSlotPast(displayDate, end)
                        ? "Completada"
                        : "Ocupado"
                      : isTimeSlotPast(displayDate, start)
                      ? "Finalizado"
                      : "Disponible"}
                  </span>
                </TableCell>
                <TableCell>
                  {booking
                    ? `${booking.user.firstName} ${booking.user.lastName}`
                    : "-"}
                </TableCell>
                <TableCell>
                  {canDelete && booking && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteBooking(booking.id)}
                      disabled={loading === booking.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
