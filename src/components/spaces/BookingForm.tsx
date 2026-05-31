"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createBooking } from "@/lib/actions/booking/createBooking";

interface BookingFormProps {
  spaceId: string;
  selectedDate: string;
  existingBookings: { startTime: string; endTime: string }[];
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function BookingForm({ spaceId, selectedDate, existingBookings }: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState<string>("");
  const { toast } = useToast();

  const availableRanges = (() => {
    const now = new Date();
    const isToday = selectedDate === now.toISOString().split("T")[0];
    return Array.from({ length: 15 }, (_, i) => i + 7)
      .map((h) => ({ value: `${h}-${h + 1}`, label: `${pad(h)}:00 – ${pad(h + 1)}:00`, start: h, end: h + 1 }))
      .filter((r) => {
        if (isToday && r.start <= now.getHours()) return false;
        return !existingBookings.some((b) => {
          const bs = new Date(b.startTime).getUTCHours();
          const be = new Date(b.endTime).getUTCHours();
          return (r.start >= bs && r.start < be) || (r.end > bs && r.end <= be) || (r.start <= bs && r.end >= be);
        });
      });
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRange) return;
    const [startHour, endHour] = selectedRange.split("-").map(Number);
    const data = new FormData();
    data.append("spaceId", spaceId);
    data.append("date", selectedDate);
    data.append("startTime", startHour.toString());
    data.append("endTime", endHour.toString());
    try {
      setLoading(true);
      await createBooking(data);
      toast({ title: "Reservación confirmada" });
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear la reservación",
      });
    } finally {
      setLoading(false);
    }
  };

  if (availableRanges.length === 0) {
    return (
      <p className="font-sans text-[13px] text-white/50 bg-white/10 rounded-xl px-4 py-3">
        Sin horarios disponibles para este día.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Select name="timeRange" required value={selectedRange} onValueChange={setSelectedRange}>
        <SelectTrigger className="h-11 w-full rounded-xl border-white/20 bg-white/10 text-white text-[14px] font-sans focus:border-[#F5E44A] focus:ring-[#F5E44A] placeholder:text-white/50 transition-colors">
          <SelectValue placeholder="Seleccionar horario…" />
        </SelectTrigger>
        <SelectContent className="bg-white rounded-xl border-[#D4E0DB] shadow-lg">
          {availableRanges.map((r) => (
            <SelectItem key={r.value} value={r.value} className="font-sans text-[14px] py-2.5 cursor-pointer text-[#1A2E25]">
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        type="submit"
        disabled={loading || !selectedRange}
        className="font-sans w-full h-11 rounded-full bg-[#F5E44A] hover:bg-[#EFD93A] disabled:opacity-40 disabled:cursor-not-allowed text-[#1A2E25] text-[14px] font-semibold transition-colors"
      >
        {loading ? "Reservando…" : "Confirmar reservación"}
      </button>
    </form>
  );
}
