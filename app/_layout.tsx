import React from "react";
import { SafeAreaView } from "react-native";
import { TamaguiProvider } from "tamagui";

import CalendarInitializer from "../components/CalendarInitializer";
import ContactsInitializer from "../components/ContactsInitializer";
import AppNavigation from "../components/Navigation";
import config from "../tamagui.config";

export default function Layout() {
  return (
    <TamaguiProvider config={config}>
      <SafeAreaView style={{ flex: 1 }}>
        <AppNavigation />
        <CalendarInitializer />
        <ContactsInitializer />
      </SafeAreaView>
    </TamaguiProvider>
  );
}
