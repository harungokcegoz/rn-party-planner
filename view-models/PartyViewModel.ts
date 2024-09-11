import * as Calendar from "expo-calendar";
import { useCallback, useMemo, useState, useEffect } from "react";
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
  const [partiesCalendarId, setPartiesCalendarId] = useState<string | null>(
    null,
  );

  const createPartiesCalendar = useCallback(async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT,
        );
        const partiesCalendar = calendars.find(
          (cal) => cal.title === "Parties",
        );

        if (!partiesCalendar) {
          const newCalendarId = await Calendar.createCalendarAsync({
            title: "Parties",
            color: "#4285F4",
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: calendars.find((cal) => cal.isPrimary)?.source.id,
            name: "Parties",
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
            ownerAccount: "personal",
          });
          console.log("Created new Parties calendar with ID:", newCalendarId);
          setPartiesCalendarId(newCalendarId);
        } else {
          console.log(
            "Parties calendar already exists with ID:",
            partiesCalendar.id,
          );
          setPartiesCalendarId(partiesCalendar.id);
        }
      } else {
        throw new Error("Calendar permission not granted");
      }
    } catch (error) {
      console.error("Error creating Parties calendar:", error);
      Alert.alert(
        "Error",
        "Failed to create Parties calendar. Please try again.",
      );
    }
  }, []);

  useEffect(() => {
    createPartiesCalendar();
  }, [createPartiesCalendar]);

  const addToCalendar = useCallback(
    async (party: Party, place: string) => {
      if (!partiesCalendarId) {
        Alert.alert("Error", "Parties calendar not found. Please try again.");
        return;
      }

      try {
        const eventDetails = {
          title: party.name,
          notes: party.description,
          startDate: party.date,
          endDate: new Date(party.date.getTime() + 2 * 60 * 60 * 1000),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          location: place,
        };

        console.log("Attempting to add event:", eventDetails);
        const eventId = await Calendar.createEventAsync(
          partiesCalendarId,
          eventDetails,
        );
        console.log("Event added successfully. Event ID:", eventId);

        if (eventId) {
          Alert.alert("Success", "Party added to your Parties calendar");
        } else {
          throw new Error("Failed to add event: No event ID returned");
        }
      } catch (error) {
        console.error("Error adding event to calendar:", error);
        Alert.alert(
          "Error",
          `Failed to add party to your calendar: ${error.message}. Please try again.`,
        );
      }
    },
    [partiesCalendarId],
  );

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
  }, [addParty, partyToCreate, addToCalendar]);

  const handleAddParty = useCallback((party: Party, place: string) => {
    setPartyToCreate({ party, place });
  }, []);

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
