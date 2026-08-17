import { Bike } from '../types/bike';

export interface BikeService {
  getNearbyBikes(): Promise<Bike[]>;
}

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const mockBikes: Bike[] = [
  { id: 'b01', name: 'City Cruiser 1', type: 'standard', batteryPct: 88, pricePerMin: 0.20, latitude: 52.3720, longitude: 4.8975 },
  { id: 'b02', name: 'Speed King 1',   type: 'speed',    batteryPct: 65, pricePerMin: 0.30, latitude: 52.3650, longitude: 4.9100 },
  { id: 'b03', name: 'Cargo Hauler 1', type: 'cargo',    batteryPct: 42, pricePerMin: 0.25, latitude: 52.3590, longitude: 4.8950 },
  { id: 'b04', name: 'City Cruiser 2', type: 'standard', batteryPct: 30, pricePerMin: 0.20, latitude: 52.3730, longitude: 4.9150 },
  { id: 'b05', name: 'Speed King 2',   type: 'speed',    batteryPct: 78, pricePerMin: 0.30, latitude: 52.3610, longitude: 4.8900 },
  { id: 'b06', name: 'Cargo Hauler 2', type: 'cargo',    batteryPct: 55, pricePerMin: 0.25, latitude: 52.3700, longitude: 4.9220 },
  { id: 'b07', name: 'City Cruiser 3', type: 'standard', batteryPct: 15, pricePerMin: 0.20, latitude: 52.3560, longitude: 4.9080 },
  { id: 'b08', name: 'Speed King 3',   type: 'speed',    batteryPct: 92, pricePerMin: 0.30, latitude: 52.3680, longitude: 4.8840 },
  { id: 'b09', name: 'Cargo Hauler 3', type: 'cargo',    batteryPct: 70, pricePerMin: 0.25, latitude: 52.3620, longitude: 4.9180 },
  { id: 'b10', name: 'City Cruiser 4', type: 'standard', batteryPct: 50, pricePerMin: 0.20, latitude: 52.3750, longitude: 4.9060 },
  { id: 'b11', name: 'Speed King 4',   type: 'speed',    batteryPct: 85, pricePerMin: 0.30, latitude: 52.3640, longitude: 4.8990 },
  { id: 'b12', name: 'Cargo Hauler 4', type: 'cargo',    batteryPct: 38, pricePerMin: 0.25, latitude: 52.3580, longitude: 4.9130 },
  { id: 'b13', name: 'City Cruiser 5', type: 'standard', batteryPct: 95, pricePerMin: 0.20, latitude: 52.3710, longitude: 4.8870 },
];

const mockBikeService: BikeService = {
  async getNearbyBikes() {
    await delay(500);
    return mockBikes;
  },
};

export const bikeService: BikeService = mockBikeService;
