import { create } from "zustand";

import { Party } from "../model/models";

interface PartyStore {
  parties: Party[];
  addParty: (party: Party) => void;
  addInvitee: (partyId: string, invitee: Contact) => void;
  deleteParty: (partyId: string) => void;
}

export const usePartyStore = create<PartyStore>((set) => ({
  parties: [],
  addParty: (party) => set((state) => ({ parties: [...state.parties, party] })),
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
