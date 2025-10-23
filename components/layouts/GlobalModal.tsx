import React, { useState, createContext, useContext, useRef } from "react";
import {
  Modal,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  View,
} from "react-native";

import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";
import TYPOGRAPHY from "@/constants/Typography";

interface ModalContextType {
  openModal: (body: React.ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => useContext(ModalContext);

export const GlobalModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [customBody, setCustomBody] = useState<React.ReactNode>(null);

  const openModal = (body: React.ReactNode) => {
    setCustomBody(body);
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>{customBody}</View>
      </Modal>
    </ModalContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING["3xl"],
    paddingBottom: SPACING["5xl"],
  },
  closeButton: {
    marginTop: SPACING.md,
    alignSelf: "center",
    backgroundColor: COLORS.black,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: COLORS.white,
    ...TYPOGRAPHY.body.large.semiBold,
  },
});
