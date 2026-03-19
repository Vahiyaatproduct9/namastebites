import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LocationType } from '../types/types';

type LocationState = {
  locations: LocationType[];
  currentLocationId: string | null;
  addLocation: (location: LocationType) => void;
  removeLocation: (id: string) => void;
  updateLocation: (location: LocationType) => void;
  setCurrentLocation: (id: string) => void;
};

export const useLocation = create<LocationState>()(
  persist(
    (set) => ({
      locations: [],
      currentLocationId: null,
      addLocation: (location) =>
        set((state) => ({ locations: [...state.locations, location] })),
      removeLocation: (id) =>
        set((state) => ({
          locations: state.locations.filter((l) => l.id !== id),
          currentLocationId: state.currentLocationId === id ? null : state.currentLocationId,
        })),
      updateLocation: (location) =>
        set((state) => ({
          locations: state.locations.map((l) => (l.id === location.id ? location : l)),
        })),
      setCurrentLocation: (id) => set({ currentLocationId: id }),
    }),
    {
      name: 'namaste-bites-location',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
