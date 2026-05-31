import { DatePicker } from "@/components/spaces/DatePicker";
import { BookingForm } from "@/components/spaces/BookingForm";
import { ScheduleCalendar } from "@/components/spaces/ScheduleCalendar";
import { getSpaceById } from "@/lib/actions/spaces/getSpaceById";
import { getBookingsBySpaceAndDate } from "@/lib/actions/booking/getBookingBySpaceAndDate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTodayDateString } from "@/lib/utils/date";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}

const typeLabel: Record<string, string> = {
  Laboratory: "Laboratorio",
  Classroom: "Salón",
};

export default async function SpacePage({ params, searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const { id: spaceId } = await params;
  const { date } = await searchParams;
  const selectedDate = date || getTodayDateString();

  const space = await getSpaceById(spaceId.toString());
  const bookings = await getBookingsBySpaceAndDate(spaceId.toString(), selectedDate);

  if (!space) {
    return (
      <div className="py-20 text-center">
        <p className="font-sans text-[17px] text-[#7A9088]">Espacio no encontrado.</p>
        <Link href="/spaces" className="font-sans text-[14px] text-[#2C4A3E] mt-2 inline-block hover:underline">
          ← Volver
        </Link>
      </div>
    );
  }

  const currentUserId = session?.user?.id ? Number(session.user.id) : 0;

  const header = (
    <div>
      <Link href="/spaces" className="font-sans text-[13px] text-[#7A9088] hover:text-[#2C4A3E] transition-colors mb-2 inline-block">
        ← Espacios
      </Link>
      <p className="font-sans text-[11px] font-semibold text-[#7A9088] mb-0.5">
        {typeLabel[space.spaceType]} · {space.location} · {space.capacity} personas
      </p>
      <h1 className="font-sans font-bold text-[22px] sm:text-[28px] text-[#1A2E25] tracking-tight leading-tight">
        {space.name}
      </h1>
    </div>
  );

  const datePicker = (
    <div className="bg-white rounded-2xl border border-[#D4E0DB] p-4 sm:p-5">
      <p className="font-sans text-[11px] font-semibold text-[#7A9088] mb-3">Fecha</p>
      <DatePicker selectedDate={selectedDate} />
    </div>
  );

  const bookingForm = (
    <div className="bg-[#2C4A3E] rounded-2xl p-4 sm:p-5">
      <p className="font-sans text-[12px] font-semibold text-[#F5E44A] mb-1">Nueva reservación</p>
      <p className="font-sans text-[13px] text-white/50 mb-4">Elige un horario disponible para este día</p>
      <BookingForm
        spaceId={spaceId.toString()}
        selectedDate={selectedDate}
        existingBookings={bookings.map((b) => ({
          startTime: b.startTime.toISOString(),
          endTime: b.endTime.toISOString(),
        }))}
      />
    </div>
  );

  const schedule = (
    <ScheduleCalendar
      bookings={bookings}
      selectedDate={selectedDate}
      currentUserId={currentUserId}
    />
  );

  return (
    <>
      {/* Mobile / tablet — scroll natural */}
      <div className="lg:hidden space-y-4">
        {header}
        {datePicker}
        {bookingForm}
        <div className="bg-white rounded-2xl border border-[#D4E0DB] p-4">{schedule}</div>
      </div>

      {/* Desktop — sin scroll de página, calendar scrollable internamente */}
      <div
        className="hidden lg:flex flex-col gap-4"
        style={{ height: "calc(100vh - 7.5rem)" }}
      >
        {header}
        <div className="grid gap-4 lg:grid-cols-5 flex-1 min-h-0">
          <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
            <div className="shrink-0">{datePicker}</div>
            <div className="shrink-0">{bookingForm}</div>
          </div>
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#D4E0DB] flex flex-col min-h-0">
            <div className="overflow-y-auto flex-1 p-5">{schedule}</div>
          </div>
        </div>
      </div>
    </>
  );
}
