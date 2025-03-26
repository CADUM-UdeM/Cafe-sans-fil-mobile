import React from "react";
import { StyleSheet, Text, View } from "react-native";

import SPACING from "@/constants/Spacing";
import TYPOGRAPHY from "@/constants/Typography";

import FilterButtons from "../common/Buttons/FilterButtons";

type InfoModalLayoutProps = {
  title?: string;
  children?: React.ReactNode;
  description?: string;
  handleApplyFilter?: () => void;
  handleResetFilter?: () => void;
};

export default function InfoModalLayout({
  title,
  description,
  children = (
    <Text
      style={{
        textAlign: "center",
        ...TYPOGRAPHY.body.large.medium,
        margin: SPACING.md,
      }}
    >
      {description? description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque nostrum accusantium autem eos vero consequatur reiciendis quae tenetur possimus sit!"}
    </Text>
  ),
  handleApplyFilter = () => console.log("Apply Filter"),
  handleResetFilter = () => console.log("Reset Filter"),
  
}: InfoModalLayoutProps) {
  return (
    <>
      <Text style={styles.title}>{title}</Text>
      <>{children}</>
      <FilterButtons
        handleApplyFilter={handleApplyFilter}
        handleResetFilter={handleResetFilter}
      />
    </>
  );
}

// Styles
const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    ...TYPOGRAPHY.heading.medium.bold,
  },
  description: {
    textAlign: "center",
    ...TYPOGRAPHY.body.large.medium,
    margin: SPACING.md,
  },
});
