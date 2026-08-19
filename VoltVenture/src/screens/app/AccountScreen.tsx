import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Portal, Dialog, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import { useAuthContext } from '../../context/AuthContext';
import { useProfileContext } from '../../context/ProfileContext';
import { DSColors } from '../../theme/theme';
import type { AccountStackParamList } from '../../types/navigation';

type Props = StackScreenProps<AccountStackParamList, 'AccountMain'>;

function getInitials(name: string): string {
  return name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);
}

export default function AccountScreen({ navigation }: Props) {
  const authContext = useAuthContext();
  const { profile } = useProfileContext();
  const [showLogout, setShowLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authContext.signOut();
      setShowLogout(false);
      // Do NOT call navigation.navigate() — SIGN_OUT dispatch causes RootNavigator
      // to automatically switch to AuthStack with Login as initial route
    } catch (err) {
      console.error('Logout failed', err);
      // Dialog stays open — user can retry
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Screen title section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Account</Text>
        </View>

        {/* Profile header */}
        <TouchableOpacity
          style={styles.profileHeader}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`View profile for ${profile.name}`}
        >
          {profile.avatarUri ? (
            <Image source={{ uri: profile.avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>{getInitials(profile.name)}</Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
        </TouchableOpacity>

        {/* Ride History row */}
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation.navigate('RideHistory')}
          activeOpacity={0.7}
        >
          <View style={styles.menuRowLeft}>
            <MaterialCommunityIcons
              name="history"
              size={20}
              color={DSColors.textPrimary}
            />
            <Text style={styles.menuRowText}>Ride History</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={DSColors.textSecondary}
          />
        </TouchableOpacity>

        {/* Payment Methods row */}
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation.navigate('PaymentMethods')}
          activeOpacity={0.7}
        >
          <View style={styles.menuRowLeft}>
            <MaterialCommunityIcons
              name="credit-card"
              size={20}
              color={DSColors.textPrimary}
            />
            <Text style={styles.menuRowText}>Payment Methods</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={DSColors.textSecondary}
          />
        </TouchableOpacity>

        {/* VoltCoins Rewards row */}
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation.navigate('VoltCoins')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="VoltCoins Rewards"
        >
          <View style={styles.menuRowLeft}>
            <MaterialCommunityIcons
              name="star-circle"
              size={20}
              color={DSColors.textPrimary}
            />
            <Text style={styles.menuRowText}>VoltCoins Rewards</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={DSColors.textSecondary}
          />
        </TouchableOpacity>

        {/* Settings row */}
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <View style={styles.menuRowLeft}>
            <MaterialCommunityIcons name="cog" size={20} color={DSColors.textPrimary} />
            <Text style={styles.menuRowText}>Settings</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
        </TouchableOpacity>

        {/* Security row */}
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation.navigate('LoginSecurity')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Security"
        >
          <View style={styles.menuRowLeft}>
            <MaterialCommunityIcons name="shield-lock" size={20} color={DSColors.textPrimary} />
            <Text style={styles.menuRowText}>Security</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={DSColors.textSecondary} />
        </TouchableOpacity>

        {/* Log Out row */}
        <TouchableOpacity
          style={styles.logoutRow}
          onPress={() => setShowLogout(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>Log Out</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={DSColors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <Portal>
        <Dialog visible={showLogout} onDismiss={() => setShowLogout(false)}>
          <Dialog.Title>Log Out?</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogBody}>
              You'll need to sign in again to access your account.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLogout(false)}>Cancel</Button>
            <Button
              textColor={DSColors.destructive}
              loading={isLoggingOut}
              disabled={isLoggingOut}
              onPress={handleLogout}
            >
              Log Out
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DSColors.background,
  },
  container: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: DSColors.textPrimary,
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
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: DSColors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: DSColors.border,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '400',
    color: DSColors.destructive,
  },
  dialogBody: {
    fontSize: 16,
    color: DSColors.textSecondary,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: DSColors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: DSColors.border,
    gap: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: DSColors.textPrimary,
  },
  profileEmail: {
    fontSize: 15,
    fontWeight: '400',
    color: DSColors.textSecondary,
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: DSColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '600',
    color: DSColors.textOnPrimary,
  },
});
