import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FAB, IconButton } from 'react-native-paper';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import MapLibreGL from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DSColors, DSTypography } from '../../theme/theme';
import { bikeService } from '../../services/bikeService';
import { Bike, FilterState } from '../../types/bike';
import { RootStackParamList } from '../../types/navigation';
import BikeMarker from '../../components/map/BikeMarker';
import BikeDetailSheet from '../../components/map/BikeDetailSheet';
import CafeMarker from '../../components/map/CafeMarker';
import CafeDetailSheet, { Cafe } from '../../components/map/CafeDetailSheet';
import FilterSheet from '../../components/map/FilterSheet';
import BikeListView from '../../components/map/BikeListView';

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const MOCK_CAFES: Cafe[] = [
  { id: 'c1', name: 'Café de Jaren', hours: 'Mon–Sun 9:00–23:00', latitude: 52.3684, longitude: 4.8960 },
  { id: 'c2', name: 'Screaming Beans', hours: 'Mon–Fri 8:00–17:00, Sat–Sun 9:00–17:00', latitude: 52.3637, longitude: 4.8833 },
  { id: 'c3', name: 'Lot Sixty One Coffee', hours: 'Mon–Fri 8:00–17:00, Sat 9:00–17:00', latitude: 52.3612, longitude: 4.8745 },
  { id: 'c4', name: 'Headfirst Coffee', hours: 'Mon–Sun 8:00–18:00', latitude: 52.3703, longitude: 4.9014 },
  { id: 'c5', name: 'Black Gold Coffee', hours: 'Mon–Sun 8:30–18:00', latitude: 52.3671, longitude: 4.9044 },
];

export default function MapScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isListView, setIsListView] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({});

  const bikeDetailRef = useRef<BottomSheetModal>(null);
  const filterSheetRef = useRef<BottomSheetModal>(null);
  const cafeDetailRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['45%'], []);
  const cafeSnapPoints = useMemo(() => ['55%'], []);

  const filteredBikes = useMemo(() => {
    const loc = userLocation ?? { latitude: 52.3676, longitude: 4.9041 };
    return bikes
      .filter(bike => {
        if (activeFilters.battery) {
          if (activeFilters.battery === 'low' && bike.batteryPct > 40) return false;
          if (activeFilters.battery === 'med' && (bike.batteryPct <= 40 || bike.batteryPct > 75)) return false;
          if (activeFilters.battery === 'high' && bike.batteryPct <= 75) return false;
        }
        if (activeFilters.price) {
          if (activeFilters.price === 'low' && bike.pricePerMin > 0.22) return false;
          if (activeFilters.price === 'med' && (bike.pricePerMin <= 0.22 || bike.pricePerMin > 0.27)) return false;
          if (activeFilters.price === 'high' && bike.pricePerMin <= 0.27) return false;
        }
        if (activeFilters.type && bike.type !== activeFilters.type) return false;
        return true;
      })
      .map(bike => ({
        ...bike,
        distanceKm: haversineKm(loc.latitude, loc.longitude, bike.latitude, bike.longitude),
      }));
  }, [bikes, activeFilters, userLocation]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setUserLocation({ latitude: 52.3676, longitude: 4.9041 });
        } else {
          const pos = await Location.getCurrentPositionAsync({});
          setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        }
        const nearby = await bikeService.getNearbyBikes();
        setBikes(nearby);
      } catch (err) {
        console.error('MapScreen init error:', err);
        setUserLocation({ latitude: 52.3676, longitude: 4.9041 });
      }
    })();
  }, []);

  const handleMarkerPress = useCallback((bike: Bike) => {
    setSelectedBike(bike);
    bikeDetailRef.current?.present();
  }, []);

  const handleCafeMarkerPress = useCallback((cafe: Cafe) => {
    setSelectedCafe(cafe);
    cafeDetailRef.current?.present();
  }, []);

  const handleFilterPress = useCallback(() => {
    filterSheetRef.current?.present();
  }, []);

  const handleApplyFilters = useCallback((filters: FilterState) => {
    setActiveFilters(filters);
    filterSheetRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    [],
  );

  const sortedBikes = useMemo(
    () => [...filteredBikes].sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)),
    [filteredBikes],
  );

  const handleBikeSelect = useCallback((bike: Bike) => {
    setSelectedBike(bike);
    bikeDetailRef.current?.present();
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapLibreGL.MapView
        style={StyleSheet.absoluteFill}
        styleURL="https://demotiles.maplibre.org/style.json"
      >
        <MapLibreGL.Camera
          centerCoordinate={[4.9041, 52.3676]}
          zoomLevel={13}
        />
        <MapLibreGL.UserLocation />
        {filteredBikes.map(bike => (
          <MapLibreGL.PointAnnotation
            key={bike.id}
            id={`bike-${bike.id}`}
            coordinate={[bike.longitude, bike.latitude]}
            onSelected={() => handleMarkerPress(bike)}
          >
            <View>
              <BikeMarker />
            </View>
          </MapLibreGL.PointAnnotation>
        ))}
        {MOCK_CAFES.map(cafe => (
          <MapLibreGL.PointAnnotation
            key={cafe.id}
            id={`cafe-${cafe.id}`}
            coordinate={[cafe.longitude, cafe.latitude]}
            onSelected={() => handleCafeMarkerPress(cafe)}
          >
            <View>
              <CafeMarker />
            </View>
          </MapLibreGL.PointAnnotation>
        ))}
      </MapLibreGL.MapView>

      <IconButton
        icon="filter-variant"
        onPress={handleFilterPress}
        iconColor={DSColors.textOnPrimary}
        containerColor={DSColors.primary}
        style={styles.filterButton}
      />

      {!isListView && (
        <FAB
          icon="format-list-bulleted"
          label="List view"
          color={DSColors.textOnPrimary}
          style={styles.fab}
          onPress={() => setIsListView(true)}
        />
      )}

      <BottomSheetModal
        ref={bikeDetailRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BikeDetailSheet
          bike={selectedBike}
          onReserve={() => {
              if (!selectedBike) return;
              bikeDetailRef.current?.dismiss();
              navigation.navigate('BookingStack', { screen: 'BookingConfirmation', params: { bike: selectedBike } });
            }}
          onGetDirections={() => {
              if (!selectedBike) return;
              bikeDetailRef.current?.dismiss();
              navigation.navigate('NavStack', { screen: 'NavigateToBike', params: { bike: selectedBike } });
            }}
        />
      </BottomSheetModal>

      <BottomSheetModal
        ref={cafeDetailRef}
        snapPoints={cafeSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <CafeDetailSheet
          cafe={selectedCafe}
          userLocation={userLocation}
          onGetDirections={() => {
            if (!selectedCafe) return;
            cafeDetailRef.current?.dismiss();
            navigation.navigate('NavStack', { screen: 'NavigateToPoi', params: { name: selectedCafe.name, location: { latitude: selectedCafe.latitude, longitude: selectedCafe.longitude } } });
          }}
        />
      </BottomSheetModal>

      <BottomSheetModal
        ref={filterSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <FilterSheet
          initialFilters={activeFilters}
          onApply={handleApplyFilters}
        />
      </BottomSheetModal>

      {filteredBikes.length === 0 && bikes.length > 0 && !isListView && (
        <View style={styles.emptyOverlay}>
          <Text style={styles.emptyText}>No bikes match your filters.</Text>
        </View>
      )}

      {isListView && (
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Nearby Bikes</Text>
            <IconButton
              icon="map"
              onPress={() => setIsListView(false)}
              iconColor={DSColors.textPrimary}
              accessibilityLabel="Switch to map view"
            />
          </View>
          <BikeListView bikes={sortedBikes} onSelectBike={handleBikeSelect} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    position: 'absolute',
    top: 52,
    right: 12,
    zIndex: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 88,
    right: 16,
    zIndex: 10,
    backgroundColor: DSColors.primary,
  },
  emptyOverlay: {
    position: 'absolute',
    bottom: 140,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  emptyText: {
    ...DSTypography.body,
    color: DSColors.textPrimary,
    backgroundColor: DSColors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  listContainer: {
    flex: 1,
    backgroundColor: DSColors.background,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DSColors.border,
  },
  listTitle: {
    ...DSTypography.heading,
    color: DSColors.textPrimary,
  },
});
