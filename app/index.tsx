import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Button, YStack } from "tamagui";

import CreatePartyForm from "../components/CreatePartyForm";
import { PartyList } from "../components/PartyList";
import { colors } from "../styles/colors";
import { usePartyViewModel } from "../view-models/PartyViewModel";

const Homepage = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { handleAddParty } = usePartyViewModel();

  return (
    <View
      flex={1}
      paddingVertical="$10"
      paddingHorizontal="$4"
      backgroundColor={colors.background}
    >
      <Button
        onPress={() => setIsCreating(!isCreating)}
        backgroundColor={isCreating ? colors.red : colors.cta}
        color={colors.secondary}
        animation="quick"
        pressStyle={{ scale: 0.97 }}
        borderTopLeftRadius="$4"
        borderTopRightRadius="$4"
        borderBottomLeftRadius={isCreating ? "$0" : "$4"}
        borderBottomRightRadius={isCreating ? "$0" : "$4"}
      >
        <Ionicons
          name={isCreating ? "close-outline" : "add-outline"}
          size={25}
          color={colors.secondary}
        />
        {isCreating ? "Cancel" : "Create New Party"}
      </Button>

      {isCreating && (
        <YStack
          animation="quick"
          enterStyle={{ opacity: 0, scale: 0.9 }}
          exitStyle={{ opacity: 0, scale: 0.9 }}
          marginBottom="$4"
        >
          <CreatePartyForm
            onCreateParty={handleAddParty}
            onCancel={() => setIsCreating(false)}
          />
        </YStack>
      )}
      <PartyList />
    </View>
  );
};

export default Homepage;
