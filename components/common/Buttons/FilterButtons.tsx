import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import COLORS from "@/constants/Colors";
import TYPOGRAPHY from "@/constants/Typography";
import SPACING from "@/constants/Spacing";

type FilterButtonsProps = {
  closeButtonText?: string;
  resetButtonText?: string;
  handleApplyFilter: () => void;
  handleResetFilter: () => void;
};

export default function FilterButtons({
  closeButtonText="Appliquer",
  resetButtonText="Réintialiser",
  handleApplyFilter,
  handleResetFilter,
}: FilterButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleApplyFilter} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>{closeButtonText}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleResetFilter} style={styles.resetButton}>
        <Text style={styles.resetButtonText}>{resetButtonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },  
  closeButtonText: {
    color: COLORS.white,
    ...TYPOGRAPHY.body.large.semiBold,
  },
  resetButtonText: {
    color: COLORS.black,
    ...TYPOGRAPHY.body.large.semiBold,
  },
  closeButton: {
    alignSelf: "center",
    backgroundColor: COLORS.black,
    paddingVertical: SPACING.md,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  resetButton: {
    alignSelf: "center",
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  }
});
