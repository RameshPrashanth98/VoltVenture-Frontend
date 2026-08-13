import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';

type Props = StackScreenProps<AuthStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VoltVenture</Text>
      <Text style={styles.tagline}>Explore the city on two wheels.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DSColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: DSColors.textOnPrimary,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '400',
    color: DSColors.textOnPrimary,
    marginTop: 8,
  },
});
