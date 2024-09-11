import React from "react";
import { SafeAreaView } from "react-native";
import { TamaguiProvider } from "tamagui";

import AppNavigation from "../components/Navigation";
import config from "../tamagui.config";

export default function Layout() {
  return (
    <TamaguiProvider config={config}>
      <SafeAreaView style={{ flex: 1 }}>
        <AppNavigation />
      </SafeAreaView>
    </TamaguiProvider>
  );
}
