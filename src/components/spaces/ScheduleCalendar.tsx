//src\components\spaces\ScheduleCalendar.tsx
// ScheduleCalendar.tsx
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

interface Booking {
  id: number;
  startTime: Date;
  endTime: Date;
  user: {
    firstName: string;
    lastName: string;
  };
}

interface ScheduleCalendarProps {
  bookings: Booking[];
  selectedDate: string;
}

export function ScheduleCalendar({
  bookings,
  selectedDate,
}: ScheduleCalendarProps) {
  // Creamos pares de horas (inicio-fin)
  const hourRanges = Array.from({ length: 15 }, (_, i) => ({
    start: i + 7,
    end: i + 8,
  }));

  // Ajustamos la fecha para que use la zona horaria local
  const displayDate = (() => {
    const [year, month, day] = selectedDate.split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0);
  })();

  const isTimeRangeBooked = (startHour: number, endHour: number) => {
    return bookings.some((booking) => {
      const bookingStart = new Date(booking.startTime).getHours();
      const bookingEnd = new Date(booking.endTime).getHours();
      return (
        (startHour >= bookingStart && startHour < bookingEnd) ||
        (endHour > bookingStart && endHour <= bookingEnd)
      );
    });
  };

  const getBookingForTimeRange = (startHour: number, endHour: number) => {
    return bookings.find((booking) => {
      const bookingStart = new Date(booking.startTime).getHours();
      const bookingEnd = new Date(booking.endTime).getHours();
      return (
        (startHour >= bookingStart && startHour < bookingEnd) ||
        (endHour > bookingStart && endHour <= bookingEnd)
      );
    });
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {hourRanges.map(({ start, end }) => {
            const booking = getBookingForTimeRange(start, end);
            const isBooked = isTimeRangeBooked(start, end);

            return (
              <TableRow key={start}>
                <TableCell>
                  {`${start.toString().padStart(2, "0")}:00 - ${end
                    .toString()
                    .padStart(2, "0")}:00`}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isBooked
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {isBooked ? "Ocupado" : "Disponible"}
                  </span>
                </TableCell>
                <TableCell>
                  {booking
                    ? `${booking.user.firstName} ${booking.user.lastName}`
                    : "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
