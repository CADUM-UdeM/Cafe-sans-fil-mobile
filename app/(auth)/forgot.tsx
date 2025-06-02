import Button from "@/components/common/Buttons/Button";
import React from "react";
import {Text, View, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform, StatusBar, Pressable, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {useRouter} from "expo-router";
import { Ionicons } from '@expo/vector-icons';




export default function SignInScreen() {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const router = useRouter();
  const [email, onChangeEmail] = React.useState('');
  const emailInputRef = React.useRef<TextInput>(null);



  const forgot = async (email : string) => {
    const url = 'https://cafesansfil-api-r0kj.onrender.com/api/auth/forgot-password?email=' + encodeURIComponent(email);
    

    

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        alert('Le mail pour réinitialiser le mot de passe a été envoyé à votre email !');
        // Optionally, navigate to a confirmation screen or show a success message
        router.push("/sign-in");
      }
    } catch (error) {
      alert('Adresse mail introuvable');
    }
  };


  return (
    <SafeAreaView  >
       <StatusBar />
      <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    
  >

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled" style={{  minHeight: "100%" }}>
    <TouchableOpacity 
      style={styles.backButton} 
      onPress={() => router.push("/sign-in")}
    >
      <Ionicons name="arrow-back" size={24} color="#000" />
    </TouchableOpacity>
      <Image source={require("@/logo.png")} style={styles.logo}/>
      <View style={styles.header}>
      <Text style={styles.textHeader}>
        Réinitialiser le mot de passe
      </Text>
      </View>



      <Text style={styles.textForm}>
          <Text >
              Adresse e-mail
          </Text>
          <Text style={{color: "#ff0000", fontSize: 19, fontWeight: "400"}}> *</Text>
      </Text>

      <TextInput
          style={styles.input}
          ref={emailInputRef}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="email@email.com"
          keyboardType="email-address"
          autoComplete="email"
          returnKeyType="done"
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

      

       

      <View style={styles.buttonView}>
      <Button onPress={() => forgot(email)}>Réinitialiser le mot de passe</Button>
      </View>
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
  ,
  backButton: {
    position: "absolute" as const,
    top: 10,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
}

