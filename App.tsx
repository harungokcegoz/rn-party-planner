import React from "react";
import { SafeAreaView } from "react-native";
import { TamaguiProvider, Text } from "tamagui";

import config from "./tamagui.config";

export default function Layout() {
  return (
    <TamaguiProvider config={config}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Hello World</Text>
      </SafeAreaView>
    </TamaguiProvider>
  );
}
