import Button from "@/components/common/Buttons/Button";
import React from "react";
import {Text, View, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform, StatusBar} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {useRouter} from "expo-router";




export default function SignInScreen() {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const router = useRouter();
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const emailInputRef = React.useRef<TextInput>(null);
  const passwordInputRef = React.useRef<TextInput>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [refreshToken, setRefreshToken] = React.useState<string | null>(null);

  const login = async (email : string , password : string) => {
    const url = 'https://cafesansfil-api-r0kj.onrender.com/api/auth/login';

    const formBody = new URLSearchParams({
      grant_type: 'password',
      username: email,
      password: password,
      scope: '',
      client_id: 'string',
      client_secret: 'string'
    }).toString();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
      });

      const data = await response.json();
      data.access_token && setToken(data.access_token);
      data.refresh_token && setRefreshToken(data.refresh_token);
      console.log(data);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };


  return (
    <SafeAreaView>
       <StatusBar />
      <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    
  >
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled" >
      <Image source={require("@/logo.png")} style={styles.logo}/>
      <View style={styles.header}>
      <Text style={styles.textHeader}>
        Connectez-vous à votre compte
      </Text>
      </View>



      <Text style={styles.textForm}>
        Adresse e-mail
      </Text>

      <TextInput
          style={styles.input}
          ref={emailInputRef}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="email@email.com"
          keyboardType="email-address"
          autoComplete="email"
          returnKeyType="next"
          onSubmitEditing={() => passwordInputRef.current?.focus()}
          placeholderTextColor={"#A1A1A1"}
          onFocus={() => {
  setTimeout(() => {
    emailInputRef.current?.measureLayout(
      scrollViewRef.current as any,
      (x, y) => {
        scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
      }
    );
  }, 100);
}}
        />

      <Text style={styles.textForm}>
        Mot de passe
      </Text>

      <TextInput
          style={styles.input}
          ref={passwordInputRef}
          onChangeText={onChangePassword}
          value={password}
          placeholder="********"
          keyboardType="default"
          autoComplete="password"
          returnKeyType="done"
          placeholderTextColor={"#A1A1A1"}
          secureTextEntry
          onFocus={() => {
  setTimeout(() => {
    passwordInputRef.current?.measureLayout(
      scrollViewRef.current as any,
      (x, y) => {
        scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
      }
    );
  }, 100);
}}

        />
      <View style={{marginLeft: "50%"}}>
      <Button style={{}} onPress={() => console.log("Forgot Password")} type="secondary">
        Mot de passe oublié ?
      </Button>
      </View>


      <View style={styles.buttonView}>
      <Button onPress={() => login(email,password)}>Se connecter</Button>
      </View>
      <Button style={{margin:-10}} onPress={() => router.push("/sign-up")} type="secondary">Pas de compte ?</Button>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );


}

const styles = {
  scrollableLayout: {
    height: "100%",
    flexGrow: 1,
  },

  logo:{
    width: 150,
    height: 150,
    alignSelf: "center" as const,
  },
  header : {
    padding: 30,
  },
  textHeader:{
    fontSize: 34,
    fontWeight: "bold" as const,
    textAlign: "center" as const,
  },
  textForm: {
    textAlign: "left" as const,
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
    borderColor: "#CCCCCC",
    
    
    
  },
  buttonView:{
    marginTop: -10,
    padding:20
  }
  
}

