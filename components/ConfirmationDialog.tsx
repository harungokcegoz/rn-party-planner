import React from "react";
import { Dialog, Button, XStack } from "tamagui";

import { colors } from "../styles/colors";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  return (
    <Dialog modal open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          backgroundColor={colors.background}
          borderColor={colors.border}
        >
          <Dialog.Title color={colors.textBlack}>{title}</Dialog.Title>
          <Dialog.Description color={colors.textGray}>
            {description}
          </Dialog.Description>
          <XStack gap="$3" justifyContent="flex-end" marginTop="$4">
            <Dialog.Close asChild>
              <Button
                backgroundColor={colors.unselectedBackground}
                color={colors.textBlack}
              >
                {cancelText}
              </Button>
            </Dialog.Close>
            <Button
              theme="active"
              onPress={onConfirm}
              backgroundColor={colors.cta}
              color={colors.textWhite}
            >
              {confirmText}
            </Button>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default ConfirmationDialog;