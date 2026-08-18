import { Booking } from '../types/booking';

export interface BookingService {
  reserveBike(bikeId: string): Promise<Booking>;
}

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const mockBookingService: BookingService = {
  async reserveBike(bikeId: string) {
    await delay(800);
    return {
      id: 'booking-' + Date.now(),
      bikeId,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    };
  },
};

export const bookingService: BookingService = mockBookingService;
