import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  addDays,
  formatDistanceToNow,
  isAfter,
  isToday,
  parseISO
} from 'date-fns';
import { format as formatZonedTime, toZonedTime } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import { ScheduleWithAvailable } from '@/types/tour.types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatDateString(dateString: string) {
  const dateParts = dateString.split('-');
  return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
}

export function formatDateOnly(
  date: string | Date,
  formatStr = "EEEE dd 'de' MMMM, yyyy HH:mm"
) {
  if (!date || formatStr === '') return '--';

  let dateToFormat = date;
  if (typeof date === 'string') {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    dateToFormat = dateRegex.test(date)
      ? new Date(`${date}T00:00:00Z`)
      : new Date(`${date}Z`);
  }

  const zonedDate = toZonedTime(dateToFormat, 'UTC');
  return formatZonedTime(zonedDate, formatStr, { locale: es });
}

export function formatDateFriendly(dateString: string) {
  // const date = parseISO(dateString);
  // timestamp from mysql always in UTC, so add Z to make it local
  const utcDate = new Date(`${dateString}Z`);
  return formatDistanceToNow(utcDate, { addSuffix: true, locale: es });
}

/** used to format time to send backend */
export function formatTime(date: Date | undefined): string {
  if (!date) return '00:00:00';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export function formatTimeTo24Hour(time: string): string {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  if (!timeRegex.test(time)) {
    return '--:--';
  }
  const [hours, minutes] = time.split(':').map(Number);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}hs`;
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(price);
}

export function isTodayOrRecent(
  dateString: string,
  numDaysAgo: number = 0
): boolean {
  const date = parseISO(dateString);
  const today = new Date();
  const recentDate = addDays(today, -numDaysAgo);
  // return isBefore(date, today) && isAfter(date, recentDate);
  return isToday(date) || isAfter(date, recentDate);
}

/** change "00:00:00" to minutes, ex: "00:30:00" => 30min */
export function convertToMinutes(timeString: string): number {
  if (!timeString) return 0;
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

/** convert "00:00:00" to Date */
export function timeToDate(timeString: string): Date {
  const [hours, minutes, seconds] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  date.setSeconds(parseInt(seconds, 10));
  return date;
}

export function doesOverlap(
  schedules: ScheduleWithAvailable[],
  startInMinutes: number,
  endInMinutes: number,
  excludeId?: string
): boolean {
  const listSchedules = excludeId
    ? schedules.filter((schedule) => schedule.id !== excludeId)
    : schedules;

  return listSchedules?.some((schedule) => {
    if (!schedule.active) return false;

    const existingStartInMinutes = convertToMinutes(schedule.startTime);
    const existingEndInMinutes = schedule.endTime
      ? convertToMinutes(schedule.endTime)
      : null; // null if no endTime is defined

    if (existingEndInMinutes !== null) {
      const existingRange = {
        start: existingStartInMinutes,
        end:
          existingEndInMinutes >= existingStartInMinutes
            ? existingEndInMinutes
            : existingEndInMinutes + 1440
      };

      const newRange = {
        start: startInMinutes,
        end: endInMinutes >= startInMinutes ? endInMinutes : endInMinutes + 1440
      };

      return (
        newRange.start < existingRange.end && newRange.end > existingRange.start
      );
    }

    return startInMinutes >= existingStartInMinutes;
  });
}
