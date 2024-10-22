"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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

export function BookingForm({
  spaceId,
  selectedDate,
  existingBookings,
}: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Generate all possible hour ranges (7:00 - 22:00)
  const generateAvailableTimeRanges = () => {
    const allRanges = [];
    for (let i = 7; i < 22; i++) {
      const startHour = i;
      const endHour = i + 1;
      const range = {
        value: `${startHour}-${endHour}`,
        label: `${startHour.toString().padStart(2, "0")}:00 - ${endHour
          .toString()
          .padStart(2, "0")}:00`,
        start: startHour,
        end: endHour,
      };
      allRanges.push(range);
    }

    // Filter out ranges that overlap with existing bookings
    return allRanges.filter((range) => {
      return !existingBookings.some((booking) => {
        const bookingStart = new Date(booking.startTime).getHours();
        const bookingEnd = new Date(booking.endTime).getHours();
        return (
          (range.start >= bookingStart && range.start < bookingEnd) ||
          (range.end > bookingStart && range.end <= bookingEnd)
        );
      });
    });
  };

  const availableRanges = generateAvailableTimeRanges();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const timeRange = formData.get("timeRange") as string;
    const [startHour, endHour] = timeRange.split("-");

    // Create new FormData with start and end times
    const bookingData = new FormData();
    bookingData.append("spaceId", spaceId);
    bookingData.append("date", selectedDate);
    bookingData.append("startTime", startHour);
    bookingData.append("endTime", endHour);

    try {
      setLoading(true);
      await createBooking(bookingData);
      toast({
        title: "Reserva creada",
        description: "La reserva se ha creado exitosamente",
      });
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al crear la reserva",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Horario</label>
        <Select name="timeRange">
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar horario" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {availableRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading || availableRanges.length === 0}
      >
        {loading ? "Creando reserva..." : "Crear reserva"}
      </Button>
    </form>
  );
}
