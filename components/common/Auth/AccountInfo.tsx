import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";

import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";
import TYPOGRAPHY from "@/constants/Typography";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

type AccountInfoProps = {
  title?: string;
  profileName: string;
  profilePicture: any;
};

export default function AccountInfo({
  title = "Bonjour et bienvenue", // English: "Welcome back", French: ""
  profileName,
  profilePicture,
}: AccountInfoProps) {
  const { user } = useUser();
  const [userImage, setUserImage] = React.useState<string | null>(null);
  const navigation = useRouter();
  React.useEffect(() => {
    fetch("https://avatar.iran.liara.run/public").then((res) => {
      console.log(res.url);
      setUserImage(res.url);
    });
  }, []);
  return (
    <View style={styles.accountContainer}>
      <TouchableOpacity onPress={() => {navigation.push("/(main)/parametre")}}>
      <Image source={{ uri: userImage } as any} style={styles.profilePicture} testID="header-account-image"/>
      </TouchableOpacity>
      <View>
        <Text style={[styles.welcomeText, TYPOGRAPHY.body.normal.base]}>
          {title}
        </Text>
        <Text style={[styles.userFullName, TYPOGRAPHY.heading.small.bold]}>
          {user?.fullName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  accountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  profilePicture: {
    width: SPACING["8xl"],
    height: SPACING["8xl"],
    borderRadius: 100,
    borderWidth: 4,
    // borderColor: "rgba(0, 0, 0, 0.1)", // Not from any university
    borderColor: "rgba(0, 87, 172, .4)", // From University of Montreal
    // borderColor: "rgba(237, 27, 47, .2)", // From McGill University
  },
  welcomeText: {},
  userFullName: {
    color: COLORS.black,
  },
});
