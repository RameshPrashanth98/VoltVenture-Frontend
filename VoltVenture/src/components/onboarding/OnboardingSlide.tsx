import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { DSColors } from '../../theme/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface OnboardingSlideProps {
  headline: string;
  tagline: string;
  imageComponent?: React.ReactNode;
}

export default function OnboardingSlide({
  headline,
  tagline,
  imageComponent,
}: OnboardingSlideProps) {
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <View style={styles.imageArea}>
        {imageComponent ?? (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>[ Illustration ]</Text>
          </View>
        )}
      </View>
      <View style={styles.textArea}>
        <Text style={styles.headline}>{headline}</Text>
        <Text style={styles.tagline}>{tagline}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DSColors.background,
  },
  imageArea: {
    height: SCREEN_HEIGHT * 0.55,
    width: '100%',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: DSColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 16,
    fontWeight: '400',
    color: DSColors.textSecondary,
  },
  textArea: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  headline: {
    fontSize: 24,
    fontWeight: '700',
    color: DSColors.textPrimary,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    fontWeight: '400',
    color: DSColors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
});
