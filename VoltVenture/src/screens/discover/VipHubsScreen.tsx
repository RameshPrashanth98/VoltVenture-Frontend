import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { StackScreenProps } from '@react-navigation/stack';
import type { DiscoverStackParamList, RootStackParamList } from '../../types/navigation';
import { DSColors } from '../../theme/theme';
import PrimaryButton from '../../components/common/PrimaryButton';

type Props = StackScreenProps<DiscoverStackParamList, 'VipHubs'>;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_HEIGHT = Math.round(SCREEN_HEIGHT * 0.45);
const ITEM_HEIGHT = 108;

type VipHub = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  status: 'Available' | 'Full';
  description: string;
  hours: string;
};

const MOCK_HUBS: VipHub[] = [
  {
    id: 'h1',
    name: 'VoltHub Central Station',
    latitude: 52.3791,
    longitude: 4.9003,
    distanceKm: 1.2,
    status: 'Available',
    description: 'Premium charging hub adjacent to Amsterdam Centraal.',
    hours: '24/7',
  },
  {
    id: 'h2',
    name: 'Dam Square VoltHub',
    latitude: 52.3732,
    longitude: 4.8932,
    distanceKm: 0.8,
    status: 'Available',
    description: 'Covered hub in the heart of Amsterdam.',
    hours: '06:00–24:00',
  },
  {
    id: 'h3',
    name: 'Leidseplein VoltHub',
    latitude: 52.3639,
    longitude: 4.8830,
    distanceKm: 1.5,
    status: 'Full',
    description: 'Popular entertainment district hub.',
    hours: '24/7',
  },
  {
    id: 'h4',
    name: 'Waterlooplein VoltHub',
    latitude: 52.3675,
    longitude: 4.9023,
    distanceKm: 0.4,
    status: 'Available',
    description: 'Hub near the flea market and opera house.',
    hours: '08:00–22:00',
  },
  {
    id: 'h5',
    name: 'Vondelpark VoltHub',
    latitude: 52.3577,
    longitude: 4.8743,
    distanceKm: 2.1,
    status: 'Available',
    description: 'Scenic park-side charging station.',
    hours: '07:00–22:00',
  },
];

export default function VipHubsScreen({ navigation }: Props) {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [expandedHubId, setExpandedHubId] = useState<string | null>(null);
  const cameraRef = useRef<MapLibreGL.Camera>(null);
  const flatListRef = useRef<FlatList>(null);

  const handleHubMarkerPress = useCallback((hub: VipHub, index: number) => {
    setExpandedHubId(hub.id);
    flatListRef.current?.scrollToIndex({ index, animated: true });
    cameraRef.current?.flyTo([hub.longitude, hub.latitude], 500);
  }, []);

  const renderHub = ({ item, index }: { item: VipHub; index: number }) => {
    const isExpanded = expandedHubId === item.id;
    const statusStyle =
      item.status === 'Available'
        ? { bg: 'rgba(125,146,32,0.12)', color: DSColors.accent }
        : { bg: 'rgba(176,0,32,0.12)', color: DSColors.destructive };

    return (
      <TouchableOpacity
        onPress={() => {
          setExpandedHubId(isExpanded ? null : item.id);
          cameraRef.current?.flyTo([item.longitude, item.latitude], 500);
          if (!isExpanded) {
            flatListRef.current?.scrollToIndex({ index, animated: true });
          }
        }}
        activeOpacity={0.8}
        style={styles.card}
      >
        {/* Collapsed content */}
        <View style={styles.cardRow1}>
          <Text style={styles.hubName}>{item.name}</Text>
          <Text style={styles.vipBadge}>VIP</Text>
        </View>
        <View style={styles.cardRow2}>
          <View style={styles.distanceRow}>
            <MaterialCommunityIcons name="map-marker" size={14} color={DSColors.textSecondary} />
            <Text style={styles.distanceText}>{item.distanceKm.toFixed(1)} km</Text>
          </View>
          <Text
            style={[styles.statusBadge, { backgroundColor: statusStyle.bg, color: statusStyle.color }]}
            accessibilityLabel={`Status: ${item.status}`}
          >
            {item.status}
          </Text>
        </View>

        {/* Expanded content */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.divider} />
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.amenityRow}>
              <MaterialCommunityIcons name="check-circle" size={16} color={DSColors.accent} />
              <Text style={styles.amenityText}>Fast charging (up to 80% in 45 min)</Text>
            </View>
            <View style={styles.amenityRow}>
              <MaterialCommunityIcons name="check-circle" size={16} color={DSColors.accent} />
              <Text style={styles.amenityText}>Covered, secure parking</Text>
            </View>
            <View style={styles.amenityRow}>
              <MaterialCommunityIcons name="check-circle" size={16} color={DSColors.accent} />
              <Text style={styles.amenityText}>24h access — no closing time</Text>
            </View>
            <View style={styles.hoursRow}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={DSColors.textSecondary} />
              <Text style={styles.hoursText}>{item.hours}</Text>
            </View>
            <PrimaryButton
              label="Get Directions"
              onPress={() => {
                rootNavigation.navigate('NavStack', {
                  screen: 'NavigateToPoi',
                  params: { name: item.name, location: { latitude: item.latitude, longitude: item.longitude } },
                });
              }}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* Custom header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={DSColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VIP Hubs</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Map — fixed height 45% of screen */}
      <MapLibreGL.MapView
        style={{ height: MAP_HEIGHT }}
        styleURL="https://demotiles.maplibre.org/style.json"
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        <MapLibreGL.Camera
          ref={cameraRef}
          centerCoordinate={[4.9041, 52.3676]}
          zoomLevel={13}
        />
        {MOCK_HUBS.map((hub, index) => (
          <MapLibreGL.PointAnnotation
            key={hub.id}
            id={`hub-${hub.id}`}
            coordinate={[hub.longitude, hub.latitude]}
            onSelected={() => handleHubMarkerPress(hub, index)}
          >
            <View style={styles.hubMarker}>
              <MaterialCommunityIcons name="star-circle" size={18} color={DSColors.textOnPrimary} />
            </View>
          </MapLibreGL.PointAnnotation>
        ))}
      </MapLibreGL.MapView>

      {/* Hub list — fills remaining space */}
      <FlatList
        ref={flatListRef}
        data={MOCK_HUBS}
        keyExtractor={item => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
        renderItem={renderHub}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
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
    borderBottomWidth: 1,
    borderColor: DSColors.border,
    backgroundColor: DSColors.background,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: DSColors.textPrimary,
  },
  hubMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DSColors.primary,
    borderWidth: 2,
    borderColor: DSColors.textOnPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: DSColors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DSColors.border,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  cardRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  hubName: {
    fontSize: 17,
    fontWeight: '600',
    color: DSColors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  vipBadge: {
    backgroundColor: DSColors.primary,
    color: DSColors.textOnPrimary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 13,
    fontWeight: '600',
    overflow: 'hidden',
  },
  cardRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 15,
    color: DSColors.textSecondary,
  },
  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 13,
    fontWeight: '600',
    overflow: 'hidden',
  },
  expandedContent: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: DSColors.border,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    fontWeight: '400',
    color: DSColors.textPrimary,
    lineHeight: 22,
    marginBottom: 8,
  },
  amenityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  amenityText: {
    fontSize: 15,
    color: DSColors.textPrimary,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    marginTop: 4,
  },
  hoursText: {
    fontSize: 15,
    color: DSColors.textSecondary,
  },
});
