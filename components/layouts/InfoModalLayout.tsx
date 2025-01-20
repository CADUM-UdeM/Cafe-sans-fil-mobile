import React from "react";
import { StyleSheet, Text } from "react-native";

import SPACING from "@/constants/Spacing";
import TYPOGRAPHY from "@/constants/Typography";

import Button from "../common/Buttons/Button";

type InfoModalLayoutProps = {
  title?: string;
  children?: string;
  buttonTitle?: string;
  buttonAction?: () => void;
};

export default function InfoModalLayout({
  title,
  children = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque nostrum accusantium autem eos vero consequatur reiciendis quae tenetur possimus sit!",
  buttonTitle="Button",
  buttonAction = () => console.log("hello"),
}: InfoModalLayoutProps) {
  return (
    <>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{children}</Text>
      <Button onPress={buttonAction} style={{ marginBlock: SPACING["sm"] }}>{buttonTitle}</Button>
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
  }
});
