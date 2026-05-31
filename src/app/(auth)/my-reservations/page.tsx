import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserBookings } from "@/lib/actions/booking/getUserBookings";
import { ReservationsList } from "@/components/reservations/ReservationsList";
import Link from "next/link";

export default async function MyReservationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const bookings = await getUserBookings(parseInt(session.user.id));

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <p className="font-sans text-[12px] font-semibold text-[#7A9088] mb-2">Mi cuenta</p>
        <h1 className="font-sans font-semibold text-[28px] sm:text-[36px] text-[#1A2E25] tracking-tight leading-tight">
          Mis reservaciones
        </h1>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#D4E0DB] px-6 sm:px-8 py-14 sm:py-16 text-center">
          <div className="inline-block bg-[#F5E44A] rounded-full w-10 h-10 sm:w-12 sm:h-12 mb-4 sm:mb-5" />
          <h3 className="font-sans font-semibold text-[18px] sm:text-[20px] text-[#1A2E25] mb-2">
            Sin reservaciones activas
          </h3>
          <p className="font-sans text-[14px] sm:text-[15px] text-[#7A9088] mb-6 sm:mb-7 max-w-xs mx-auto leading-relaxed">
            Explora los espacios disponibles y realiza tu primera reservación.
          </p>
          <Link
            href="/spaces"
            className="font-sans inline-block bg-[#2C4A3E] hover:bg-[#1A2E25] text-white text-[14px] font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full transition-colors"
          >
            Ver espacios
          </Link>
        </div>
      ) : (
        <ReservationsList bookings={bookings} />
      )}
    </div>
  );
}
