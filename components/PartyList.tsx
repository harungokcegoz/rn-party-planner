import React from "react";
import { FlatList } from "react-native";
import { Text, View } from "tamagui";

import { usePartyViewModel } from "../view-models/PartyViewModel";

import PartyCard from "./PartyCard";

export const PartyList: React.FC = () => {
  const { getParties } = usePartyViewModel();

  if (getParties.length === 0) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Text>No parties yet. Add a new party to get started!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={getParties}
      renderItem={({ item }) => <PartyCard party={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    />
  );
};
