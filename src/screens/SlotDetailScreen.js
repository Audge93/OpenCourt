/**
 * FILE: src/screens/SlotDetailScreen.js
 *
 * PURPOSE:
 * The drill-down view for a single 30-minute booking slot.  It shows three
 * section cards (Court A, Court B, and conditionally On Deck) each listing
 * current players and an action button.  The button label adapts based on the
 * user's current position: "Join", "Switch to", or "Cancel Booking".
 *
 * HOW IT AFFECTS THE PROJECT:
 * - App.js renders this screen when selectedSlotId is non-null, overriding
 *   whichever tab screen would normally show.
 * - The back button in HeaderBanner calls onBack which clears selectedSlotId
 *   in App.js, returning the user to the Court View list.
 * - All booking mutations (join, switch, cancel) are passed as callbacks from
 *   App.js — this screen contains no state; it only displays and delegates.
 * - On Deck section only renders when both Court A and Court B are full
 *   (areCourtsFull returns true), enforcing the booking rules.
 */

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import BottomTabs from '../components/BottomTabs';
import HeaderBanner from '../components/HeaderBanner';
import SectionCard from '../components/SectionCard';
import { areCourtsFull, getSlotCount } from '../utils/slotUtils';
import styles from '../styles/styles';

/**
 * Slot detail screen.
 *
 * @param {{
 *   slot: object,
 *   user: object,
 *   getUserLocation: (slot: object) => string|null,
 *   onBack: () => void,
 *   onBook: (slot: object, destination: string) => void,
 *   onCancel: (slot: object) => void,
 *   activeTab: string,
 *   onTabChange: (key: string) => void,
 * }} props
 *   slot           — The full slot object being viewed
 *   user           — Logged-in user object (id, firstName, skillLevel)
 *   getUserLocation — Returns 'courtA' | 'courtB' | 'onDeck' | null
 *   onBack         — Clears selectedSlotId in App.js
 *   onBook         — Triggers booking validation + confirm modal
 *   onCancel       — Immediately removes the user from the slot
 */
export default function SlotDetailScreen({
  slot,
  user,
  getUserLocation,
  onBack,
  onBook,
  onCancel,
  activeTab,
  onTabChange,
}) {
  // Where the current user is sitting in this slot (or null if not booked)
  const userLocation = getUserLocation(slot);
  const bothCourtsFull = areCourtsFull(slot);
  const totalCount = getSlotCount(slot);

  return (
    <View style={styles.appShell}>
      <HeaderBanner
        title={slot.timeLabel}
        subtitle={`${totalCount}/12 spots filled`}
        onBack={onBack}
      />

      <View style={styles.flexContent}>
        <ScrollView contentContainerStyle={styles.scrollContentWithNav}>

          {/* Reminder that this is shared-play, not a private court reservation */}
          <Text style={styles.helperText}>
            Shared play booking. Players rotate manually on court.
          </Text>

          {/* ── Court A section card ── */}
          <SectionCard
            title="Court A"
            countLabel={`${slot.courtA.length}/4`}
            players={slot.courtA}
            currentUserId={user.id}
            // Button label reflects whether user is joining, switching, or cancelling
            buttonLabel={
              userLocation === 'courtA'
                ? 'Cancel Booking'
                : userLocation
                ? 'Switch to Court A'
                : 'Join Court A'
            }
            // Disable join/switch when Court A is already full (unless user is there)
            buttonDisabled={slot.courtA.length >= 4 && userLocation !== 'courtA'}
            onPress={
              userLocation === 'courtA'
                ? () => onCancel(slot)
                : () => onBook(slot, 'courtA')
            }
          />

          {/* ── Court B section card ── */}
          <SectionCard
            title="Court B"
            countLabel={`${slot.courtB.length}/4`}
            players={slot.courtB}
            currentUserId={user.id}
            buttonLabel={
              userLocation === 'courtB'
                ? 'Cancel Booking'
                : userLocation
                ? 'Switch to Court B'
                : 'Join Court B'
            }
            buttonDisabled={slot.courtB.length >= 4 && userLocation !== 'courtB'}
            onPress={
              userLocation === 'courtB'
                ? () => onCancel(slot)
                : () => onBook(slot, 'courtB')
            }
          />

          {/* ── On Deck section card — only visible when both courts are full ── */}
          {bothCourtsFull ? (
            <SectionCard
              title="On Deck"
              countLabel={`${slot.onDeck.length}/4`}
              players={slot.onDeck}
              currentUserId={user.id}
              helperText="Join On Deck to rotate into the next game as players finish."
              buttonLabel={
                userLocation === 'onDeck'
                  ? 'Cancel Booking'
                  : userLocation
                  ? 'Switch to On Deck'
                  : 'Join On Deck'
              }
              buttonDisabled={slot.onDeck.length >= 4 && userLocation !== 'onDeck'}
              onPress={
                userLocation === 'onDeck'
                  ? () => onCancel(slot)
                  : () => onBook(slot, 'onDeck')
              }
            />
          ) : null}

        </ScrollView>

        <BottomTabs activeTab={activeTab} onChange={onTabChange} />
      </View>
    </View>
  );
}
