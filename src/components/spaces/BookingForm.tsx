//src\components\spaces\BookingForm.tsx
"use client";

import { useState, useEffect } from "react";
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
  const [availableStartHours, setAvailableStartHours] = useState<string[]>([]);
  const [availableEndHours, setAvailableEndHours] = useState<string[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generate all possible hours (7:00 - 22:00)
    const allHours = Array.from({ length: 16 }, (_, i) => {
      const hour = i + 7;
      return `${hour.toString().padStart(2, "0")}:00`;
    });

    // Create time blocks for all bookings
    const bookedBlocks = existingBookings.map((booking) => ({
      start: new Date(booking.startTime).getHours(),
      end: new Date(booking.endTime).getHours(),
    }));

    // Filter out hours that are within any booking block
    const availableHours = allHours.filter((hour) => {
      const currentHour = parseInt(hour.split(":")[0]);
      return !bookedBlocks.some(
        (block) => currentHour >= block.start && currentHour < block.end
      );
    });

    setAvailableStartHours(availableHours);
    setSelectedStartTime("");
    setAvailableEndHours([]);
  }, [selectedDate, existingBookings]);

  useEffect(() => {
    if (selectedStartTime) {
      const startHour = parseInt(selectedStartTime.split(":")[0]);
      const endHours = [];
      let currentHour = startHour + 1;

      // Find the next booking after the selected start time
      const nextBooking = existingBookings
        .map((booking) => ({
          start: new Date(booking.startTime).getHours(),
        }))
        .filter((booking) => booking.start > startHour)
        .sort((a, b) => a.start - b.start)[0];

      // Add hours until we hit the next booking or 22:00
      while (currentHour <= 22) {
        if (nextBooking && currentHour >= nextBooking.start) {
          break;
        }

        const hourString = `${currentHour.toString().padStart(2, "0")}:00`;
        endHours.push(hourString);
        currentHour++;
      }

      setAvailableEndHours(endHours);
    }
  }, [selectedStartTime, existingBookings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      setLoading(true);
      await createBooking(formData);
      toast({
        title: "Reserva creada",
        description: "La reserva se ha creado exitosamente",
      });
      // Refresh the page to show the new booking
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
      <input type="hidden" name="spaceId" value={spaceId} />
      <input type="hidden" name="date" value={selectedDate} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Hora de inicio</label>
          <Select
            name="startTime"
            value={selectedStartTime}
            onValueChange={setSelectedStartTime}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar hora" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {availableStartHours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Hora de fin</label>
          <Select name="endTime" disabled={!selectedStartTime}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar hora" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {availableEndHours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={
          loading || !selectedStartTime || availableEndHours.length === 0
        }
      >
        {loading ? "Creando reserva..." : "Crear reserva"}
      </Button>
    </form>
  );
}
