// src/app/(auth)/spaces/[id]/page.tsx
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/spaces/DatePicker";
import { BookingForm } from "@/components/spaces/BookingForm";
import { ScheduleCalendar } from "@/components/spaces/ScheduleCalendar";
import { getSpaceById } from "@/lib/actions/spaces/getSpaceById";
import { getBookingsBySpaceAndDate } from "@/lib/actions/booking/getBookingBySpaceAndDate";

interface PageProps {
  params: {
    id: string;
  };
  searchParams: {
    date?: string;
  };
}

export default async function SpacePage({ params, searchParams }: PageProps) {
  const space = await getSpaceById(params.id);
  const selectedDate =
    searchParams.date || new Date().toISOString().split("T")[0];
  const bookings = await getBookingsBySpaceAndDate(params.id, selectedDate);

  if (!space) return <div>Espacio no encontrado</div>;

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <p className="text-gray-500 text-sm uppercase">Detalles del espacio</p>
        <h1 className="text-4xl font-bold tracking-tight leading-none mb-2">
          {space.name}
        </h1>
        <div className="flex gap-4 text-sm text-gray-600">
          <p>Tipo: {space.spaceType}</p>
          <p>Capacidad: {space.capacity}</p>
          <p>Ubicación: {space.location}</p>
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-4">
          <DatePicker selectedDate={selectedDate} />
          <BookingForm
            spaceId={params.id}
            selectedDate={selectedDate}
            existingBookings={bookings.map((booking) => ({
              startTime: booking.startTime.toISOString(),
              endTime: booking.endTime.toISOString(),
            }))}
          />
          <ScheduleCalendar bookings={bookings} selectedDate={selectedDate} />
        </div>
      </Card>
    </div>
  );
}
