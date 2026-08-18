import type { ActiveRide, RideSummary } from '../types/ride';
import type { Bike } from '../types/bike';

export interface RideService {
  startRide(bike: Bike): Promise<ActiveRide>;
  endRide(rideId: string, bike: Bike, durationSec: number): Promise<RideSummary>;
  getRideHistory(): RideSummary[];
}

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const rideHistory: RideSummary[] = [];

const mockRideService: RideService = {
  async startRide(bike: Bike) {
    await delay(500);
    return {
      id: 'ride-' + Date.now(),
      bikeId: bike.id,
      bikeName: bike.name,
      startTime: new Date().toISOString(),
      batteryPct: bike.batteryPct,
      pricePerMin: bike.pricePerMin,
    };
  },

  async endRide(rideId: string, bike: Bike, durationSec: number) {
    await delay(500);
    const durationMin = durationSec / 60;
    const costEur = parseFloat((0.5 + durationMin * bike.pricePerMin).toFixed(2));
    const distanceKm = parseFloat((durationMin * 0.25).toFixed(1));
    const summary: RideSummary = {
      id: rideId,
      bikeId: bike.id,
      bikeName: bike.name,
      startTime: new Date(Date.now() - durationSec * 1000).toISOString(),
      endTime: new Date().toISOString(),
      durationMin,
      costEur,
      distanceKm,
    };
    rideHistory.unshift(summary);
    return summary;
  },

  getRideHistory() {
    return [...rideHistory];
  },
};

export const rideService: RideService = mockRideService;
