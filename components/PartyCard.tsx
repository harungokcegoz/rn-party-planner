import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import { memo } from "react";
import { Card, Text, XStack, YStack, Button } from "tamagui";

import { Party } from "../model/models";
import { colors } from "../styles/colors";

const PartyCard: React.FC<{ party: Party }> = ({ party }) => (
  <Card
    size="$4"
    bordered
    animation="quick"
    scale={0.9}
    hoverStyle={{ scale: 0.925 }}
    pressStyle={{ scale: 0.875 }}
    marginBottom="$2"
  >
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
        <XStack>
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
          {/* TODO: Implement delete party */}
          <Button
            size="$2"
            backgroundColor="transparent"
            marginTop="$2"
            onPress={() => {
              /* TODO: Implement delete party */
            }}
          >
            <Ionicons name="trash-outline" size={20} color={colors.cta} />
          </Button>
        </XStack>
      </XStack>
    </Card.Footer>
  </Card>
);

export default memo(PartyCard);
