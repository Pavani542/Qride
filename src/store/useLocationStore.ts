import { create } from "zustand";
import { Location } from "@/types";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LocationState {
  currentLocation: Location | null;
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  recentLocations: Location[];
  setCurrentLocation: (location: Location) => void;
  setPickupLocation: (location: Location) => void;
  setDropoffLocation: (location: Location) => void;
  addRecentLocation: (location: Location) => void;
  swapLocations: () => void;
  clearLocations: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      currentLocation: null,
      pickupLocation: null,
      dropoffLocation: null,
      recentLocations: [],
      
      setCurrentLocation: (location) => set({ currentLocation: location }),
      
      setPickupLocation: (location) => {
        set({ pickupLocation: location });
        get().addRecentLocation(location);
      },
      
      setDropoffLocation: (location) => {
        set({ dropoffLocation: location });
        get().addRecentLocation(location);
      },
      
      addRecentLocation: (location) => {
        if (!location.address) return;
        
        const recentLocations = get().recentLocations;
        const exists = recentLocations.some(
          (loc) => loc.address === location.address
        );
        
        if (!exists) {
          set({
            recentLocations: [location, ...recentLocations].slice(0, 10), // Increased to 10
          });
        }
      },
      
      swapLocations: () => {
        const { pickupLocation, dropoffLocation } = get();
        set({
          pickupLocation: dropoffLocation,
          dropoffLocation: pickupLocation,
        });
      },
      
      clearLocations: () => {
        set({
          pickupLocation: null,
          dropoffLocation: null,
        });
      },
    }),
    {
      name: "rapido-locations",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        recentLocations: state.recentLocations,
      }),
    }
  )
);