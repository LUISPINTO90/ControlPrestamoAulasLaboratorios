// page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserBookings } from "@/lib/actions/booking/getUserBookings";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export default async function MyReservationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const bookings = await getUserBookings(parseInt(session.user.id));

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <p className="text-blue-600 text-sm uppercase">Mis reservas</p>
        <h1 className="text-4xl font-bold tracking-tight leading-none mb-4">
          Mis Reservaciones
        </h1>

        <div className="grid gap-4">
          {bookings.length === 0 ? (
            <p className="text-gray-500">No tienes reservaciones activas.</p>
          ) : (
            bookings.map((booking) => {
              // Usar parseISO y ajustar a la zona horaria local
              const bookingDate = parseISO(booking.date);

              return (
                <Card key={booking.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{booking.space.name}</h3>
                      <p className="text-sm text-gray-500">
                        {format(bookingDate, "EEEE d 'de' MMMM, yyyy", {
                          locale: es,
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/spaces/${booking.spaceId}?date=${booking.date}`}
                      >
                        <Button variant="default" size="sm" className="rounded">
                          Ver espacio
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
