import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Portal, Dialog, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthContext } from '../../context/AuthContext';
import { DSColors } from '../../theme/theme';

// Phase 1: Account screen is minimal — only logout. Profile editing deferred to v2 (REQUIREMENTS.md deferred section).
export default function AccountScreen() {
  const authContext = useAuthContext();
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
});
