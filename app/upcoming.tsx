import { format, startOfWeek, endOfWeek, endOfMonth } from "date-fns";
import React from "react";
import { ScrollView, Text, YStack } from "tamagui";

import { PartyList } from "../components/PartyList";
import { usePartyStore } from "../model/store/useStore";
import { colors } from "../styles/colors";
import { usePartyViewModel } from "../view-models/PartyViewModel";

const Upcoming: React.FC = () => {
  const { parties } = usePartyStore();
  const { handleDeleteParty } = usePartyViewModel();
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  const monthEnd = endOfMonth(today);

  const weekParties = parties.filter((party) => {
    const partyDate = new Date(party.date);
    return partyDate >= weekStart && partyDate <= weekEnd;
  });

  const monthParties = parties.filter((party) => {
    const partyDate = new Date(party.date);
    return partyDate > weekEnd && partyDate <= monthEnd;
  });

  return (
    <YStack
      flex={1}
      padding="$4"
      space="$4"
      paddingTop="$6"
      backgroundColor={colors.background}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack space="$4">
          <Text fontSize="$8" fontWeight="bold" color={colors.primary}>
            {format(today, "MMMM d, yyyy")}
          </Text>

          <YStack space="$2">
            <Text
              fontSize="$5"
              fontWeight="bold"
              color={colors.secondary}
              borderBottomWidth={3}
              borderColor={colors.primary}
              paddingBottom={8}
            >
              This Week's Parties
            </Text>
            {weekParties.length > 0 ? (
              <PartyList
                parties={weekParties}
                onDeleteParty={handleDeleteParty}
              />
            ) : (
              <Text fontStyle="italic" color={colors.secondary}>
                No parties this week
              </Text>
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
              <PartyList
                parties={monthParties}
                onDeleteParty={handleDeleteParty}
              />
            ) : (
              <Text fontStyle="italic" color={colors.secondary}>
                No parties this month
              </Text>
            )}
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
};

export default Upcoming;
