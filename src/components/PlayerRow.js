/**
 * FILE: src/components/PlayerRow.js
 *
 * PURPOSE:
 * A single line in a court section's player list.  It shows a colored skill
 * indicator dot followed by the player's name and level.  If the player is
 * the currently logged-in user, "(You)" is appended to their name so they can
 * quickly spot themselves in a busy list.
 *
 * HOW IT AFFECTS THE PROJECT:
 * - SectionCard renders one <PlayerRow> for each player in courtA, courtB,
 *   or onDeck when displaying the Slot Detail screen.
 * - skillDotColor() maps the player's level to a dot color that matches the
 *   global color system defined in constants/colors.js.
 * - currentUserId is passed down from App.js's user.id so the "(You)" label
 *   stays in sync with profile changes.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { skillDotColor } from '../utils/playerUtils';
import styles from '../styles/styles';

/**
 * One player entry in a court section list.
 *
 * @param {{ item: object, currentUserId: string }} props
 *   item          — player object { name, level, userId }
 *   currentUserId — the logged-in user's userId string
 */
export default function PlayerRow({ item, currentUserId }) {
  // Flag whether this row belongs to the currently logged-in user
  const isYou = item.userId === currentUserId;

  return (
    <View style={styles.playerRow}>
      {/* Colored dot indicating skill level */}
      <View style={[styles.playerDot, { backgroundColor: skillDotColor(item.level) }]} />

      {/* Name + optional "(You)" tag + level */}
      <Text style={styles.playerText}>
        {item.name}
        {isYou ? ' (You)' : ''} — {item.level}
      </Text>
    </View>
  );
}
