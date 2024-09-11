import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import { memo } from "react";
import React from "react";
import { Image } from "react-native";
import { Alert } from "react-native";
import { Card, Text, XStack, YStack, Button, View } from "tamagui";

import { Party } from "../model/models";
import { colors } from "../styles/colors";
import { usePartyViewModel } from "../view-models/PartyViewModel";

interface PartyCardProps {
  party: Party;
  onDeleteParty: (partyId: string) => void;
}

const PartyCard: React.FC<PartyCardProps> = ({ party, onDeleteParty }) => {
  const { sendInvitations, addContactToParty } = usePartyViewModel();

  const handleAddContact = async () => {
    try {
      await addContactToParty(party.id);
    } catch (error) {
      console.error("Error adding contact:", error);
      Alert.alert("Error", "Failed to add contact. Please try again.");
    }
  };

  return (
    <Card
      size="$4"
      bordered
      animation="quick"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      marginBottom="$2"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <YStack width="85%">
        <Card.Header paddingHorizontal="$4" paddingVertical="$3">
          <XStack alignItems="center" space="$2">
            <Text fontSize="$6" fontWeight="bold" color={colors.secondary}>
              {party.name}
            </Text>
            <Image
              source={require("../assets/partyicon.png")}
              style={{ width: 30, height: 30 }}
            />
          </XStack>
        </Card.Header>
        <Card.Footer>
          <XStack
            justifyContent="space-between"
            space="$2"
            flex={1}
            padding="$4"
          >
            <YStack space="$2">
              <View
                display="flex"
                flexDirection="row"
                alignItems="center"
                space="$2"
              >
                <Ionicons
                  name="document-outline"
                  size={13}
                  color={colors.primary}
                />
                <Text fontSize="$3" color={colors.secondary}>
                  {party.description}
                </Text>
              </View>
              <View
                display="flex"
                flexDirection="row"
                alignItems="center"
                space="$2"
              >
                <Ionicons
                  name="calendar-outline"
                  size={13}
                  color={colors.primary}
                />
                <Text
                  fontSize="$2"
                  color={colors.secondary}
                  marginTop="$1"
                  fontWeight="bold"
                >
                  {format(new Date(party.date), "PPP 'at' p")}
                </Text>
              </View>
              <View
                marginTop="$1"
                display="flex"
                flexDirection="row"
                alignItems="center"
                space="$2"
              >
                <Ionicons
                  name="location-outline"
                  size={13}
                  color={colors.primary}
                />
                <Text fontSize="$2" color={colors.secondary} fontWeight="bold">
                  {party.place}
                </Text>
              </View>
              <View
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                space="$2"
              >
                <XStack alignItems="center" space="$2">
                  <Ionicons
                    name="people-outline"
                    size={13}
                    color={colors.primary}
                  />
                  <Text fontSize="$2" color={colors.secondary}>
                    {party.invitees.length} invitees
                  </Text>
                  {party.invitees.map((invitee) => (
                    <Text
                      key={invitee.id}
                      fontSize="$2"
                      color={colors.cta}
                      fontStyle="italic"
                    >
                      {invitee.name} -
                    </Text>
                  ))}
                </XStack>
              </View>
            </YStack>
          </XStack>
        </Card.Footer>
      </YStack>
      <YStack
        backgroundColor={colors.secondary}
        paddingVertical="$5"
        justifyContent="space-between"
        width="14%"
        borderTopRightRadius="$4"
        borderBottomRightRadius="$4"
      >
        <Button
          size="$2"
          backgroundColor="transparent"
          marginTop="$2"
          onPress={() => sendInvitations(party)}
        >
          <Ionicons name="share-outline" size={20} color={colors.cta} />
        </Button>
        <Button
          size="$2"
          backgroundColor="transparent"
          marginTop="$2"
          onPress={() => onDeleteParty(party.id)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.cta} />
        </Button>
        <Button
          size="$2"
          backgroundColor="transparent"
          marginTop="$2"
          onPress={handleAddContact}
        >
          <Ionicons name="person-add-outline" size={20} color={colors.cta} />
        </Button>
      </YStack>
    </Card>
  );
};

export default memo(PartyCard);
