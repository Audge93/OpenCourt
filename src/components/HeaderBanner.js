/**
 * FILE: src/components/HeaderBanner.js
 *
 * PURPOSE:
 * The green top header rendered on every main screen.  It displays the
 * OpenCourt small logo on the left, a centered title + optional subtitle, and
 * an optional back chevron (‹) for drill-down screens like Slot Detail.
 *
 * HOW IT AFFECTS THE PROJECT:
 * - Every screen (CourtView, SlotDetail, Bookings, Location, Profile,
 *   Onboarding) renders <HeaderBanner> as the first element in its appShell.
 * - When `onBack` is provided the back button appears; omitting it renders a
 *   blank spacer so the title stays centred regardless.
 * - HEADER_LOGO_SIZE is imported from styles so the logo and its surrounding
 *   padding are calculated identically here and in the StyleSheet.
 * - The SafeAreaView wrapper ensures the header sits below the device status
 *   bar on both iOS and Android.
 */

import React from 'react';
import { Image, Pressable, SafeAreaView, Text, View } from 'react-native';
import styles, { HEADER_LOGO_SIZE } from '../styles/styles';

/**
 * Top header banner used on every screen.
 *
 * @param {{ title: string, subtitle?: string, onBack?: () => void }} props
 *   title    — Bold white heading text (required)
 *   subtitle — Smaller muted line below the title (optional)
 *   onBack   — If provided, renders a back chevron on the left (optional)
 */
export default function HeaderBanner({ title, subtitle, onBack }) {
  return (
    // SafeAreaView applies platform-specific insets so content clears notches
    <SafeAreaView style={styles.headerSafe}>
      <View style={styles.headerWrap}>
        <View style={styles.headerRow}>

          {/* Back button — only shown when onBack callback is supplied */}
          {onBack ? (
            <Pressable style={styles.headerBackWrap} onPress={onBack}>
              <Text style={styles.headerBack}>‹</Text>
            </Pressable>
          ) : (
            // Empty spacer preserves layout even without a back button
            <View style={styles.headerBackWrap} />
          )}

          {/* Small OC logo anchored to the left side */}
          <View style={styles.headerLogoWrap}>
            <Image
              source={require('../../assets/OC_Small_Logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>

          {/* Centred title + subtitle block */}
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{title}</Text>
            {/* Only render subtitle row when a subtitle string is provided */}
            {!!subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
          </View>

          {/* Right-side spacer balances the back-button width on the left */}
          <View style={styles.headerRightSpacer} />
        </View>
      </View>
    </SafeAreaView>
  );
}
