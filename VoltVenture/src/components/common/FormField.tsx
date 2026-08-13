import React from 'react';
import { View, type KeyboardTypeOptions } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  placeholder?: string;
  testID?: string;
  editable?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
// Colors flow from PaperProvider theme — no hardcoded hex values here.

export default function FormField({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  placeholder,
  testID,
  editable,
}: FormFieldProps) {
  return (
    <View>
      <TextInput
        mode="outlined"
        label={label}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholder={placeholder}
        testID={testID}
        editable={editable}
        error={!!error}
      />
      <HelperText type="error" visible={!!error}>
        {error || ''}
      </HelperText>
    </View>
  );
}
