import React, { act, useEffect } from "react";
import { Link, router, useRouter } from "expo-router";
import { View, Text, StyleSheet, Image, StatusBar } from "react-native";
import OnboardingLayout from "@/components/layouts/OnboardingLayout";
import TYPOGRAPHY from "@/constants/Typography";
import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";
import Button from "@/components/common/Buttons/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FirstOnboardingScreen() {
  const router = useRouter();
  useEffect(() => {
    async function checkIfOnboarded() {
      const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");
      console.log("Has onboarded: de first", hasOnboarded);
    }
    checkIfOnboarded();
  }, []);

  return (
    <View style={styles.screenContainer}>
      <StatusBar />
      <View style={styles.currentPage}>
        <View style={[styles.currentPageItem, styles.activePageItem]}></View>
        <View style={styles.currentPageItem}></View>
        <View style={styles.currentPageItem}></View>
      </View>

      <View style={styles.contentContainer}>
        <Image
          source={require("@/assets/images/onboarding/cafe_san_fil_2_v2.png")}
          style={{
            alignSelf: "center",
            width: 300,
            height: 260,
          }}
        ></Image>
        <View style={styles.descriptionContainer}>
          <Text style={[TYPOGRAPHY.heading.medium.bold, styles.heading]}>
            Tous vos cafés un coup d'œil
          </Text>
          <Text style={[TYPOGRAPHY.body.large.base, styles.description]}>
            Accédez facilement à toutes les options de restauration du campus en
            un seul endroit.
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={() => router.push("/second-onboarding")}>
          Suivant
        </Button>
        <Button onPress={() => router.push("/sign-in")} type="secondary">
          Sauter
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    paddingHorizontal: SPACING.md,
  },
  currentPage: {
    marginTop: SPACING["3xl"],
    marginBottom: 140,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
  },
  currentPageItem: {
    flex: 1,
    height: 4,
    backgroundColor: "#DEDEDE",
    borderRadius: 4,
  },
  activePageItem: {
    backgroundColor: COLORS.black,
  },
  contentContainer: {
    gap: 72,
    paddingHorizontal: SPACING.md,
  },
  descriptionContainer: {
    gap: SPACING.xs,
  },
  heading: {
    textAlign: "center",
    color: COLORS.black,
  },
  description: {
    textAlign: "center",
    color: COLORS.subtuleDark,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
    marginTop: SPACING["9xl"],
    paddingBottom: SPACING["xl"],
  },
});
