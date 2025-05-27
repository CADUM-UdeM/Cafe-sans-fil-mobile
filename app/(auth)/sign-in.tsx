import Button from "@/components/common/Buttons/Button";
import React from "react";
import {Text, View, Image, TextInput} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {useRouter} from "expo-router";



export default function SignInScreen() {

  const router = useRouter();
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  return (
    <SafeAreaView>
      <Image source={require("@/logo.png")} style={styles.logo}/>
      <View style={styles.header}>
      <Text style={styles.textHeader}>
        Connectez-vous à votre compte
      </Text>
      </View>



      <Text style={styles.textForm}>
        Adresse e-mail ou nom d'utilisateur
      </Text>

      <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="email@email.com"
          keyboardType="email-address"
          autoComplete="email"
          autoFocus
          placeholderTextColor={"#A1A1A1"}
        />

      <Text style={styles.textForm}>
        Mot de passe
      </Text>

      <TextInput
          style={styles.input}
          onChangeText={onChangePassword}
          value={password}
          placeholder="********"
          keyboardType="default"
          autoComplete="password"
          autoFocus
          placeholderTextColor={"#A1A1A1"}
          secureTextEntry
        />
      
      <Button onPress={() => console.log("Forgot Password")} type="secondary">
        Mot de passe oublié ?
      </Button>


      <View style={styles.buttonView}>
      <Button onPress={() => console.log("Sign In")}>Se connecter</Button>
      </View>
      <Button onPress={() => router.push("/sign-up")} type="secondary">Pas de compte ?</Button>
    </SafeAreaView>
  );


}

const styles = {
  logo:{
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 10,
  },
  header : {
    padding: 30,
  },
  textHeader:{
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
  },
  textForm: {
    textAlign: "left",
    paddingLeft: 30,
  },
  input: {
    height: 40,
    margin: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 15,
    
  },
  buttonView:{
    marginTop: -10,
    padding:20
  }
  
}

