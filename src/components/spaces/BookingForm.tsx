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

  const generateAvailableTimeRanges = () => {
    const allRanges = [];
    // Generamos rangos de 7am a 22pm
    for (let i = 7; i < 22; i++) {
      const startHour = i;
      const endHour = i + 1;

      // Formato para mostrar al usuario
      const displayStart = startHour.toString().padStart(2, "0");
      const displayEnd = endHour.toString().padStart(2, "0");

      const range = {
        value: `${startHour}-${endHour}`, // Valor UTC para el backend
        label: `${displayStart}:00 - ${displayEnd}:00`, // Display para el usuario
        start: startHour,
        end: endHour,
      };
      allRanges.push(range);
    }

    // Filtramos los rangos que ya están reservados
    return allRanges.filter((range) => {
      return !existingBookings.some((booking) => {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);
        const bookingStartHour = bookingStart.getUTCHours();
        const bookingEndHour = bookingEnd.getUTCHours();

        return (
          (range.start >= bookingStartHour && range.start < bookingEndHour) ||
          (range.end > bookingStartHour && range.end <= bookingEndHour) ||
          (range.start <= bookingStartHour && range.end >= bookingEndHour)
        );
      });
    });
  };

  const availableRanges = generateAvailableTimeRanges();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const timeRange = formData.get("timeRange") as string;
    const [startHour, endHour] = timeRange.split("-").map(Number);

    const bookingData = new FormData();
    bookingData.append("spaceId", spaceId);
    bookingData.append("date", selectedDate);
    bookingData.append("startTime", startHour.toString());
    bookingData.append("endTime", endHour.toString());

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
        <Select name="timeRange" required>
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
