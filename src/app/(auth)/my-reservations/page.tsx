import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserBookings } from "@/lib/actions/booking/getUserBookings";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function MyReservationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const bookings = await getUserBookings(parseInt(session.user.id));

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <p className="text-blue-500 text-sm uppercase">Mis reservas</p>
        <h1 className="text-4xl font-bold tracking-tight leading-none mb-4">
          Mis Reservaciones
        </h1>

        <div className="grid gap-4">
          {bookings.length === 0 ? (
            <p className="text-gray-500">No tienes reservaciones activas.</p>
          ) : (
            bookings.map((booking) => {
              // Ajustar la fecha aquí
              const adjustedDate = new Date(booking.date);
              adjustedDate.setHours(
                adjustedDate.getHours() + adjustedDate.getTimezoneOffset() / 60
              );

              return (
                <Card key={booking.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{booking.space.name}</h3>
                      <p className="text-sm text-gray-500">
                        {format(adjustedDate, "EEEE d 'de' MMMM, yyyy", {
                          locale: es,
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(booking.startTime, "HH:mm")} -{" "}
                        {format(booking.endTime, "HH:mm")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/spaces/${booking.spaceId}?date=${format(
                          adjustedDate,
                          "yyyy-MM-dd"
                        )}`}
                      >
                        <Button variant="outline" size="sm">
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
