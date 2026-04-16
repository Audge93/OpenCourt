/**
 * FILE: src/components/SlotRow.js
 *
 * PURPOSE:
 * A single pressable row in the Court View slot list.  It shows the time
 * range and current occupancy for one 30-minute booking slot, and uses
 * visual states (green highlight, greyed-out + disabled) to communicate
 * whether the slot is open, booked by the current user, or completely full.
 *
 * HOW IT AFFECTS THE PROJECT:
 * - CourtViewScreen renders one <SlotRow> per visible slot inside the grouped
 *   section lists.
 * - Tapping an open/partially-filled row calls onPress, which sets
 *   selectedSlotId in App.js and navigates to SlotDetailScreen.
 * - Full slots are non-interactive (disabled={true}) — the press handler is
 *   never called and the row renders with reduced opacity.
 */

import React from 'react';
import { Pressable, Text } from 'react-native';
import { getSlotCount, isSlotFull } from '../utils/slotUtils';
import styles from '../styles/styles';

/**
 * Single row in the court schedule list.
 *
 * @param {{ slot: object, onPress: () => void, isBookedByMe: boolean }} props
 *   slot        — slot data object (id, timeLabel, courtA, courtB, onDeck, …)
 *   onPress     — called when the user taps a non-full slot
 *   isBookedByMe — true when the current user already has a spot in this slot
 */
export default function SlotRow({ slot, onPress, isBookedByMe }) {
  const count = getSlotCount(slot);  // Total players across all sections
  const full = isSlotFull(slot);     // True when all 12 spots are taken

  return (
    <Pressable
      disabled={full}
      onPress={onPress}
      style={({ pressed }) => [
        styles.slotRow,
        full && styles.slotRowFull,          // Muted grey when no spots left
        isBookedByMe && styles.slotRowMine,  // Brand green when user has a booking
        pressed && !full && styles.pressed,  // Slight opacity dip on press
      ]}
    >
      {/* Time range, e.g. "7:00–7:30 AM" */}
      <Text style={[styles.slotTime, isBookedByMe && styles.slotMineText]}>
        {slot.timeLabel}
      </Text>

      {/* Occupancy count — changes wording when the slot is full */}
      <Text style={[styles.slotMeta, isBookedByMe && styles.slotMineMeta]}>
        {full ? '12/12 spots filled • Full' : `${count}/12 spots filled`}
      </Text>
    </Pressable>
  );
}
