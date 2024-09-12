import { format, startOfWeek, endOfWeek, endOfMonth } from "date-fns";
import React from "react";
import { Text, YStack } from "tamagui";

import { PartyList } from "../components/PartyList";
import { colors } from "../styles/colors";
import { usePartyViewModel } from "../view-models/PartyViewModel";

const Upcoming: React.FC = () => {
  const { getParties, handleDeleteParty } = usePartyViewModel();
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  const monthEnd = endOfMonth(today);

  const weekParties = getParties.filter(
    (party) => party.date >= weekStart && party.date <= weekEnd,
  );

  const monthParties = getParties.filter(
    (party) => party.date > weekEnd && party.date <= monthEnd,
  );

  return (
    <YStack flex={1} padding="$4" space="$4" marginTop="$6">
      <Text fontSize="$8" fontWeight="bold" color={colors.primary}>
        Today {format(today, "MMMM d, yyyy")}
      </Text>

      <YStack space="$2">
        <Text
          fontSize="$5"
          fontWeight="bold"
          color={colors.secondary}
          borderBottomWidth={1}
          borderBottomColor={colors.primary}
          paddingBottom={8}
        >
          This Week's Parties
        </Text>
        {weekParties.length > 0 ? (
          <PartyList parties={weekParties} onDeleteParty={handleDeleteParty} />
        ) : (
          <Text>No parties this week</Text>
        )}
      </YStack>

      <YStack space="$2">
        <Text
          fontSize="$5"
          fontWeight="bold"
          color={colors.secondary}
          borderBottomWidth={1}
          borderBottomColor={colors.primary}
          paddingBottom={8}
        >
          Upcoming Parties This Month
        </Text>
        {monthParties.length > 0 ? (
          <PartyList parties={monthParties} onDeleteParty={handleDeleteParty} />
        ) : (
          <Text>No parties this month</Text>
        )}
      </YStack>
    </YStack>
  );
};

export default Upcoming;
