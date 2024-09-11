import * as Calendar from "expo-calendar";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

import { Party } from "../model/models";
import { usePartyStore } from "../model/store/useStore";

export const usePartyViewModel = () => {
  const { parties, addParty, deleteParty } = usePartyStore();
  const [partyToDelete, setPartyToDelete] = useState<string | null>(null);
  const [partyToCreate, setPartyToCreate] = useState<{
    party: Party;
    place: string;
  } | null>(null);

  const addToCalendar = async (party: Party, place: string) => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT,
        );
        const defaultCalendar =
          calendars.find((cal) => cal.isPrimary) || calendars[0];

        if (defaultCalendar) {
          const eventDetails = {
            title: party.name,
            notes: party.description,
            startDate: party.date,
            endDate: new Date(party.date.getTime() + 2 * 60 * 60 * 1000), // Assuming 2-hour duration
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            location: place,
          };

          await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
          Alert.alert("Success", "Party added to your calendar!");
        }
      } else {
        Alert.alert(
          "Permission required",
          "Please allow calendar access to add the party to your calendar.",
        );
      }
    } catch (error) {
      console.error("Error adding event to calendar:", error);
      Alert.alert(
        "Error",
        "Failed to add party to your calendar. Please try again.",
      );
    }
  };

  const handleAddParty = useCallback((party: Party, place: string) => {
    setPartyToCreate({ party, place });
  }, []);

  const confirmAddParty = useCallback(() => {
    if (partyToCreate) {
      const newParty = {
        ...partyToCreate.party,
        id: Date.now().toString(),
      };
      addParty(newParty);
      addToCalendar(newParty, partyToCreate.place);
      setPartyToCreate(null);
    }
  }, [addParty, partyToCreate]);

  const cancelAddParty = useCallback(() => {
    setPartyToCreate(null);
  }, []);

  const handleDeleteParty = useCallback((partyId: string) => {
    setPartyToDelete(partyId);
  }, []);

  const confirmDeleteParty = useCallback(() => {
    if (partyToDelete) {
      deleteParty(partyToDelete);
      setPartyToDelete(null);
    }
  }, [deleteParty, partyToDelete]);

  const cancelDeleteParty = useCallback(() => {
    setPartyToDelete(null);
  }, []);

  const getParties = useMemo(() => parties, [parties]);

  return {
    handleAddParty,
    getParties,
    handleDeleteParty,
    confirmDeleteParty,
    cancelDeleteParty,
    partyToDelete,
    confirmAddParty,
    cancelAddParty,
    partyToCreate,
  };
};
