/**
 * FILE: src/utils/slotUtils.js
 *
 * PURPOSE:
 * All functions that create, query, and validate the slot data model — the
 * core data structure of OpenCourt.  A "slot" represents one 30-minute window
 * on a specific date and holds the lists of players on Court A, Court B, and
 * On Deck.  This file builds the initial week of slots, filters them for
 * display, and answers questions like "is this slot full?" or "what time
 * section does it belong to?".
 *
 * HOW IT AFFECTS THE PROJECT:
 * - App.js calls buildWeekSlots once at startup to populate the global slots
 *   state array that every screen reads from.
 * - CourtViewScreen uses getSlotsForDate, shouldShowSlot, and getSection to
 *   filter and group slots for the selected day.
 * - SlotDetailScreen and the booking validation logic use areCourtsFull,
 *   isSlotFull, and getSlotCount to decide what actions a user may take.
 * - seedData.js seeds specific slots with demo players for the first launch.
 */

import { makeTimeLabel, makeTimeKey, getTodayIso } from './timeUtils';
import { seedSlots } from './seedData';

// ─── Slot factory ─────────────────────────────────────────────────────────────
/**
 * Generates every 30-minute slot between 6:00 AM and 7:00 PM for one date.
 * Each slot starts empty (no players on any court or on-deck queue).
 *
 * @param {string} date - "YYYY-MM-DD" string identifying the day
 * @returns {Array} ordered array of slot objects
 */
export function createDailySlots(date) {
  const slots = [];
  let hour = 6;
  let minute = 0;
  let index = 0;

  // Walk forward in 30-minute increments until we hit the 7 PM cutoff
  while (!(hour === 19 && minute === 0)) {
    let endHour = hour;
    let endMinute = minute + 30;

    // Roll over to the next hour when minutes exceed 59
    if (endMinute >= 60) {
      endMinute = 0;
      endHour += 1;
    }

    slots.push({
      id: `${date}_${makeTimeKey(hour, minute)}`,   // Globally unique ID
      date,
      timeKey: makeTimeKey(hour, minute),            // "HH:MM" — used for seeding & lookup
      timeLabel: makeTimeLabel(hour, minute, endHour, endMinute), // Display label
      startHour: hour,
      startMinute: minute,
      endHour,
      endMinute,
      order: index,   // Sequential integer — used for consecutive-booking validation
      // Player arrays — each court holds up to 4 players; onDeck holds up to 4
      courtA: [],
      courtB: [],
      onDeck: [],
    });

    hour = endHour;
    minute = endMinute;
    index += 1;
  }

  return slots;
}

// ─── Full week builder ────────────────────────────────────────────────────────
/**
 * Creates all slots for every day in dayTabs and applies demo seed data to
 * today's slots so the app launches with realistic content.
 *
 * @param {Array} dayTabs - Array of { label, date } objects from buildDayTabs()
 * @returns {Array} flat array of all slot objects for the week
 */
export function buildWeekSlots(dayTabs) {
  const todayIso = dayTabs[0].date;
  // flatMap produces one continuous array from all 7 days of daily slots
  return seedSlots(dayTabs.flatMap((day) => createDailySlots(day.date)), todayIso);
}

// ─── Date filter ──────────────────────────────────────────────────────────────
/**
 * Returns only the slots whose date matches the given ISO string.
 * Used by CourtViewScreen to show the selected day's schedule.
 */
export function getSlotsForDate(slots, date) {
  return slots.filter((slot) => slot.date === date);
}

// ─── Slot capacity helpers ────────────────────────────────────────────────────
/**
 * Total number of players currently in a slot across all three sections.
 */
export function getSlotCount(slot) {
  return slot.courtA.length + slot.courtB.length + slot.onDeck.length;
}

/**
 * Returns true when both Court A and Court B have reached their 4-player max.
 * This is the prerequisite for unlocking the On Deck section.
 */
export function areCourtsFull(slot) {
  return slot.courtA.length >= 4 && slot.courtB.length >= 4;
}

/**
 * Returns true when the slot has reached its absolute maximum of 12 players
 * (4 Court A + 4 Court B + 4 On Deck).  Full slots are greyed out in the list.
 */
export function isSlotFull(slot) {
  return getSlotCount(slot) >= 12;
}

// ─── Section grouping ─────────────────────────────────────────────────────────
/**
 * Maps a slot's start hour to one of four named time-of-day sections.
 * These labels are used as headings in the CourtViewScreen slot list.
 */
export function getSection(slot) {
  const hour = slot.startHour;
  if (hour < 9) return 'Morning';
  if (hour < 13) return 'Midday';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

// ─── DateTime helpers ─────────────────────────────────────────────────────────
/**
 * Constructs a JavaScript Date for the moment a slot begins.
 * Used to determine whether a slot is in the past.
 */
export function slotStartDateTime(slot) {
  return new Date(
    `${slot.date}T${String(slot.startHour).padStart(2, '0')}:${String(slot.startMinute).padStart(2, '0')}:00`
  );
}

/**
 * Constructs a JavaScript Date for the moment a slot ends.
 * A slot whose end time has already passed is hidden from the schedule.
 */
export function slotEndDateTime(slot) {
  return new Date(
    `${slot.date}T${String(slot.endHour).padStart(2, '0')}:${String(slot.endMinute).padStart(2, '0')}:00`
  );
}

/**
 * Returns false if the slot's end time is already in the past, meaning the
 * slot should no longer appear in the schedule.
 *
 * @param {object} slot - Slot object
 * @param {Date}   now  - Current time (passed in so tests can inject a fixed time)
 */
export function shouldShowSlot(slot, now) {
  const end = slotEndDateTime(slot);
  // Hide any slot whose end time has already passed
  if (now >= end) return false;
  return true;
}
