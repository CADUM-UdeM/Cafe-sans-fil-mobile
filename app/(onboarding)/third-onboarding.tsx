import React, { act, useEffect } from "react";
import { Link, router, useRouter } from "expo-router";
import { View, Text, StyleSheet, Image } from "react-native";
import OnboardingLayout from "@/components/layouts/OnboardingLayout";
import TYPOGRAPHY from "@/constants/Typography";
import COLORS from "@/constants/Colors";
import SPACING from "@/constants/Spacing";
import Button from "@/components/common/Buttons/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ThirdOnboardingScreen() {
  const router = useRouter();
  useEffect(() => {
    const checkIfOnboarded = async () => {
      const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");
      console.log("Has onboarded: de third", hasOnboarded);
      if (hasOnboarded !== null) {
        console.log("Redirecting to home from onboarding");
        router.replace("/"); // Redirect to home if already onboarded
      } else {
        console.log("Setting hasOnboarded to true");
        await AsyncStorage.setItem("hasOnboarded", "true");
      }
    };
    checkIfOnboarded();
  }, []);
  return (
    <View style={styles.screenContainer}>
      <View style={styles.currentPage}>
        <View style={styles.currentPageItem}></View>
        <View style={styles.currentPageItem}></View>
        <View style={[styles.currentPageItem, styles.activePageItem]}></View>
      </View>

      <View style={styles.contentContainer}>
        <Image
          source={require("@/assets/images/onboarding/thirdscreen.png")}
          style={{
            alignSelf: "center",
            width: 310,
            height: 260,
            objectFit: "scale-down",
          }}
        ></Image>
        <View style={styles.descriptionContainer}>
          <Text style={[TYPOGRAPHY.heading.medium.bold, styles.heading]}>
            Filtres Personnalisés
          </Text>
          <Text style={[TYPOGRAPHY.body.large.base, styles.description]}>
            Filtrez par prix, moyen de paiement, ouverture pour une expérience
            rapide et sur mesure et sur mesure.
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={() => router.navigate("/sign-in")}>Suivant</Button>
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
