import * as Calendar from "expo-calendar";
import * as Contacts from "expo-contacts";
import * as SMS from "expo-sms";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";

import { Contact, Party } from "../model/models";
import { usePartyStore } from "../model/store/useStore";

export const usePartyViewModel = () => {
  const { parties, addParty, deleteParty, updateParties } = usePartyStore();
  const [partyToDelete, setPartyToDelete] = useState<string | null>(null);
  const [partyToCreate, setPartyToCreate] = useState<Party | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

  const addToCalendar = useCallback(async (party: Party) => {
    try {
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT,
      );
      const partiesCalendar = calendars.find((cal) => cal.title === "Parties");

      if (!partiesCalendar) {
        Alert.alert(
          "Error",
          "Parties calendar not found. Please restart the app and try again.",
        );
        return null;
      }

      const eventDetails = {
        title: party.name,
        notes: party.description,
        startDate: party.date,
        endDate: new Date(party.date.getTime() + 2 * 60 * 60 * 1000),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        location: party.place,
      };

      const eventId = await Calendar.createEventAsync(
        partiesCalendar.id,
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
  }, []);

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

  const addContactToParty = useCallback(
    async (partyId: string) => {
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === "granted") {
          const { data } = await Contacts.getContactsAsync({
            fields: [
              Contacts.Fields.PhoneNumbers,
              Contacts.Fields.Name,
              Contacts.Fields.Emails,
            ],
          });

          if (data.length > 0) {
            const contact = await Contacts.presentContactPickerAsync();

            if (contact) {
              const newContact: Contact = {
                id: contact.id || "",
                name:
                  `${contact.firstName || ""} ${contact.lastName || ""}`.trim() ||
                  "Unknown",
                phoneNumber: contact.phoneNumbers
                  ? contact.phoneNumbers[0].number || ""
                  : "",
                email: contact.emails ? contact.emails[0].email || "" : "",
              };

              const updatedParties = parties.map((party) => {
                if (party.id === partyId) {
                  // Check if the contact is already in the party
                  const isContactAlreadyInvited = party.invitees.some(
                    (invitee) => invitee.id === newContact.id,
                  );

                  if (isContactAlreadyInvited) {
                    Alert.alert(
                      "Info",
                      `${newContact.name} is already invited to this party.`,
                    );
                    return party;
                  } else {
                    Alert.alert(
                      "Success",
                      `${newContact.name} added to the party!`,
                    );
                  }

                  return {
                    ...party,
                    invitees: [...party.invitees, newContact],
                  };
                }
                return party;
              });

              updateParties(updatedParties);
            }
          } else {
            Alert.alert("No Contacts", "No contacts found on your device.");
          }
        } else {
          Alert.alert(
            "Permission Denied",
            "Unable to access contacts. Please grant permission in your device settings.",
          );
        }
      } catch (error) {
        console.error("Error accessing contacts:", error);
        Alert.alert("Error", "Failed to access contacts. Please try again.");
      }
    },
    [parties, updateParties],
  );

  const sendInvitations = useCallback(async (party: Party) => {
    try {
      const phoneNumbers = party.invitees
        .map((invitee) => invitee.phoneNumber)
        .filter(Boolean);

      if (phoneNumbers.length === 0) {
        Alert.alert("Error", "No valid phone numbers found for invitees.");
        return;
      }

      const message = `You're invited to ${party.name}!

          Date: ${party.date.toLocaleString()}
          Location: ${party.place}

          Description: ${party.description}

          We hope to see you there!`;

      const isAvailable = await SMS.isAvailableAsync();

      if (isAvailable) {
        const { result } = await SMS.sendSMSAsync(phoneNumbers, message);

        if (result === "sent") {
          Alert.alert("Success", "Invitations sent successfully!");
        } else {
          Alert.alert("Info", "SMS composer closed without sending.");
        }
      } else {
        Alert.alert("Error", "SMS is not available on this device.");
      }
    } catch (error) {
      console.error("Error sending invitations:", error);
      Alert.alert("Error", "Failed to send invitations. Please try again.");
    }
  }, []);

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
    addContactToParty,
    selectedContacts,
    sendInvitations,
  };
};
