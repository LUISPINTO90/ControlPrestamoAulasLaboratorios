"use client";

import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DatePickerProps {
  selectedDate: string;
}

export function DatePicker({ selectedDate }: DatePickerProps) {
  const router = useRouter();
  const [date, setDate] = useState<Date>(() => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    return new Date(y, m - 1, d, 12, 0, 0);
  });

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      router.push(`?date=${format(newDate, "yyyy-MM-dd")}`);
    }
  };

  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-full text-left bg-[#F4F8F6] hover:bg-[#E4EDE9] border border-[#D4E0DB] rounded-xl px-4 py-3 transition-colors">
            <p className="font-sans text-[11px] font-semibold tracking-normal text-[#7A9088] mb-0.5">
              Seleccionada
            </p>
            <p className="font-sans font-bold text-[17px] text-[#1A2E25] capitalize leading-snug">
              {format(date, "EEEE d 'de' MMMM, yyyy", { locale: es })}
            </p>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white rounded-2xl border-[#D4E0DB] shadow-xl" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
            locale={es}
            className="bg-white rounded-2xl font-sans"
          />
        </PopoverContent>
      </Popover>

      <div className="flex gap-2">
        <button
          onClick={() => handleDateChange(subDays(date, 1))}
          className="flex-1 flex items-center justify-center gap-1 border border-[#D4E0DB] rounded-xl py-2 font-sans text-[13px] text-[#7A9088] hover:bg-[#F4F8F6] hover:text-[#1A2E25] transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Anterior
        </button>
        <button
          onClick={() => handleDateChange(addDays(date, 1))}
          className="flex-1 flex items-center justify-center gap-1 border border-[#D4E0DB] rounded-xl py-2 font-sans text-[13px] text-[#7A9088] hover:bg-[#F4F8F6] hover:text-[#1A2E25] transition-colors"
        >
          Siguiente
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

