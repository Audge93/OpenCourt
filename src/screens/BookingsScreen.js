/**
 * FILE: src/screens/BookingsScreen.js
 *
 * PURPOSE:
 * Shows the current user's upcoming bookings as a list of cards sorted
 * chronologically by date then time.  Each card displays the date, time,
 * and court/on-deck position, with View and Cancel action buttons.
 * A subtitle in the header tracks how many minutes the user has booked
 * for today against their 120-minute daily limit.
 *
 * HOW IT AFFECTS THE PROJECT:
 * - App.js renders this screen when activeTab === 'bookings'.
 * - The `bookings` array is derived here from the global slots state passed
 *   as a prop — no separate bookings state is maintained.
 * - "View" navigates back to Court View and opens the slot's detail screen
 *   by setting selectedSlotId and switching the active tab to 'court'.
 * - "Cancel" calls the onCancel callback from App.js which removes the user
 *   from the slot and updates the global slots array.
 * - Past slots (for today's date only) are filtered out using shouldShowSlot
 *   so the list never shows expired bookings.
 */

import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import BottomTabs from '../components/BottomTabs';
import HeaderBanner from '../components/HeaderBanner';
import { getTodayIso } from '../utils/timeUtils';
import { shouldShowSlot } from '../utils/slotUtils';
import styles from '../styles/styles';

/**
 * My Bookings screen.
 *
 * @param {{
 *   slots: object[],
 *   user: object,
 *   selectedDate: string,
 *   now: Date,
 *   onViewSlot: (slotId: string) => void,
 *   onCancel: (slot: object) => void,
 *   activeTab: string,
 *   onTabChange: (key: string) => void,
 * }} props
 *   slots        — Full global slots array (all dates)
 *   user         — Logged-in user object
 *   selectedDate — Currently selected date in the Court View (used for daily minutes calc)
 *   now          — Current Date object (updated every 30 s by App.js interval)
 *   onViewSlot   — Navigates to the slot detail screen for a given slotId
 *   onCancel     — Removes the user from a slot
 */
export default function BookingsScreen({
  slots,
  user,
  selectedDate,
  now,
  onViewSlot,
  onCancel,
  activeTab,
  onTabChange,
}) {
  const todayIso = getTodayIso();

  // ── Build the bookings list ──────────────────────────────────────────────
  // Filter to slots where the user appears in any court, attach their position
  // label, exclude past today-slots, and sort chronologically.
  const bookings = slots
    .map((slot) => {
      if (slot.courtA.some((p) => p.userId === user.id)) return { ...slot, position: 'Court A' };
      if (slot.courtB.some((p) => p.userId === user.id)) return { ...slot, position: 'Court B' };
      if (slot.onDeck.some((p) => p.userId === user.id)) return { ...slot, position: 'On Deck' };
      return null; // User is not in this slot
    })
    .filter(Boolean)
    // Hide today's slots that have already ended
    .filter((slot) => slot.date !== todayIso || shouldShowSlot(slot, now))
    .sort((a, b) => {
      // Sort by date first, then by slot order within the same date
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.order - b.order;
    });

  // Daily minutes booked for the selected date (each slot = 30 min)
  const todayMinutes = bookings.filter((b) => b.date === selectedDate).length * 30;

  return (
    <View style={styles.appShell}>
      <HeaderBanner
        title="My Bookings"
        subtitle={`Booked today: ${todayMinutes} / 120 minutes`}
      />

      <View style={styles.flexContent}>
        <ScrollView contentContainerStyle={styles.scrollContentWithNav}>

          {bookings.length === 0 ? (
            <Text style={styles.emptyState}>No bookings yet — grab a court!</Text>
          ) : (
            bookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                {/* Date and time label */}
                <Text style={styles.bookingDate}>{booking.date}</Text>
                <Text style={styles.bookingTime}>{booking.timeLabel}</Text>
                {/* Court or On Deck position */}
                <Text style={styles.bookingMeta}>{booking.position}</Text>

                {/* ── Action buttons ── */}
                <View style={styles.bookingButtonRow}>
                  {/* View — switches to Court View and opens this slot's detail */}
                  <Pressable
                    style={({ pressed }) => [
                      styles.secondaryButton,
                      { marginRight: 10 },
                      pressed && styles.pressed,
                    ]}
                    onPress={() => onViewSlot(booking.id)}
                  >
                    <Text style={styles.secondaryButtonText}>View</Text>
                  </Pressable>

                  {/* Cancel — removes the user's spot immediately */}
                  <Pressable
                    style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}
                    onPress={() => onCancel(booking)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}

        </ScrollView>

        <BottomTabs activeTab={activeTab} onChange={onTabChange} />
      </View>
    </View>
  );
}
