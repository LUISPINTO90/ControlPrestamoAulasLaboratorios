// src/lib/utils/date.ts
// Utility functions for consistent date handling
export const formatDateForDB = (date: string, hour: number): Date => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour, 0, 0));
};

export const getLocalHourFromDate = (date: Date): number => {
  return new Date(date).getHours();
};
