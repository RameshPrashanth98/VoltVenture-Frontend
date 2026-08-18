export interface ActiveRide {
  id: string;
  bikeId: string;
  bikeName: string;
  startTime: string;
  batteryPct: number;
  pricePerMin: number;
}

export interface RideSummary {
  id: string;
  bikeId: string;
  bikeName: string;
  startTime: string;
  endTime: string;
  durationMin: number;
  costEur: number;
  distanceKm: number;
}
