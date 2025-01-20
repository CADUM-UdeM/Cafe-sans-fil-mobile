import { View, Text, StyleSheet, TextInput as Input } from "react-native";
import React from "react";
import COLORS from "@/constants/Colors";
import TYPOGRAPHY from "@/constants/Typography";
import { Link } from "expo-router";

type TextInputProps = {
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  helpLink?: boolean;
  helpLinkHref?: string;
  helpLinkText?: string;
  handleOnChangeText: (text: string) => void;
};

export default function TextInput({
  label = undefined,
  placeholder,
  secureTextEntry = false,
  helpLink,
  helpLinkText,
  helpLinkHref,
  handleOnChangeText,
}: TextInputProps) {
  return (
    <View>
      <View>
        {label && (
          <Text style={[TYPOGRAPHY.body.normal.base, styles.textInputLabel]}>
            {label}
          </Text>
        )}
        <Input
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={COLORS.subtuleDark}
          returnKeyLabel="done"
          returnKeyType="done"
          secureTextEntry={secureTextEntry}
          onChangeText={handleOnChangeText}
        ></Input>
      </View>
      {helpLink && (
        <Link
          href={
            {
              pathname: helpLink ? helpLinkHref : "/",
            } as any
          }
          style={[TYPOGRAPHY.body.normal.semiBold, { alignSelf: "flex-end" }]}
        >
          {helpLinkText}
        </Link>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textInputLabel: {
    paddingVertical: 8,
  },
  textInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EDF1F3",
    paddingHorizontal: 16,
    paddingVertical: 12,
    boxShadow: "0px 1px 2px 0px rgba(228, 229, 231, 0.24)",
    color: "#000000",
    marginBottom: 12,
  },
});
