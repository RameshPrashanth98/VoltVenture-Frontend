import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AccountStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';

type Props = StackScreenProps<AccountStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const [units, setUnits] = useState('km');
  const [mapStyle, setMapStyle] = useState('Standard');
  const [language, setLanguage] = useState('English');
  const [expandedRow, setExpandedRow] = useState<'units' | 'mapStyle' | 'language' | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [u, m, l] = await Promise.all([
          AsyncStorage.getItem('settings.units'),
          AsyncStorage.getItem('settings.mapStyle'),
          AsyncStorage.getItem('settings.language'),
        ]);
        setUnits(u ?? 'km');
        setMapStyle(m ?? 'Standard');
        setLanguage(l ?? 'English');
      } catch {
        // silently use defaults
      }
    })();
  }, []);

  async function handleUnitsChange(value: string) {
    setUnits(value);
    setExpandedRow(null);
    try { await AsyncStorage.setItem('settings.units', value); } catch {}
  }

  async function handleMapStyleChange(value: string) {
    setMapStyle(value);
    setExpandedRow(null);
    try { await AsyncStorage.setItem('settings.mapStyle', value); } catch {}
  }

  async function handleLanguageChange(value: string) {
    setLanguage(value);
    setExpandedRow(null);
    try { await AsyncStorage.setItem('settings.language', value); } catch {}
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Section label */}
      <Text style={styles.sectionHeader}>GENERAL</Text>

      {/* Distance Units row */}
      <TouchableOpacity
        style={styles.menuRow}
        onPress={() => setExpandedRow(expandedRow === 'units' ? null : 'units')}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Distance Units, current value ${units}`}
      >
        <View style={styles.menuRowLeft}>
          <MaterialCommunityIcons name="ruler" size={20} color={DSColors.textPrimary} />
          <Text style={styles.menuRowText}>Distance Units</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.settingValue}>{units}</Text>
          <MaterialCommunityIcons
            name={expandedRow === 'units' ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={DSColors.textSecondary}
          />
        </View>
      </TouchableOpacity>
      {expandedRow === 'units' && (
        <View style={styles.pickerContainer}>
          {['km', 'mi'].map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => handleUnitsChange(option)}
              style={styles.pickerOption}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: option === units ? '600' : '400',
                  color: option === units ? DSColors.accent : DSColors.textPrimary,
                }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Map Style row */}
      <TouchableOpacity
        style={styles.menuRow}
        onPress={() => setExpandedRow(expandedRow === 'mapStyle' ? null : 'mapStyle')}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Map Style, current value ${mapStyle}`}
      >
        <View style={styles.menuRowLeft}>
          <MaterialCommunityIcons name="map-outline" size={20} color={DSColors.textPrimary} />
          <Text style={styles.menuRowText}>Map Style</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.settingValue}>{mapStyle}</Text>
          <MaterialCommunityIcons
            name={expandedRow === 'mapStyle' ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={DSColors.textSecondary}
          />
        </View>
      </TouchableOpacity>
      {expandedRow === 'mapStyle' && (
        <View style={styles.pickerContainer}>
          {['Standard', 'Satellite', 'Dark'].map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => handleMapStyleChange(option)}
              style={styles.pickerOption}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: option === mapStyle ? '600' : '400',
                  color: option === mapStyle ? DSColors.accent : DSColors.textPrimary,
                }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Language row */}
      <TouchableOpacity
        style={styles.menuRow}
        onPress={() => setExpandedRow(expandedRow === 'language' ? null : 'language')}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Language, current value ${language}`}
      >
        <View style={styles.menuRowLeft}>
          <MaterialCommunityIcons name="translate" size={20} color={DSColors.textPrimary} />
          <Text style={styles.menuRowText}>Language</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.settingValue}>{language}</Text>
          <MaterialCommunityIcons
            name={expandedRow === 'language' ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={DSColors.textSecondary}
          />
        </View>
      </TouchableOpacity>
      {expandedRow === 'language' && (
        <View style={styles.pickerContainer}>
          {['English', 'Thai', 'Japanese'].map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => handleLanguageChange(option)}
              style={styles.pickerOption}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: option === language ? '600' : '400',
                  color: option === language ? DSColors.accent : DSColors.textPrimary,
                }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Notifications row — navigates to Preferences */}
      <TouchableOpacity
        style={styles.menuRow}
        onPress={() => navigation.navigate('Preferences')}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Notifications"
      >
        <View style={styles.menuRowLeft}>
          <MaterialCommunityIcons name="bell-outline" size={20} color={DSColors.textPrimary} />
          <Text style={styles.menuRowText}>Notifications</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DSColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: DSColors.textPrimary,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: DSColors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: DSColors.surface,
    borderTopWidth: 1,
    borderColor: DSColors.border,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuRowText: {
    fontSize: 16,
    fontWeight: '400',
    color: DSColors.textPrimary,
  },
  settingValue: {
    fontSize: 13,
    fontWeight: '400',
    color: DSColors.textSecondary,
    marginRight: 4,
  },
  pickerContainer: {
    backgroundColor: DSColors.background,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: DSColors.border,
    flexDirection: 'row',
    gap: 16,
  },
  pickerOption: {
    paddingVertical: 4,
  },
});
