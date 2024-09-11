import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useCallback, useState } from "react";
import { Platform } from "react-native";
import { Input, Button, Form, YStack, Text, XStack, View } from "tamagui";

import { Party } from "../model/models";
import { colors } from "../styles/colors";

interface CreatePartyFormProps {
  onCreateParty: (party: Party, place: string) => void;
  onCancel: () => void;
}

const CreatePartyForm = ({ onCreateParty, onCancel }: CreatePartyFormProps) => {
  const [name, setName] = useState("House Party");
  const [description, setDescription] = useState(
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa, quos.",
  );
  const defaultDate = new Date(2024, 8, 18, 20, 0); // September 18, 2024, 8:00 PM
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultDate);
  const [place, setPlace] = useState("123 Main St, San Francisco, CA 94105");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmit = useCallback(() => {
    const newParty: Party = {
      id: Date.now().toString(),
      name,
      description,
      date: new Date(date.setHours(time.getHours(), time.getMinutes())),
      invitees: [],
    };
    onCreateParty(newParty, place);
    onCancel();
  }, [onCreateParty, onCancel, name, description, date, time, place]);

  return (
    <Form onSubmit={handleSubmit}>
      <YStack
        space="$4"
        padding="$5"
        borderBottomWidth={1}
        borderLeftWidth={1}
        borderRightWidth={1}
        borderColor={colors.border}
        borderBottomLeftRadius="$4"
        borderBottomRightRadius="$4"
        backgroundColor={colors.cta}
      >
        <YStack space="$2">
          <Text color={colors.primary}>Party Name</Text>
          <Input
            placeholder="House Party, BBQ, etc."
            value={name}
            onChangeText={setName}
            backgroundColor={colors.textWhite}
          />
        </YStack>
        <YStack space="$2">
          <Text color={colors.primary}>Description</Text>
          <Input
            placeholder="It is an goodbye event for Hailey."
            value={description}
            onChangeText={setDescription}
          />
        </YStack>
        <YStack space="$2">
          <Text color={colors.primary}>Place</Text>
          <Input
            placeholder="123 Main St, San Francisco, CA 94105"
            value={place}
            onChangeText={setPlace}
          />
        </YStack>
        {Platform.OS === "android" && (
          <YStack
            space="$2"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <XStack alignItems="center" space="$3">
              <Text color={colors.primary}>Date</Text>
              <View>
                <Button onPress={() => setShowDatePicker(true)}>
                  {date.toLocaleDateString()}
                </Button>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(_, selectedDate) => {
                      setDate(selectedDate || date);
                      setShowDatePicker(false);
                    }}
                    minimumDate={new Date()}
                  />
                )}
              </View>
            </XStack>
            <XStack alignItems="center" space="$3">
              <Text color={colors.primary}>Time</Text>
              <View>
                <Button onPress={() => setShowTimePicker(true)}>
                  {time.toLocaleTimeString()}
                </Button>
                {showTimePicker && (
                  <DateTimePicker
                    value={time}
                    mode="time"
                    display="default"
                    onChange={(_, selectedDate) => {
                      setTime(selectedDate || time);
                      setShowTimePicker(false);
                    }}
                    minimumDate={new Date()}
                  />
                )}
              </View>
            </XStack>
          </YStack>
        )}
        {Platform.OS === "ios" && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={(_, selectedDate) => {
              setDate(selectedDate || date);
              setShowDatePicker(false);
            }}
            minimumDate={new Date()}
          />
        )}
        <Form.Trigger asChild>
          <Button backgroundColor={colors.secondary} color={colors.textWhite}>
            <Ionicons name="add-outline" size={25} color={colors.textWhite} />
            Create Party
          </Button>
        </Form.Trigger>
      </YStack>
    </Form>
  );
};

export default CreatePartyForm;
