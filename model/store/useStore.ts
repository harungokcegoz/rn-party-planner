import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Party, Contact } from "../models";

interface PartyStore {
  parties: Party[];
  addParty: (party: Party) => void;
  updateParties: (updatedParties: Party[]) => void;
  addInvitee: (partyId: string, invitee: Contact) => void;
  deleteParty: (partyId: string) => void;
}

export const usePartyStore = create<PartyStore>()(
  persist(
    (set) => ({
      parties: [],
      addParty: (party) =>
        set((state) => ({ parties: [...state.parties, party] })),
      updateParties: (updatedParties) => set({ parties: updatedParties }),
      addInvitee: (partyId, invitee) =>
        set((state) => ({
          parties: state.parties.map((party) =>
            party.id === partyId
              ? { ...party, invitees: [...party.invitees, invitee] }
              : party,
          ),
        })),
      deleteParty: (partyId) =>
        set((state) => ({
          parties: state.parties.filter((party) => party.id !== partyId),
        })),
    }),
    {
      name: "party-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
