export interface Bike {
  id: string;
  name: string;
  type: 'standard' | 'speed' | 'cargo';
  batteryPct: number;       // 0–100
  pricePerMin: number;      // EUR, e.g. 0.25
  latitude: number;
  longitude: number;
  distanceKm?: number;      // computed client-side
}

export interface FilterState {
  battery?: 'low' | 'med' | 'high';
  price?: 'low' | 'med' | 'high';
  type?: 'standard' | 'speed' | 'cargo';
}
