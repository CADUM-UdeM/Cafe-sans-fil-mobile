import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import React from "react";
import COLORS from "@/constants/Colors";

type DividerProps = {
  marginTop?: number;
  marginBottom?: number;
  height?: number;
};

export default function Divider({
  marginTop,
  marginBottom,
  height = 1,
}: DividerProps) {
  return (
    <View
      style={[
        styles.divider,
        {
          marginTop,
          marginBottom,
          height,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: COLORS.lightGray,
  },
});
