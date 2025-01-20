import Button from "@/components/common/Buttons/Button";
import SocialButton from "@/components/common/Buttons/SocialButton";
import COLORS from "@/constants/Colors";
import TYPOGRAPHY from "@/constants/Typography";
import { Link, useRouter } from "expo-router";
import React from "react";
import TextInput from "@/components/common/Inputs/TextInput";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";

type FullNameType = {
  firstName: string;
  lastName: string;
}

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [code, setCode] = React.useState('');
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState<FullNameType|undefined>();
  const [pendingVerification, setPendingVerification] = React.useState(false);

  function handleEmail(text: string) {
    setEmail(text); 
  }

  function handlePassword(text: string) {
    setPassword(text);
  }

  async function handleCreateAccount() {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName: fullName?.firstName,
        lastName: fullName?.lastName,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)

      // if (signUpAttempt.status === 'complete') {
      //   await setActive({ session: signUpAttempt.createdSessionId })
      //   router.replace('/')
      // }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  function handleFullName(text: string): void {
    const decomposedName = text.split(" ");
    if (decomposedName.length < 2) {
      throw new Error("Please enter your full name");
    }

    const lastName = decomposedName.pop() as string;
    const firstName = decomposedName.join(" ");

    setFullName({ firstName, lastName });
  }

  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View style={styles.signInContainer}>
        <View style={styles.container}>
          <Image source={require("@/assets/images/placeholder/logo.png")} style={styles.logo} />
          <Text style={[TYPOGRAPHY.heading.large.bold, styles.heading]}>Vérifiez votre email</Text>
          <Text style={[TYPOGRAPHY.body.large.base, { textAlign: "center", lineHeight: 22, marginTop:-16, marginBottom: 32 }]}>
            Un code de vérification a été envoyé à votre adresse électronique.
            Veuillez entrer le code pour vérifier votre compte.  
          </Text>

          <TextInput label="Code de vérification" placeholder="123456" handleOnChangeText={setCode} />
          <Button onPress={onPressVerify} style={styles.mainButton}>Vérifier</Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.signInContainer}>
      <View style={styles.container}>
        <Image source={require("@/assets/images/placeholder/logo.png")} style={styles.logo} />
        <Text style={[TYPOGRAPHY.heading.large.bold, styles.heading]}>Créez un compte</Text>

        <View>
          <TextInput label="Nom Complet *" placeholder="Darlene Robertson" handleOnChangeText={handleFullName}/>
          <TextInput label="Adresse électronique *" placeholder="menum@cadum.ca" handleOnChangeText={handleEmail}/>
          <TextInput label="Mot de passe *" placeholder="*******************" secureTextEntry helpLinkHref="/sign-up" helpLinkText="Mot de passe oublié ?" handleOnChangeText={handlePassword} helpLink/>
        </View>

        <Button onPress={handleCreateAccount} style={styles.mainButton}>S'inscrire</Button>

        <View style={styles.sectionDivider}>
          <View style={styles.divider}></View>
          <Text style={[TYPOGRAPHY.body.normal.base, { textAlign: "right" }]}>Ou</Text>
          <View style={styles.divider}></View>
        </View>

        <SocialButton type="google" style={{marginBottom: 16}}/>
        <SocialButton type="facebook" style={{marginBottom: 16}} />

        <View style={styles.otherOptionText}>
          <Text style={TYPOGRAPHY.body.normal.base}>Déjà un compte?</Text>
          <Link href={"/sign-in"} style={TYPOGRAPHY.body.normal.semiBold}>Connectez-vous</Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  mainButton: {
    marginTop: 24,
    marginBottom: 28,
  },
  otherOptionText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
  },
  socialButtonInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 10,
    boxShadow: "0px 1px 2px 0px rgba(228, 229, 231, 0.24)",
    borderColor: "#EDF1F3",
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionDivider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 2,
    backgroundColor: "#EDF1F3",
  },
  signInContainer: {
    paddingHorizontal: 32,
    paddingVertical: 32,
  },
  logo: {
    alignSelf: "center",
    width: 135,
    height: 24,
    marginBottom: 32,
  },
  heading: {
    textAlign: "center",
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: 28,
  },
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
