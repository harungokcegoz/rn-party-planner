import * as Calendar from "expo-calendar";
import React, { useEffect } from "react";
import { Alert } from "react-native";

const CalendarInitializer: React.FC = () => {
  useEffect(() => {
    const createPartiesCalendar = async () => {
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
          } else {
            console.log(
              "Parties calendar already exists with ID:",
              partiesCalendar.id,
            );
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
    };

    createPartiesCalendar();
  }, []);

  return null;
};

export default CalendarInitializer;
