import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ViewStyle } from "react-native";

// Constants
import TYPOGRAPHY from "@/constants/Typography";
import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";

type SocialButtonProps = {
  type?: "google" | "facebook";
  style?: ViewStyle;
  onPress?: () => void;
};

export default function SocialButton({ type, style, onPress }: SocialButtonProps) {
  return type === "google" ? (
    <TouchableOpacity style={[styles.socialButton, style]} onPress={onPress}>
      <View style={styles.socialButtonInnerContainer}>
        <Image
          source={require("@/assets/images/onboarding/google.png")}
          style={{ width: 24, height: 24 }}
        ></Image>
        <Text style={[TYPOGRAPHY.body.large.semiBold, { textAlign: "center" }]}>
          Continuer avec Google
        </Text>
      </View>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={[styles.socialButton, style]} onPress={onPress}>
      <View style={styles.socialButtonInnerContainer}>
        <Image
          source={require("@/assets/images/onboarding/facebook.png")}
          style={{ width: 24, height: 24 }}
        ></Image>
        <Text style={[TYPOGRAPHY.body.large.semiBold, { textAlign: "center" }]}>
          Continuer avec Facebook
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  socialButtonInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 10,
    boxShadow: "0px 1px 2px 0px rgba(228, 229, 231, 0.24)",
    borderColor: "#EDF1F3",
    borderWidth: 1,
  },
});
