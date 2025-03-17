import React, {
  useState,
  createContext,
  useContext,
  useRef,
} from "react";
import { Modal, StyleSheet, Pressable, Animated } from "react-native";

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
  const slideAnim = useRef(new Animated.Value(300)).current;

  const openModal = (body: React.ReactNode) => {
    setCustomBody(body);
    setIsVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCustomBody(null);
      setIsVisible(false);
    });
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal visible={isVisible} transparent animationType="none">
        <Pressable style={styles.modalOverlay} onPress={closeModal}></Pressable>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {customBody}
        </Animated.View>
      </Modal>
    </ModalContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignSelf: "center",
    backgroundColor: COLORS.white,
    borderTopRightRadius: SPACING["4xl"],
    borderTopLeftRadius: SPACING["4xl"],
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING["3xl"],
    paddingBottom: SPACING["5xl"],
    zIndex: 99,
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
