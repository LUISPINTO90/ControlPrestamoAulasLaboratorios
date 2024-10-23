// src/app/(auth)/spaces/[id]/page.tsx
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/spaces/DatePicker";
import { BookingForm } from "@/components/spaces/BookingForm";
import { ScheduleCalendar } from "@/components/spaces/ScheduleCalendar";
import { getSpaceById } from "@/lib/actions/spaces/getSpaceById";
import { getBookingsBySpaceAndDate } from "@/lib/actions/booking/getBookingBySpaceAndDate";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTodayDateString } from "@/lib/utils/date";

interface PageProps {
  params: {
    id: number;
  };
  searchParams: {
    date?: string;
  };
}

export default async function SpacePage({ params, searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const spaceId = params.id;
  const selectedDate = searchParams.date || getTodayDateString();

  // Ensure we're passing strings to these functions
  const space = await getSpaceById(spaceId.toString());
  const bookings = await getBookingsBySpaceAndDate(
    spaceId.toString(),
    selectedDate
  );

  if (!space) return <div>Espacio no encontrado</div>;

  // Convert session user id to number or provide a default
  const currentUserId = session?.user?.id ? Number(session.user.id) : 0;

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <p className="text-blue-600 text-sm uppercase">Detalles del espacio</p>
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
            spaceId={spaceId.toString()} // Using the string ID
            selectedDate={selectedDate}
            existingBookings={bookings.map((booking) => ({
              startTime: booking.startTime.toISOString(),
              endTime: booking.endTime.toISOString(),
            }))}
          />
          <ScheduleCalendar
            bookings={bookings}
            selectedDate={selectedDate}
            currentUserId={currentUserId} // Using the number ID
          />
        </div>
      </Card>
    </div>
  );
}
