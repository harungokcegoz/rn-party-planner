import * as Contacts from "expo-contacts";
import React, { useEffect } from "react";
import { Alert } from "react-native";

const ContactsInitializer: React.FC = () => {
  useEffect(() => {
    const initializeContacts = async () => {
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === "granted") {
          const exampleContacts = [
            {
              name: "Alice Johnson",
              phoneNumber: "+1 (555) 123-4567",
              email: "509855@student.saxion.nl",
            },
            {
              name: "Bob Smith",
              phoneNumber: "+1 (555) 234-5678",
              email: "509855@student.saxion.nl",
            },
            {
              name: "Charlie Brown",
              phoneNumber: "+1 (555) 345-6789",
              email: "509855@student.saxion.nl",
            },
            {
              name: "Diana Prince",
              phoneNumber: "+1 (555) 456-7890",
              email: "509855@student.saxion.nl",
            },
            {
              name: "Ethan Hunt",
              phoneNumber: "+1 (555) 567-8901",
              email: "509855@student.saxion.nl",
            },
            {
              name: "Fiona Apple",
              phoneNumber: "+1 (555) 678-9012",
              email: "509855@student.saxion.nl",
            },
            {
              name: "George Lucas",
              phoneNumber: "+1 (555) 789-0123",
              email: "509855@student.saxion.nl",
            },
            {
              name: "Hannah Montana",
              phoneNumber: "+1 (555) 890-1234",
              email: "509855@student.saxion.nl",
            },
            {
              name: "Ian McKellen",
              phoneNumber: "+1 (555) 901-2345",
              email: "509855@student.saxion.nl",
            },
            {
              name: "Julia Roberts",
              phoneNumber: "+1 (555) 012-3456",
              email: "509855@student.saxion.nl",
            },
          ];

          for (const contact of exampleContacts) {
            const existingContact = await Contacts.getContactsAsync({
              name: contact.name,
              fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
            });

            if (existingContact.data.length === 0) {
              await Contacts.addContactAsync({
                [Contacts.Fields.FirstName]: contact.name.split(" ")[0],
                [Contacts.Fields.LastName]: contact.name.split(" ")[1],
                [Contacts.Fields.PhoneNumbers]: [
                  { label: "mobile", number: contact.phoneNumber },
                ],
                [Contacts.Fields.Emails]: [
                  { label: "school", email: contact.email },
                ],
              } as Contacts.Contact);
              console.log(`Added example contact: ${contact.name}`);
            } else {
              console.log(`Example contact already exists: ${contact.name}`);
            }
          }

          console.log("Finished initializing example contacts");
        } else {
          throw new Error("Contacts permission not granted");
        }
      } catch (error) {
        console.error("Error initializing contacts:", error);
        Alert.alert(
          "Error",
          "Failed to initialize example contacts. Please try again.",
        );
      }
    };

    initializeContacts();
  }, []);

  return null;
};

export default ContactsInitializer;
