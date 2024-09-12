import * as Calendar from "expo-calendar";
import React, { useEffect } from "react";
import { Alert, Platform } from "react-native";

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
            const writableCalendars = calendars.filter(
              (cal) => cal.source && !cal.source.isReadOnly,
            );

            if (writableCalendars.length > 0) {
              const [primaryCalendar] = writableCalendars;

              await Calendar.createCalendarAsync({
                title: "Parties",
                color: "#4285F4",
                entityType: Calendar.EntityTypes.EVENT,
                sourceId: primaryCalendar.source.id,
                name: "Parties",
                accessLevel: Calendar.CalendarAccessLevel.OWNER,
                ownerAccount: Platform.OS === "ios" ? "personal" : "work",
              });
            } else {
              console.error("No writable calendar sources available."); // {{ edit_2 }}
              Alert.alert(
                "Error",
                "No calendar accounts available that allow modifications. Please check your account settings.",
              );
            }
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
