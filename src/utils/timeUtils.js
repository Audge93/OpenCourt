/**
 * FILE: src/utils/timeUtils.js
 *
 * PURPOSE:
 * Pure helper functions for all date and time operations used throughout the
 * app.  Nothing here renders UI — it only transforms raw hour/minute numbers
 * and ISO date strings into the display-ready formats the rest of the app
 * expects.
 *
 * HOW IT AFFECTS THE PROJECT:
 * - slotUtils.js calls makeTimeLabel and makeTimeKey when building every
 *   30-minute slot object for the week.
 * - CourtViewScreen and BookingsScreen call getTodayIso / addDaysIso /
 *   formatDayLabel to construct the 7-day tab bar.
 * - shouldShowSlot (in slotUtils.js) depends on slotStartDateTime /
 *   slotEndDateTime to decide whether a past slot should be hidden.
 */

// ─── 12-hour clock conversion ────────────────────────────────────────────────
/**
 * Converts a 24-hour integer (0–23) into a { hour12, suffix } object.
 * Example: formatHour(14) → { hour12: 2, suffix: 'PM' }
 */
export function formatHour(hour24) {
  const suffix = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour12, suffix };
}

// ─── Slot label builder ──────────────────────────────────────────────────────
/**
 * Builds the human-readable label shown on every slot row.
 * Example: makeTimeLabel(7, 0, 7, 30) → "7:00–7:30 AM"
 */
export function makeTimeLabel(startHour, startMinute, endHour, endMinute) {
  const s = formatHour(startHour);
  const e = formatHour(endHour);
  // Pad minutes to always show two digits (e.g. "07:00" not "7:0")
  const sm = String(startMinute).padStart(2, '0');
  const em = String(endMinute).padStart(2, '0');
  return `${s.hour12}:${sm}–${e.hour12}:${em} ${e.suffix}`;
}

// ─── Sort/ID key ─────────────────────────────────────────────────────────────
/**
 * Produces a zero-padded "HH:MM" string used as a slot's timeKey.
 * This lets slots be compared and sorted lexicographically.
 * Example: makeTimeKey(7, 0) → "07:00"
 */
export function makeTimeKey(hour, minute) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

// ─── Today's ISO date ────────────────────────────────────────────────────────
/**
 * Returns today's local date as a "YYYY-MM-DD" string.
 * Used as the anchor when building the 7-day tab bar and when filtering
 * past slots from today's schedule.
 */
export function getTodayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ─── Date arithmetic ─────────────────────────────────────────────────────────
/**
 * Adds `offset` days to `baseIso` and returns the result as "YYYY-MM-DD".
 * Using T12:00:00 avoids daylight-saving edge cases that can shift the date
 * when using midnight.
 */
export function addDaysIso(baseIso, offset) {
  const d = new Date(`${baseIso}T12:00:00`);
  d.setDate(d.getDate() + offset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ─── Day tab label ───────────────────────────────────────────────────────────
/**
 * Returns the short label for a day-selector chip.
 * - offset 0 → "Today"
 * - offset 1+ → "Mon 21" style (weekday abbreviation + day number)
 */
export function formatDayLabel(dateIso, offset) {
  if (offset === 0) return 'Today';
  const d = new Date(`${dateIso}T12:00:00`);
  const weekday = d.toLocaleDateString([], { weekday: 'short' });
  const day = d.getDate();
  return `${weekday} ${day}`;
}

// ─── 7-day tab list builder ──────────────────────────────────────────────────
/**
 * Builds the array of { label, date } objects for the horizontal day-tab bar.
 * Always starts from today and covers the next 7 days.
 */
export function buildDayTabs() {
  const today = getTodayIso();
  return Array.from({ length: 7 }).map((_, idx) => {
    const date = addDaysIso(today, idx);
    return {
      label: formatDayLabel(date, idx),
      date,
    };
  });
}
