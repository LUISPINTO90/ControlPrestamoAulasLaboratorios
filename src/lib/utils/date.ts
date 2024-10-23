// src/lib/utils/date.ts

/**
 * Converts a local date string to UTC Date object
 * @param dateStr Format: 'YYYY-MM-DD'
 * @param hour Local hour (0-23)
 */
export const toUTCDate = (dateStr: string, hour: number): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day, hour);
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours()
    )
  );
};

/**
 * Gets today's date in YYYY-MM-DD format in local timezone
 */
export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toLocaleDateString("en-CA"); // Returns YYYY-MM-DD
};

/**
 * Checks if a given time slot is in the past
 * @param date Format: 'YYYY-MM-DD'
 * @param hour Hour in 24-hour format (0-23)
 */
export const isTimeSlotPast = (date: string, hour: number): boolean => {
  const now = new Date();
  const currentHour = now.getHours();

  // Convert both dates to midnight for date comparison
  const slotDate = new Date(date);
  slotDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If dates are different, we can compare just the dates
  if (slotDate.getTime() !== today.getTime()) {
    return slotDate < today;
  }

  // If it's the same date, compare hours
  return hour <= currentHour;
};

/**
 * Formats a UTC date to local time string
 */
export const formatTimeToLocal = (date: Date): string => {
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

/**
 * Gets the local hour from a UTC date
 */
export const getLocalHour = (date: Date): number => {
  return new Date(date).getHours();
};
