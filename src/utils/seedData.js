/**
 * FILE: src/utils/seedData.js
 *
 * PURPOSE:
 * Provides realistic demo data for today's schedule so the app looks
 * populated on first launch instead of showing an empty court list.
 * Seed data is only applied to today's date — future days remain empty,
 * reflecting a real-world booking system where only today has existing
 * sign-ups.
 *
 * HOW IT AFFECTS THE PROJECT:
 * - slotUtils.js calls seedSlots() inside buildWeekSlots() immediately after
 *   generating the raw empty slot array.  The seeded slots replace specific
 *   today-slots in that array.
 * - This file has no effect on future days or on any slot that isn't
 *   explicitly listed in the switch-like block below.
 * - In production you would replace this function with a real API fetch;
 *   for now it acts as static fixture data.
 */

import { player } from './playerUtils';

// ─── Seed applicator ──────────────────────────────────────────────────────────
/**
 * Walks through all slots and injects demo players into specific time slots
 * on today's date.  Returns a new array — the original is never mutated.
 *
 * @param {Array}  allSlots  - Full flat array of slot objects for the week
 * @param {string} todayIso  - "YYYY-MM-DD" string for today
 * @returns {Array} new slots array with demo players applied to today
 */
export function seedSlots(allSlots, todayIso) {
  return allSlots.map((slot) => {
    // Only seed today's slots — leave future days untouched
    if (slot.date !== todayIso) return slot;

    // Each case matches a timeKey ("HH:MM") and returns a spread of the slot
    // with player arrays replaced.  Using spread keeps all other slot fields
    // (id, date, order, etc.) intact.

    // 6:30 AM — Court A has 2 players (partially filled)
    if (slot.timeKey === '06:30') {
      return {
        ...slot,
        courtA: [player('Alex', 'Intermediate'), player('Sam', 'Advanced')],
      };
    }

    // 7:00 AM — Both courts full (no on-deck yet)
    if (slot.timeKey === '07:00') {
      return {
        ...slot,
        courtA: [
          player('Alex', 'Intermediate'),
          player('Jamie', 'Beginner'),
          player('Taylor', 'Advanced'),
          player('Morgan', 'Intermediate'),
        ],
        courtB: [
          player('Chris', 'Beginner'),
          player('Jordan', 'Advanced'),
          player('Casey', 'Intermediate'),
          player('Drew', 'Advanced'),
        ],
      };
    }

    // 7:30 AM — Both courts full AND an on-deck queue (completely full slot)
    if (slot.timeKey === '07:30') {
      return {
        ...slot,
        courtA: [
          player('Alex', 'Intermediate'),
          player('Jamie', 'Beginner'),
          player('Taylor', 'Advanced'),
          player('Morgan', 'Intermediate'),
        ],
        courtB: [
          player('Chris', 'Beginner'),
          player('Jordan', 'Advanced'),
          player('Casey', 'Intermediate'),
          player('Drew', 'Advanced'),
        ],
        onDeck: [
          player('Pat', 'Intermediate'),
          player('Lee', 'Beginner'),
          player('Sky', 'Advanced'),
          player('Jules', 'Intermediate'),
        ],
      };
    }

    // 8:00 AM — Court B has just 1 player (very open)
    if (slot.timeKey === '08:00') {
      return {
        ...slot,
        courtB: [player('Avery', 'Beginner')],
      };
    }

    // 9:30 AM — Court A has 4 players (Court B still open)
    if (slot.timeKey === '09:30') {
      return {
        ...slot,
        courtA: [
          player('Nina', 'Intermediate'),
          player('Owen', 'Advanced'),
          player('Mia', 'Beginner'),
          player('Noah', 'Intermediate'),
        ],
      };
    }

    // 2:30 PM — Both courts full (afternoon rush)
    if (slot.timeKey === '14:30') {
      return {
        ...slot,
        courtA: [
          player('Ivy', 'Beginner'),
          player('Mason', 'Intermediate'),
          player('Luca', 'Advanced'),
          player('Ella', 'Intermediate'),
        ],
        courtB: [
          player('Theo', 'Beginner'),
          player('Logan', 'Advanced'),
          player('Ava', 'Intermediate'),
          player('Reed', 'Intermediate'),
        ],
      };
    }

    // 6:00 PM — Court A has 3 players; Court B full (evening play)
    if (slot.timeKey === '18:00') {
      return {
        ...slot,
        courtA: [
          player('Jill', 'Beginner'),
          player('Ben', 'Intermediate'),
          player('Cole', 'Advanced'),
        ],
        courtB: [
          player('Mara', 'Intermediate'),
          player('Ty', 'Beginner'),
          player('Pia', 'Advanced'),
          player('Finn', 'Intermediate'),
        ],
      };
    }

    // 6:30 PM — Both courts full with on-deck queue (last busy slot of day)
    if (slot.timeKey === '18:30') {
      return {
        ...slot,
        courtA: [
          player('Jill', 'Beginner'),
          player('Ben', 'Intermediate'),
          player('Cole', 'Advanced'),
          player('Rory', 'Intermediate'),
        ],
        courtB: [
          player('Mara', 'Intermediate'),
          player('Ty', 'Beginner'),
          player('Pia', 'Advanced'),
          player('Finn', 'Intermediate'),
        ],
        onDeck: [
          player('Gray', 'Beginner'),
          player('Elle', 'Intermediate'),
          player('Max', 'Advanced'),
          player('Tess', 'Intermediate'),
        ],
      };
    }

    // All other today-slots stay empty
    return slot;
  });
}
