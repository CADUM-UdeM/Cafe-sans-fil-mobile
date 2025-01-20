import Button from "@/components/common/Buttons/Button";
import SocialButton from "@/components/common/Buttons/SocialButton";
import COLORS from "@/constants/Colors";
import TYPOGRAPHY from "@/constants/Typography";
import { Link, router, useRouter } from "expo-router";
import React from "react";
import TextInput from "@/components/common/Inputs/TextInput";
import { View, Text, StyleSheet, Image } from "react-native";
import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { useOAuth } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function SignInScreen() {

  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const { startOAuthFlow: startFacebookOAuthFlow } = useOAuth({ strategy: 'oauth_facebook' })

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/dashboard', { scheme: 'myapp' }),
      })

      // If sign in was successful, set the active session
      if (createdSessionId) {
        await setActive!({ session: createdSessionId })
        console.log("Session created")
        router.replace('/')
        console.log("Navigated")
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA (Multi-Factor Authentication)
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [])

  const onPress2 = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startFacebookOAuthFlow({
        redirectUrl: Linking.createURL('/dashboard', { scheme: 'myapp' }),
      })

      // If sign in was successful, set the active session
      if (createdSessionId) {
        await setActive!({ session: createdSessionId })
        console.log("Session created")
        router.replace('/')
        console.log("Navigated")
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA (Multi-Factor Authentication)
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [])

  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleConnexion = React.useCallback(async () => {
    if (!isLoaded) {
      return
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, email, password])


  const handleEmail = (email: string) => setEmail(email);
  const handlePassword = (password: string) => setPassword(password);

  return (
    <View style={styles.signInContainer}>
      <View style={styles.container}>
        <Image source={require("@/assets/images/placeholder/logo.png")} style={styles.logo} />

        <Text style={[TYPOGRAPHY.heading.large.bold, styles.heading]}>
          Connectez-vous à votre compte
        </Text>

        <View>
          <TextInput label="Adresse électronique" placeholder="menum@cadum.ca" handleOnChangeText={handleEmail}/>
          <TextInput label="Mot de passe" placeholder="*******************" secureTextEntry helpLinkHref="/sign-up" helpLinkText="Mot de passe oublié ?" handleOnChangeText={handlePassword} helpLink/>
        </View>

        <Button onPress={handleConnexion} style={styles.mainButton}>Se connecter</Button>

        <View style={styles.sectionDivider}>
          <View style={styles.divider}></View>
          <Text style={[TYPOGRAPHY.body.normal.base, { textAlign: "right" }]}>Ou</Text>
          <View style={styles.divider}></View>
        </View>

        <SocialButton type="google" style={{marginBottom: 16}} onPress={onPress}/>
        <SocialButton type="facebook" style={{marginBottom: 16}} onPress={onPress2} />

        <View style={styles.otherOptionText}>
          <Text style={TYPOGRAPHY.body.normal.base}>Pas de compte?</Text>
          <Link href={"/sign-up"} style={TYPOGRAPHY.body.normal.semiBold}>Créez un compte</Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 28,
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
