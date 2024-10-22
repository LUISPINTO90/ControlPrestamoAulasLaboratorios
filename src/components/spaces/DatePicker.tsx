//src\components\spaces\DatePicker.tsx
// DatePicker.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addDays, subDays } from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useState } from "react";

interface DatePickerProps {
  selectedDate: string;
}

export function DatePicker({ selectedDate }: DatePickerProps) {
  const router = useRouter();
  // Ajustamos la fecha para que use la zona horaria local
  const [date, setDate] = useState<Date>(() => {
    const [year, month, day] = selectedDate.split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0);
  });

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      // Aseguramos que la fecha se formatea correctamente para la URL
      const formattedDate = format(newDate, "yyyy-MM-dd");
      router.push(`?date=${formattedDate}`);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleDateChange(subDays(date, 1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 px-3">
            <CalendarIcon className="h-4 w-4" />
            <span className="font-medium">
              {format(date, "EEEE d 'de' MMMM, yyyy", { locale: es })}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
            locale={es}
            
            className="bg-white"
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="icon"
        onClick={() => handleDateChange(addDays(date, 1))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
