import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Reservation, ReservationStatus } from '@/types';

interface ReservationStore {
  reservations: Reservation[];
  createReservation: (data: Omit<Reservation, 'id' | 'status'>) => Reservation;
  updateReservationStatus: (id: string, status: ReservationStatus) => void;
  cancelReservation: (id: string) => void;
  getUpcomingReservations: () => Reservation[];
}

export const useReservationStore = create<ReservationStore>()(
  persist(
    (set, get) => ({
      reservations: [],

      createReservation: (data) => {
        const newReservation: Reservation = {
          ...data,
          id: `RES-${Date.now()}`,
          status: 'pending',
        };

        set((state) => ({
          reservations: [newReservation, ...state.reservations],
        }));

        return newReservation;
      },

      updateReservationStatus: (id, status) => {
        set((state) => ({
          reservations: state.reservations.map((res) =>
            res.id === id ? { ...res, status } : res
          ),
        }));
      },

      cancelReservation: (id) => {
        set((state) => ({
          reservations: state.reservations.map((res) =>
            res.id === id ? { ...res, status: 'cancelled' } : res
          ),
        }));
      },

      getUpcomingReservations: () => {
        const now = new Date();
        return get().reservations.filter(
          (res) => new Date(res.date) >= now && res.status !== 'cancelled'
        );
      },
    }),
    {
      name: 'reservation-storage',
    }
  )
);
