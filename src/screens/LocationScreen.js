/**
 * FILE: src/screens/LocationScreen.js
 *
 * PURPOSE:
 * Placeholder screen for the court's physical location and map.  Currently
 * it renders an empty card with a "future site of court map" label.  This
 * screen exists as a structural stub so the tab bar navigation works end-to-end
 * and the map feature can be dropped in later without restructuring the app.
 *
 * HOW IT AFFECTS THE PROJECT:
 * - App.js renders this screen when activeTab === 'location'.
 * - When a real map is added (e.g. react-native-maps or a WebView with an
 *   embed), this is the only file that needs to change.
 * - No booking logic or global state is read or modified here.
 */

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import BottomTabs from '../components/BottomTabs';
import HeaderBanner from '../components/HeaderBanner';
import styles from '../styles/styles';

/**
 * Court location screen (placeholder).
 *
 * @param {{
 *   activeTab: string,
 *   onTabChange: (key: string) => void,
 * }} props
 */
export default function LocationScreen({ activeTab, onTabChange }) {
  return (
    <View style={styles.appShell}>
      <HeaderBanner title="Court Location" subtitle="Office court location" />

      <View style={styles.flexContent}>
        <ScrollView contentContainerStyle={styles.scrollContentWithNav}>

          {/* Placeholder card — replace inner content with a real map component */}
          <View style={styles.locationCard}>
            <Text style={styles.locationPlaceholder}>future site of court map</Text>
          </View>

        </ScrollView>

        <BottomTabs activeTab={activeTab} onChange={onTabChange} />
      </View>
    </View>
  );
}
