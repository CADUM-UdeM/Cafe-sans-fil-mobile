import Button from "@/components/common/Buttons/Button";
import React from "react";
import {Text, View, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {useRouter} from "expo-router";
import { Ionicons } from '@expo/vector-icons';




export default function SignInScreen() {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const router = useRouter();
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [username, onChangeUsername] = React.useState('');
  const [firstName, onChangeFirstName] = React.useState('');
  const [lastName, onChangeLastName] = React.useState('');
  const [matricule, onChangeMatricule] = React.useState<number | null>(null);
  const emailInputRef = React.useRef<TextInput>(null);
  const passwordInputRef = React.useRef<TextInput>(null);
  const usernameInputRef = React.useRef<TextInput>(null);
  const firstNameInputRef = React.useRef<TextInput>(null);
  const lastNameInputRef = React.useRef<TextInput>(null);
  const matriculeInputRef = React.useRef<TextInput>(null);


  const signup = async (username: string, first_name: string, last_name: string, matricule: number ,email : string , password : string) => {
    const url = 'https://cafesansfil-api-r0kj.onrender.com/api/auth/register';

    const formBody = {
      username: username,
      first_name: first_name, 
      last_name: last_name,
      matricule: matricule.toString(),
      email: email,
      password: password,
      photo_url: "https://example.com/",
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formBody)
      });
      console.log("Response status:", response.status);
      
      const data = await response.json();
      console.log(data);
      console.log(data.detail)
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };

  const debug = () =>{
    console.log("Username:", username);
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Matricule:", matricule);
    console.log("Email:", email);
    console.log("Password:", password);
    
    signup(username, firstName, lastName, matricule, email, password);
  }


  return (
    
    <SafeAreaView>
      <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    
  >
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled" >
    <TouchableOpacity 
  style={styles.backButton} 
  onPress={() => router.push("/sign-in")}
>
  <Ionicons name="arrow-back" size={24} color="#000" />
</TouchableOpacity>
    
      <Image source={require("@/logo.png")} style={styles.logo}/>
      <View style={styles.header}>
      <Text style={styles.textHeader}>
        Créez un compte
      </Text>
      </View>

      <Text style={styles.textForm}>
        Nom
      </Text>

      <TextInput
          style={styles.input}
          ref={lastNameInputRef}
          onChangeText={onChangeLastName}
          value={lastName}
          placeholder="Tremblay"
          keyboardType="default"
          autoComplete="name"
          returnKeyType="next"
          onSubmitEditing={() => firstNameInputRef.current?.focus()}
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
        Prénom
      </Text>

      <TextInput
          style={styles.input}
          ref={firstNameInputRef}
          onChangeText={onChangeFirstName}
          value={firstName}
          placeholder="Jean"
          keyboardType="default"
          returnKeyType="next"
          autoComplete="name"
          onSubmitEditing={() => usernameInputRef.current?.focus()}
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
        Nom d'utilisateur
      </Text>

      <TextInput
          style={styles.input}
          ref={usernameInputRef}
          onChangeText={onChangeUsername}
          value={username}
          placeholder="nom_utilisateur"
          keyboardType="default"
          autoComplete="username"
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current?.focus()}
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
          onSubmitEditing={() => matriculeInputRef.current?.focus()}
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
        Numéro de matricule
      </Text>

      <TextInput
          style={styles.input}
          ref={matriculeInputRef}
          onChangeText={(text) => onChangeMatricule(text ? parseInt(text, 10) : null)}
          value={matricule !== null ? matricule.toString() : ''}
          placeholder="12345678"
          keyboardType="numeric"
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
      


      <View style={styles.buttonView}>
      <Button onPress={() => debug()}>S'inscrire</Button>
      </View>
      <Button onPress={() => router.push("/sign-in")} type="secondary">Déjà un compte ?</Button>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );


}

const styles = {
  backButton: {
    position: "absolute" as const,
    top: 10,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
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

