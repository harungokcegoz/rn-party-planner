import { Check, ChevronDown } from "@tamagui/lucide-icons";
import React from "react";
import { Select, Adapt, Sheet, Text } from "tamagui";

import { colors } from "../styles/colors";
interface SelectItemProps<T extends string | number> {
  items: { value: T; label: string }[];
  value: T;
  onValueChange: (value: T) => void;
  placeholder: string;
  width?: number | string;
}

export function SelectItem<T extends string | number>({
  items,
  value,
  onValueChange,
  placeholder,
  width = 120,
}: SelectItemProps<T>) {
  return (
    <Select
      value={value.toString()}
      onValueChange={(v) => onValueChange(v as T)}
      disablePreventBodyScroll
    >
      <Select.Trigger width={width} iconAfter={ChevronDown}>
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>
      <Adapt platform="touch">
        <Sheet modal dismissOnSnapToBottom>
          <Sheet.Frame bottom={0} position="absolute" maxHeight={350}>
            <Sheet.ScrollView maxHeight={330}>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>
      <Select.Content>
        <Select.Viewport>
          {items.length > 5 && (
            <Text
              padding="$4"
              fontSize="$2"
              fontWeight="$3"
              color={colors.textWhite}
              backgroundColor={colors.background}
            >
              Scroll for more choices
            </Text>
          )}
          <Select.Group>
            {items.map((item, i) => (
              <Select.Item
                index={i}
                key={item.value}
                value={item.value.toString()}
              >
                <Select.ItemText>{item.label}</Select.ItemText>
                <Select.ItemIndicator marginLeft="auto">
                  <Check size={16} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select>
  );
}