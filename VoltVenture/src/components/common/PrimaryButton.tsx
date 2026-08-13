import React from 'react';
import { Button } from 'react-native-paper';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  testID?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
// Colors flow from PaperProvider theme — no hardcoded hex values here.

export default function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  testID,
}: PrimaryButtonProps) {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      loading={loading}
      disabled={loading || !!disabled}
      testID={testID}
      style={{ minHeight: 52, width: '100%' }}
      contentStyle={{ minHeight: 52 }}
    >
      {label}
    </Button>
  );
}
