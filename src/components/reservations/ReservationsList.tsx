"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

interface Booking {
  id: number;
  spaceId: number;
  date: string;
  startTime: string;
  endTime: string;
  space: { name: string; location: string };
}

export function ReservationsList({ bookings }: { bookings: Booking[] }) {
  const [selected, setSelected] = useState<Booking | null>(null);

  return (
    <>
      <div className="space-y-2">
        {bookings.map((booking) => {
          const bookingDate = parseISO(booking.date);
          return (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-[#D4E0DB] px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 hover:border-[#2C4A3E] transition-colors"
            >
              <div className="min-w-0">
                <h3 className="font-sans font-semibold text-[15px] sm:text-[17px] text-[#1A2E25] mb-0.5 truncate">
                  {booking.space.name}
                </h3>
                <p className="font-sans text-[12px] sm:text-[13px] text-[#7A9088] capitalize leading-snug">
                  {format(bookingDate, "EEE d 'de' MMM, yyyy", { locale: es })}
                  {" · "}
                  {booking.startTime} – {booking.endTime}
                </p>
              </div>
              <button
                onClick={() => setSelected(booking)}
                className="font-sans shrink-0 text-[12px] sm:text-[13px] font-semibold bg-[#F5E44A] hover:bg-[#EFD93A] text-[#1A2E25] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors"
              >
                Ver
              </button>
            </div>
          );
        })}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="bg-white sm:max-w-sm rounded-2xl border border-[#D4E0DB] shadow-2xl p-8">
          {selected && (
            <>
              <DialogHeader className="mb-6">
                <p className="font-sans text-[11px] font-semibold tracking-normal text-[#2C4A3E] mb-1">
                  Tu reservación
                </p>
                <DialogTitle className="font-sans font-bold text-[22px] text-[#1A2E25] leading-tight">
                  {selected.space.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="bg-[#F4F8F6] rounded-xl p-4 space-y-3">
                  <div>
                    <p className="font-sans text-[11px] font-semibold tracking-normal text-[#7A9088] mb-0.5">
                      Fecha
                    </p>
                    <p className="font-sans text-[15px] font-medium text-[#1A2E25] capitalize">
                      {format(parseISO(selected.date), "EEEE d 'de' MMMM, yyyy", { locale: es })}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-[11px] font-semibold tracking-normal text-[#7A9088] mb-0.5">
                      Horario
                    </p>
                    <p className="font-sans text-[15px] font-medium text-[#1A2E25]">
                      {selected.startTime} – {selected.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-[11px] font-semibold tracking-normal text-[#7A9088] mb-0.5">
                      Ubicación
                    </p>
                    <p className="font-sans text-[15px] font-medium text-[#1A2E25]">
                      {selected.space.location}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/spaces/${selected.spaceId}?date=${selected.date}`}
                  className="font-sans block w-full text-center bg-[#2C4A3E] hover:bg-[#1A2E25] text-white text-[14px] font-semibold px-6 py-3 rounded-full transition-colors"
                >
                  Ver horario completo
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
