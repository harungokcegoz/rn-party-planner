import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import { memo } from "react";
import { Image } from "react-native";
import { Card, Text, XStack, YStack, Button, View } from "tamagui";

import { Party } from "../model/models";
import { colors } from "../styles/colors";

interface PartyCardProps {
  party: Party;
  onDeleteParty: (partyId: string) => void;
}

const PartyCard: React.FC<PartyCardProps> = ({ party, onDeleteParty }) => {
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
        <Card.Header
          borderBottomWidth={1}
          borderBottomColor={colors.gray}
          paddingHorizontal="$4"
          paddingVertical="$3"
        >
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
                <Text fontSize="$2" color={colors.secondary}>
                  {party.place}
                </Text>
              </View>
              <View
                display="flex"
                flexDirection="row"
                alignItems="center"
                space="$2"
              >
                <Ionicons
                  name="people-outline"
                  size={13}
                  color={colors.primary}
                />
                <Text fontSize="$2" color={colors.secondary}>
                  {party.invitees.length}
                </Text>
              </View>
            </YStack>
          </XStack>
        </Card.Footer>
      </YStack>
      <YStack
        backgroundColor={colors.secondary}
        paddingVertical="$3"
        justifyContent="space-between"
        width="14%"
        borderTopRightRadius="$4"
        borderBottomRightRadius="$4"
      >
        <Button
          size="$2"
          backgroundColor="transparent"
          marginTop="$2"
          onPress={() => {
            /* TODO: Implement send invitation */
          }}
        >
          <Ionicons name="share-outline" size={20} color={colors.cta} />
        </Button>
        {/* TODO: Show invitees */}
        <Button
          size="$2"
          backgroundColor="transparent"
          marginTop="$2"
          onPress={() => {
            /* TODO: Implement show invitees */
          }}
        >
          <Ionicons name="people-outline" size={20} color={colors.cta} />
        </Button>
        <Button
          size="$2"
          backgroundColor="transparent"
          marginTop="$2"
          onPress={() => onDeleteParty(party.id)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.cta} />
        </Button>
      </YStack>
    </Card>
  );
};

export default memo(PartyCard);
