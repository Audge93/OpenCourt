/**
 * FILE: src/components/SectionCard.js
 *
 * PURPOSE:
 * A white card that represents one section of a booking slot — Court A,
 * Court B, or On Deck.  It lists the current players in that section and
 * renders an action button whose label changes based on whether the user
 * is already in this section, in a different section, or not yet booked.
 *
 * HOW IT AFFECTS THE PROJECT:
 * - SlotDetailScreen renders up to three <SectionCard> components per slot
 *   (Court A, Court B, and conditionally On Deck when both courts are full).
 * - The button and its disabled state are fully controlled by the parent —
 *   SectionCard itself has no booking logic; it just calls onPress.
 * - PlayerRow is rendered for each player, passing currentUserId so "(You)"
 *   is shown next to the logged-in user's entry.
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import PlayerRow from './PlayerRow';
import styles from '../styles/styles';

/**
 * Court section card shown on the Slot Detail screen.
 *
 * @param {{
 *   title: string,
 *   players: object[],
 *   countLabel: string,
 *   helperText?: string,
 *   buttonLabel?: string,
 *   buttonDisabled?: boolean,
 *   onPress?: () => void,
 *   currentUserId: string,
 * }} props
 *   title         — Section name, e.g. "Court A"
 *   players       — Array of player objects in this section
 *   countLabel    — e.g. "3/4" shown in the card header
 *   helperText    — Optional description line (used for On Deck)
 *   buttonLabel   — CTA label; omit to hide the button entirely
 *   buttonDisabled — Prevents interaction when section is full
 *   onPress       — Called when the action button is tapped
 *   currentUserId — Used by PlayerRow to label the current user "(You)"
 */
export default function SectionCard({
  title,
  players,
  countLabel,
  helperText,
  buttonLabel,
  buttonDisabled,
  onPress,
  currentUserId,
}) {
  return (
    <View style={styles.sectionCard}>
      {/* Card header: section name on the left, occupancy count on the right */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionCount}>{countLabel}</Text>
      </View>

      {/* Optional helper text (e.g. On Deck instructions) */}
      {!!helperText && <Text style={styles.sectionHelper}>{helperText}</Text>}

      {/* Player list — empty state message when no one has booked yet */}
      {players.length === 0 ? (
        <Text style={styles.sectionEmpty}>No one has booked this section yet.</Text>
      ) : (
        players.map((item, idx) => (
          <PlayerRow
            key={`${title}_${idx}_${item.name}`}
            item={item}
            currentUserId={currentUserId}
          />
        ))
      )}

      {/* Action button — only rendered when a buttonLabel string is provided */}
      {!!buttonLabel && (
        <Pressable
          disabled={buttonDisabled}
          onPress={() => onPress && onPress()}
          style={({ pressed }) => [
            styles.primaryButton,
            buttonDisabled && styles.primaryButtonDisabled,
            pressed && !buttonDisabled && styles.pressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>{buttonLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
