import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
  label?: string;
  isDefault: boolean;
}

interface AddressStore {
  savedAddresses: SavedAddress[];
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  updateAddress: (id: string, address: Partial<SavedAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getDefaultAddress: () => SavedAddress | undefined;
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      savedAddresses: [],

      addAddress: (address) => {
        const id = `addr_${Date.now()}`;
        set((state) => ({
          savedAddresses: [
            ...state.savedAddresses.map(a => 
              address.isDefault ? { ...a, isDefault: false } : a
            ),
            { ...address, id }
          ]
        }));
      },

      updateAddress: (id, updates) => {
        set((state) => ({
          savedAddresses: state.savedAddresses.map((addr) => {
            if (addr.id === id) {
              return { ...addr, ...updates };
            }
            if (updates.isDefault) {
              return { ...addr, isDefault: false };
            }
            return addr;
          })
        }));
      },

      deleteAddress: (id) => {
        set((state) => ({
          savedAddresses: state.savedAddresses.filter((addr) => addr.id !== id)
        }));
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          savedAddresses: state.savedAddresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === id
          }))
        }));
      },

      getDefaultAddress: () => {
        return get().savedAddresses.find((addr) => addr.isDefault);
      },
    }),
    {
      name: 'address-storage',
    }
  )
);
