import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import { useProfileContext } from '../../context/ProfileContext';
import { DSColors } from '../../theme/theme';
import type { AccountStackParamList } from '../../types/navigation';

type Props = StackScreenProps<AccountStackParamList, 'Profile'>;

function getInitials(name: string): string {
  return name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);
}

export default function ProfileScreen({ navigation }: Props) {
  const { profile } = useProfileContext();

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
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile')}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
        >
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar section */}
      <View style={styles.avatarSection}>
        {profile.avatarUri ? (
          <Image source={{ uri: profile.avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitials}>{getInitials(profile.name)}</Text>
          </View>
        )}
      </View>

      <Text style={styles.profileName}>{profile.name}</Text>
      <Text style={styles.profileEmail}>{profile.email}</Text>

      {/* Member since field */}
      <View style={styles.fieldSection}>
        <Text style={styles.fieldLabel}>MEMBER SINCE</Text>
        <Text style={styles.fieldValue}>{profile.memberSince}</Text>
      </View>
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
  editButton: {
    fontSize: 15,
    fontWeight: '400',
    color: DSColors.accent,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: DSColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: '600',
    color: DSColors.textPrimary,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: DSColors.textPrimary,
    textAlign: 'center',
    marginTop: 16,
  },
  profileEmail: {
    fontSize: 15,
    fontWeight: '400',
    color: DSColors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  fieldSection: {
    borderTopWidth: 1,
    borderColor: DSColors.border,
    marginTop: 32,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: DSColors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingBottom: 8,
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: '400',
    color: DSColors.textPrimary,
  },
});
