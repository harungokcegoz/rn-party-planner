import { useCallback } from "react";

import { Party } from "../model/models";
import { usePartyStore } from "../model/store/useStore";

export const usePartyViewModel = () => {
  const addParty = usePartyStore((state) => state.addParty);

  const handleAddParty = useCallback(
    (party: Party) => {
      addParty({
        id: Date.now().toString(),
        name: party.name,
        description: party.description,
        date: party.date,
        invitees: [],
      });
    },
    [addParty],
  );

  return {
    handleAddParty,
  };
};
