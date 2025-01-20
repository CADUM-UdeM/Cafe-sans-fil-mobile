import React from "react";
import { ScrollView, StyleProp, ViewStyle } from "react-native";

import COLORS from "@/constants/Colors";

type ScrollableLayoutProps = {
  children: React.ReactNode;
  scrollHorizontal?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function ScrollableLayout({
  children,
  scrollHorizontal = false,
  style
}: ScrollableLayoutProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={[{ backgroundColor: COLORS.white }, style]}
      horizontal={scrollHorizontal}
    >
      {children}
    </ScrollView>
  );
}
