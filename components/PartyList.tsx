import { format } from "date-fns";
import React from "react";
import { FlatList } from "react-native";
import { Text, View, Button } from "tamagui";

import { usePartyStore } from "../model/store/useStore";

export const PartyList = () => {
  const parties = usePartyStore((state) => state.parties);

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
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View
          padding="$2"
          marginBottom="$2"
          borderRadius="$2"
          borderWidth={1}
          borderColor="$gray5"
        >
          <Text fontSize="$6" fontWeight="bold">
            {item.name}
          </Text>
          <Text>{item.description}</Text>
          <Text>{format(item.date, "PPP")}</Text>
          <Text>Invitees: {item.invitees.length}</Text>
          <Button
            onPress={() => {
              /* TODO: Implement send invitation */
            }}
          >
            Send Invitations
          </Button>
        </View>
      )}
    />
  );
};
