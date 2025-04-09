import Button from "@/components/common/Buttons/Button";
import React from "react";
import {Text} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {useRouter} from "expo-router";



export default function SignUpScreen() {

  const router = useRouter();

  return (
    <SafeAreaView>
      <Text>
        Sign Up
      </Text>
      <Button onPress={() => console.log("Sign Up")}>S'inscrire</Button>
      <Button onPress={() => router.push("/sign-in")} type="secondary">Se connecter</Button>
    </SafeAreaView>
  );

}

