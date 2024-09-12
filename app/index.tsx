import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Button, YStack } from "tamagui";

import ConfirmationDialog from "../components/ConfirmationDialog";
import CreatePartyForm from "../components/CreatePartyForm";
import { PartyList } from "../components/PartyList";
import { usePartyStore } from "../model/store/useStore";
import { colors } from "../styles/colors";
import { usePartyViewModel } from "../view-models/PartyViewModel";

const Homepage: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { parties } = usePartyStore();
  const {
    handleAddParty,
    handleDeleteParty,
    confirmDeleteParty,
    cancelDeleteParty,
    partyToDelete,
    confirmAddParty,
    cancelAddParty,
    partyToCreate,
  } = usePartyViewModel();

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
        >
          <CreatePartyForm
            onCreateParty={handleAddParty}
            onCancel={() => setIsCreating(false)}
          />
        </YStack>
      )}
      <View>
        <PartyList parties={parties} onDeleteParty={handleDeleteParty} />
      </View>
      <ConfirmationDialog
        isOpen={!!partyToDelete}
        onClose={cancelDeleteParty}
        onConfirm={confirmDeleteParty}
        title="Delete Party"
        description="Are you sure you want to delete this party? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
      <ConfirmationDialog
        isOpen={!!partyToCreate}
        onClose={cancelAddParty}
        onConfirm={confirmAddParty}
        title="Create Party"
        description="Are you sure you want to create this party and add it to your calendar?"
        confirmText="Create"
        cancelText="Cancel"
      />
    </View>
  );
};

export default Homepage;
