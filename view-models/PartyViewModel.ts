import { useCallback, useMemo } from "react";

import { Party } from "../model/models";
import { usePartyStore } from "../model/store/useStore";

export const usePartyViewModel = () => {
  const { parties, addParty } = usePartyStore();

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

  const getParties = useMemo(() => parties, [parties]);

  return {
    handleAddParty,
    getParties,
  };
};
