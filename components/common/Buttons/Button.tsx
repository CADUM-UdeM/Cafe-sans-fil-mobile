import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";

import TYPOGRAPHY from "@/constants/Typography";
import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";

type ButtonProps = {
  children: React.ReactNode;
  type?: "primary" | "secondary";
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
};

export default function Button({
  children,
  type = "primary",
  style,
  onPress,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        type == "primary" ? styles.primary : styles.secondary,
        ...(style ? [style] : []),
      ]}
      activeOpacity={0.85}
    >
      <Text style={type == "primary" ? styles.text : styles.textSecondary}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    color: COLORS.white,
    ...TYPOGRAPHY.body.large.semiBold,
  },
  textSecondary: {
    color: COLORS.black,
    ...TYPOGRAPHY.body.large.semiBold,
  },
  button: {
    alignSelf: "center",
    backgroundColor: COLORS.black,
    paddingVertical: SPACING.md,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  primary: {
    backgroundColor: COLORS.black,
  },
  secondary: {
    backgroundColor: COLORS.white,
  }
});
