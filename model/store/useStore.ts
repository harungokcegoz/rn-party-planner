import { create } from "zustand";

import { Party } from "../models";

interface PartyStore {
  parties: Party[];
  addParty: (party: Party) => void;
  updateParties: (updatedParties: Party[]) => void;
  addInvitee: (partyId: string, invitee: string) => void;
  deleteParty: (partyId: string) => void;
}

export const usePartyStore = create<PartyStore>((set) => ({
  parties: [],
  addParty: (party) => set((state) => ({ parties: [...state.parties, party] })),
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
}));
