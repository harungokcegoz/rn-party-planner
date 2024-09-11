import React from "react";
import { FlatList } from "react-native";
import { Text, View } from "tamagui";

import { Party } from "../model/models";
import PartyCard from "./PartyCard";

interface PartyListProps {
  parties: Party[];
  onDeleteParty: (partyId: string) => void;
}

export const PartyList: React.FC<PartyListProps> = ({ parties, onDeleteParty }) => {
  if (parties.length === 0) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Text>No parties yet. Add a new party to get started!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={parties}
      renderItem={({ item }) => <PartyCard party={item} onDeleteParty={onDeleteParty} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    />
  );
};
