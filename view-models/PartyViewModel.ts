import * as Calendar from "expo-calendar";
import * as Contacts from "expo-contacts";
import * as MailComposer from "expo-mail-composer";
import { useCallback, useMemo, useState } from "react";
import { Alert, Linking } from "react-native";

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
            fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name, Contacts.Fields.Emails],
          });

          if (data.length > 0) {
            const contact = await Contacts.presentContactPickerAsync();

            if (contact) {
              const newContact: Contact = {
                id: contact.id || "",
                name: `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Unknown",
                phoneNumber: contact.phoneNumbers ? contact.phoneNumbers[0].number || "" : "",
                email: contact.emails ? contact.emails[0].email || "" : "",
              };

              const updatedParties = parties.map((party) => {
                if (party.id === partyId) {
                  return {
                    ...party,
                    invitees: [...party.invitees, newContact],
                  };
                }
                return party;
              });

              updateParties(updatedParties);
              Alert.alert("Success", `${newContact.name} added to the party!`);
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

  const sendInvitations = useCallback(
    async (party: Party) => {
      try {
        const invitees = selectedContacts.filter((contact) =>
          party.invitees.includes(contact.id),
        );
        const to = invitees.map((contact) => contact.phoneNumber);

        const isAvailable = await MailComposer.isAvailableAsync();

        if (isAvailable) {
          const { status } = await MailComposer.composeAsync({
            subject: `Invitation to ${party.name}`,
            body: `You're invited to ${party.name}!\n\nDate: ${party.date}\nLocation: ${party.place}\n\nDescription: ${party.description}`,
            recipients: to,
          });

          if (status === "sent") {
            Alert.alert("Success", "Invitations sent successfully!");
          }
        } else {
          // Fallback to mailto: URL
          const mailtoUrl = `mailto:${to.join(",")}?subject=${encodeURIComponent(
            `Invitation to ${party.name}`,
          )}&body=${encodeURIComponent(
            `You're invited to ${party.name}!\n\nDate: ${party.date}\nLocation: ${party.place}\n\nDescription: ${party.description}`,
          )}`;
          Linking.openURL(mailtoUrl);
        }
      } catch (error) {
        console.error("Error sending invitations:", error);
        Alert.alert("Error", "Failed to send invitations. Please try again.");
      }
    },
    [selectedContacts],
  );

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
