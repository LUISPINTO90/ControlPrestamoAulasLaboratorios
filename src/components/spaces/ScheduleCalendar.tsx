"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { deleteBooking } from "@/lib/actions/booking/deleteBooking";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Booking {
  id: number;
  startTime: Date;
  endTime: Date;
  userId: number;
  user: { firstName: string; lastName: string };
}

interface ScheduleCalendarProps {
  bookings: Booking[];
  selectedDate: string;
  currentUserId: number;
}

const hourRanges = Array.from({ length: 15 }, (_, i) => ({ start: i + 7, end: i + 8 }));
function pad(n: number) { return String(n).padStart(2, "0"); }

type Status = "available" | "occupied" | "past" | "completed";

const statusConfig: Record<Status, { label: string; pill: string; row: string }> = {
  available: { label: "Disponible", pill: "bg-[#E4EDE9] text-[#2C4A3E]", row: "" },
  occupied:  { label: "Ocupado",    pill: "bg-[#FDF9CC] text-[#7A6000]",  row: "bg-[#FDFBEB]" },
  past:      { label: "Finalizado", pill: "bg-[#F0F0EE] text-[#7A9088]",  row: "opacity-50" },
  completed: { label: "Completado", pill: "bg-[#E4EDE9] text-[#2C4A3E]",  row: "opacity-60" },
};

export function ScheduleCalendar({ bookings, selectedDate, currentUserId }: ScheduleCalendarProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<number | null>(null);

  const displayDate = (() => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    return new Date(y, m - 1, d);
  })();

  const isPast = (hour: number) => {
    const now = new Date();
    const slot = new Date(displayDate);
    slot.setHours(hour, 0, 0, 0);
    return slot < now;
  };

  const getBooking = (start: number, end: number) =>
    bookings.find((b) => {
      const bs = new Date(b.startTime).getUTCHours();
      const be = new Date(b.endTime).getUTCHours();
      return (start >= bs && start < be) || (end > bs && end <= be) || (start <= bs && end >= be);
    });

  const handleDelete = async (bookingId: number) => {
    try {
      setLoading(bookingId);
      await deleteBooking(bookingId);
      toast({ title: "Reservación cancelada" });
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo cancelar",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <p className="font-sans text-[11px] font-semibold text-[#7A9088] mb-1">Horario del día</p>
        <h2 className="font-sans font-bold text-[18px] sm:text-[22px] text-[#1A2E25] capitalize">
          {format(displayDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
        </h2>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-[#E4EDE9]">
        {(["available", "occupied", "completed", "past"] as Status[]).map((s) => (
          <span key={s} className={`font-sans text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusConfig[s].pill}`}>
            {statusConfig[s].label}
          </span>
        ))}
      </div>

      {/* Filas */}
      <div className="space-y-1">
        {hourRanges.map(({ start, end }) => {
          const booking = getBooking(start, end);
          const isBooked = Boolean(booking);

          let status: Status = "available";
          if (isBooked) status = isPast(end) ? "completed" : "occupied";
          else if (isPast(start)) status = "past";

          const cfg = statusConfig[status];
          const canDelete = booking?.userId === currentUserId && !isPast(end);

          return (
            <div
              key={start}
              className={`rounded-xl px-3 sm:px-4 py-2.5 transition-colors ${cfg.row} ${status === "available" ? "hover:bg-[#F4F8F6]" : ""}`}
            >
              {/* Mobile: stacked; Desktop: inline */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {/* Hora */}
                  <span className="font-sans text-[13px] sm:text-[14px] font-medium text-[#1A2E25] shrink-0 tabular-nums w-[7rem] sm:w-28">
                    {pad(start)}:00 – {pad(end)}:00
                  </span>

                  {/* Pill */}
                  <span className={`font-sans text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0 ${cfg.pill}`}>
                    {cfg.label}
                  </span>

                  {/* Nombre — solo sm+ */}
                  {booking && (
                    <span className="hidden sm:block font-sans text-[13px] sm:text-[14px] text-[#7A9088] truncate">
                      {booking.user.firstName} {booking.user.lastName}
                    </span>
                  )}
                </div>

                {/* Cancelar */}
                {canDelete && booking && (
                  <button
                    onClick={() => handleDelete(booking.id)}
                    disabled={loading === booking.id}
                    className="font-sans text-[12px] font-semibold text-red-500 hover:text-red-700 disabled:opacity-40 shrink-0 transition-colors"
                  >
                    {loading === booking.id ? "…" : "Cancelar"}
                  </button>
                )}
              </div>

              {/* Nombre en mobile (debajo) */}
              {booking && (
                <p className="sm:hidden font-sans text-[12px] text-[#7A9088] mt-0.5 pl-[7.5rem]">
                  {booking.user.firstName} {booking.user.lastName}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
