import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Portal, Dialog, Button, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AccountStackParamList } from '../../types/navigation';
import { useProfileContext } from '../../context/ProfileContext';
import PrimaryButton from '../../components/common/PrimaryButton';
import { DSColors } from '../../theme/theme';

type Props = StackScreenProps<AccountStackParamList, 'EditProfile'>;

function getInitials(name: string): string {
  return name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);
}

export default function EditProfileScreen({ navigation }: Props) {
  const { profile, updateProfile } = useProfileContext();
  const [localName, setLocalName] = useState(profile.name);
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(profile.avatarUri);
  const [nameError, setNameError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const discardConfirmed = useRef(false);

  const hasUnsavedChanges = localName !== profile.name || localAvatarUri !== profile.avatarUri;

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (discardConfirmed.current) return;
      if (!hasUnsavedChanges) return;
      e.preventDefault();
      setShowDiscard(true);
    });
    return unsubscribe;
  }, [navigation, hasUnsavedChanges]);

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLocalAvatarUri(result.assets[0].uri);
    }
  };

  function handleSave() {
    if (!localName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setIsSaving(true);
    updateProfile({ name: localName.trim(), avatarUri: localAvatarUri });
    setIsSaving(false);
    navigation.goBack();
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
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Avatar section */}
      <View style={styles.avatarSection}>
        <TouchableOpacity
          onPress={handlePickPhoto}
          accessibilityRole="button"
          accessibilityLabel="Change profile photo"
        >
          {localAvatarUri ? (
            <Image source={{ uri: localAvatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>{getInitials(localName)}</Text>
            </View>
          )}
          <View style={styles.cameraBadge}>
            <MaterialCommunityIcons name="camera" size={14} color={DSColors.textSecondary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Name input */}
      <View style={styles.inputSection}>
        <TextInput
          label="Display Name"
          mode="outlined"
          value={localName}
          onChangeText={(text) => {
            setLocalName(text);
            if (text.trim()) setNameError(false);
          }}
          error={nameError}
        />
        {nameError && (
          <Text style={styles.errorText}>Name can't be empty</Text>
        )}
      </View>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Save button */}
      <View style={styles.saveSection}>
        <PrimaryButton
          label="Save Changes"
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving}
        />
      </View>

      {/* Discard Changes dialog */}
      <Portal>
        <Dialog visible={showDiscard} onDismiss={() => setShowDiscard(false)}>
          <Dialog.Title>Discard Changes?</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogBody}>
              Your edits haven't been saved. Go back without saving?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDiscard(false)}>Keep Editing</Button>
            <Button
              textColor={DSColors.destructive}
              onPress={() => {
                discardConfirmed.current = true;
                navigation.goBack();
              }}
            >
              Discard
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
  avatarSection: {
    alignItems: 'center',
    marginTop: 24,
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
  cameraBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: DSColors.surface,
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: DSColors.border,
  },
  inputSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  errorText: {
    color: DSColors.error,
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  saveSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  dialogBody: {
    fontSize: 16,
    color: DSColors.textSecondary,
  },
});
