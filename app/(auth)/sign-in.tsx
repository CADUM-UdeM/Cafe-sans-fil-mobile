import Button from "@/components/common/Buttons/Button";
import React from "react";
import {Text} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {useRouter} from "expo-router";



export default function SignInScreen() {

  const router = useRouter();

  return (
    <SafeAreaView>
      <Text>
        Sign In
      </Text>
      <Button onPress={() => console.log("Sign In")}>Se connecter</Button>
      <Button onPress={() => router.push("/sign-up")} type="secondary">S'inscrire</Button>
    </SafeAreaView>
  );

}

