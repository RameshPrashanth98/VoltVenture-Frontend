import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ListRenderItemInfo,
  ViewabilityConfig,
  ViewToken,
} from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../types/navigation';
import OnboardingSlide from '../../components/onboarding/OnboardingSlide';
import { DSColors } from '../../theme/theme';

type Props = StackScreenProps<AuthStackParamList, 'Onboarding'>;

interface SlideData {
  key: string;
  headline: string;
  tagline: string;
}

const SLIDES: SlideData[] = [
  {
    key: 'slide-0',
    headline: 'Find bikes near you',
    tagline: "See available e-bikes on the map and pick one that's close to you.",
  },
  {
    key: 'slide-1',
    headline: 'Unlock in seconds',
    tagline: 'Scan the QR code or tap to unlock via Bluetooth — no keys needed.',
  },
  {
    key: 'slide-2',
    headline: 'Explore at your pace',
    tagline: 'Ride through the city, lock up anywhere, and pay as you go.',
  },
];

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function OnboardingScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);

  const viewabilityConfig = useRef<ViewabilityConfig>({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<SlideData>) => (
      <OnboardingSlide headline={item.headline} tagline={item.tagline} />
    ),
    [],
  );

  const keyExtractor = useCallback((item: SlideData) => item.key, []);

  const handleSkip = useCallback(() => {
    navigation.navigate('AuthLanding');
  }, [navigation]);

  const handleGetStarted = useCallback(() => {
    navigation.navigate('AuthLanding');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        {/* Skip link — visible on slides 0 and 1 only */}
        {currentIndex < 2 && (
          <TouchableOpacity
            onPress={handleSkip}
            style={[styles.skipButton, { top: 48 + insets.top }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={SLIDES}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_data, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
        />

        {/* Progress dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentIndex ? DSColors.accent : DSColors.border,
                },
              ]}
            />
          ))}
        </View>

        {/* Get Started button on last slide */}
        {currentIndex === 2 && (
          <View style={styles.getStartedContainer}>
            <Button
              mode="contained"
              onPress={handleGetStarted}
              style={styles.getStartedButton}
              contentStyle={styles.getStartedContent}
            >
              Get Started
            </Button>
          </View>
        )}
      </View>
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
    backgroundColor: DSColors.background,
  },
  skipButton: {
    position: 'absolute',
    right: 24,
    zIndex: 10,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '400',
    color: DSColors.textSecondary,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  getStartedContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  getStartedButton: {
    width: '100%',
  },
  getStartedContent: {
    height: 52,
  },
});
