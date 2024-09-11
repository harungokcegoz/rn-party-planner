import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import { memo } from "react";
import { Card, Text, XStack, YStack, Button } from "tamagui";

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
        <Card.Header>
          <Text fontSize="$6" fontWeight="bold" color={colors.secondary}>
            {party.name}
          </Text>
        </Card.Header>
        <Card.Footer padded>
          <XStack justifyContent="space-between" space="$2" flex={1}>
            <YStack>
              <Text fontSize="$3" color={colors.secondary}>
                {party.description}
              </Text>
              <Text fontSize="$2" color={colors.secondary} marginTop="$1">
                {format(new Date(party.date), "PPP")}
              </Text>
              <Text fontSize="$2" color={colors.secondary}>
                Invitees: {party.invitees.length}
              </Text>
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
