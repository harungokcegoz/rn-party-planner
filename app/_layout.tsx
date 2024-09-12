import React from "react";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider } from "tamagui";

import CalendarInitializer from "../components/CalendarInitializer";
import ContactsInitializer from "../components/ContactsInitializer";
import AppNavigation from "../components/Navigation";
import config from "../tamagui.config";

export default function Layout() {
  return (
    <TamaguiProvider config={config}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <AppNavigation />
          <CalendarInitializer />
          <ContactsInitializer />
        </SafeAreaView>
      </SafeAreaProvider>
    </TamaguiProvider>
  );
}
