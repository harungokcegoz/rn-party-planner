import * as Calendar from "expo-calendar";
import { useCallback, useMemo, useState, useEffect } from "react";
import { Alert } from "react-native";

import { Party } from "../model/models";
import { usePartyStore } from "../model/store/useStore";

export const usePartyViewModel = () => {
  const { parties, addParty, deleteParty } = usePartyStore();
  const [partyToDelete, setPartyToDelete] = useState<string | null>(null);
  const [partyToCreate, setPartyToCreate] = useState<Party | null>(null);
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
    async (party: Party) => {
      if (!partiesCalendarId) {
        Alert.alert("Error", "Parties calendar not found. Please try again.");
        return null;
      }

      try {
        const eventDetails = {
          title: party.name,
          notes: party.description,
          startDate: party.date,
          endDate: new Date(party.date.getTime() + 2 * 60 * 60 * 1000),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          location: party.place,
        };

        const eventId = await Calendar.createEventAsync(
          partiesCalendarId,
          eventDetails,
        );

        if (eventId) {
          Alert.alert("Success", "Party added to your Parties calendar");
          return eventId;
        } else {
          throw new Error("Failed to add event: No event ID returned");
        }
      } catch (error) {
        console.error("Error adding event to calendar:", error);
        Alert.alert(
          "Error",
          `Failed to add party to your calendar: ${(error as Error).message}. Please try again.`,
        );
        return null;
      }
    },
    [partiesCalendarId],
  );

  const removeFromCalendar = useCallback(async (party: Party) => {
    if (!party.calendarEventId) {
      console.error("No calendar event ID found for party");
      return;
    }

    try {
      await Calendar.deleteEventAsync(party.calendarEventId);
    } catch (error) {
      console.error("Error removing event from calendar:", error);
      Alert.alert(
        "Error",
        `Failed to remove party from your calendar: ${(error as Error).message}. Please try again.`,
      );
    }
  }, []);

  const confirmAddParty = useCallback(async () => {
    if (partyToCreate) {
      const newParty = {
        ...partyToCreate,
        id: Date.now().toString(),
      };
      const eventId = await addToCalendar(newParty);
      if (eventId) {
        newParty.calendarEventId = eventId;
        addParty(newParty);
        setPartyToCreate(null);
      } else {
        Alert.alert(
          "Error",
          "Failed to add party to your calendar. Please try again.",
        );
      }
    }
  }, [addParty, partyToCreate, addToCalendar]);

  const handleAddParty = useCallback((party: Party) => {
    setPartyToCreate(party);
  }, []);

  const cancelAddParty = useCallback(() => {
    setPartyToCreate(null);
  }, []);

  const handleDeleteParty = useCallback((partyId: string) => {
    setPartyToDelete(partyId);
  }, []);

  const confirmDeleteParty = useCallback(async () => {
    if (partyToDelete) {
      const partyToRemove = parties.find((party) => party.id === partyToDelete);
      if (partyToRemove) {
        await removeFromCalendar(partyToRemove);
      }
      deleteParty(partyToDelete);
      setPartyToDelete(null);
    }
  }, [deleteParty, partyToDelete, parties, removeFromCalendar]);

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
