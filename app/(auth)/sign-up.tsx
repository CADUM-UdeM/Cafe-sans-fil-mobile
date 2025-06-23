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
  const [passwordConf, onChangePasswordConf] = React.useState('');
  const [username, onChangeUsername] = React.useState('');
  const [firstName, onChangeFirstName] = React.useState('');
  const [lastName, onChangeLastName] = React.useState('');
  const [matricule, onChangeMatricule] = React.useState<number | null>(null);
  const emailInputRef = React.useRef<TextInput>(null);
  const passwordInputRef = React.useRef<TextInput>(null);
  const passwordConfInputRef = React.useRef<TextInput>(null);
  const usernameInputRef = React.useRef<TextInput>(null);
  const firstNameInputRef = React.useRef<TextInput>(null);
  const lastNameInputRef = React.useRef<TextInput>(null);
  const matriculeInputRef = React.useRef<TextInput>(null);
  const [isPassword, setIsPassword] = React.useState(true);
  const [matriculeError, setMatriculeError] = React.useState(false);
  const [isLengthValid, setIsLengthValid] = React.useState(false);
  const [isUppercaseValid, setIsUppercaseValid] = React.useState(false);
  const [isNumberValid, setIsNumberValid] = React.useState(false);
  const [isSpecialCharValid, setIsSpecialCharValid] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);


  const signup = async (username: string, first_name: string, last_name: string, matricule: number ,email : string , password : string) => {
    const url = 'https://cafesansfil-api-r0kj.onrender.com/api/auth/register';


  

    const formBody = {
      username: username,
      first_name: first_name, 
      last_name: last_name,
      matricule: matricule.toString(),
      email: email.toLowerCase(),
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
      if (response.ok) {
        alert('Inscription réussie !');
        // Optionally, navigate to a confirmation screen or show a success message
        router.push("/sign-in");
      } else {
        alert(data.detail[0].ctx.reason || 'Une erreur est survenue lors de l\'inscription.');
      }
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
    
    if (matricule !== null) {
      signup(username, firstName, lastName, matricule, email, password);
    } else {
      alert('Veuillez entrer un numéro de matricule valide.');
    }
  }
  const checkMatch = (password: string, passwordConf: string) => {
    if (password !== passwordConf) {
      setIsPassword(false);
    }
    else{
      setIsPassword(true);
    }
    
  }

  const validatePassword = (password: string) => {
    setIsLengthValid(password.length >= 6);
    setIsUppercaseValid(/[A-Z]/.test(password));
    setIsNumberValid(/\d/.test(password));
    setIsSpecialCharValid(/[@$!%*?&]/.test(password));
  }

  const validateMatricule = (matricule: { toString: () => string; } ) => {
    if (matricule && !/^\d{8}$/.test(matricule.toString())) {
      setMatriculeError(true);
      alert("Le numéro de matricule doit contenir exactement 8 chiffres.");
    } else {
      setMatriculeError(false);
    }
  }



  return (
    
    <SafeAreaView >
      <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    
    
  >
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled" 
  >
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
            <Text >
              Prénom
            </Text>
            <Text style={{color: "#ff0000", fontSize: 19, fontWeight: "400"}}> *</Text>
      </Text>

      <TextInput
          style={styles.input}
          ref={firstNameInputRef}
          onChangeText={onChangeFirstName}
          autoCapitalize="words"
          value={firstName}
          placeholder="Jean"
          keyboardType="default"
          returnKeyType="next"
          autoComplete="name"
          onSubmitEditing={() => lastNameInputRef.current?.focus()}
          placeholderTextColor={"#A1A1A1"}
          onFocus={() => {
  setTimeout(() => {
    emailInputRef.current?.measureLayout(
      scrollViewRef.current as any,
      (x, y) => {
        scrollViewRef.current?.scrollTo({ y: y - 300, animated: true });
      }
    );
  }, 100);
}}
        />

      <Text style={styles.textForm}>
            <Text >
              Nom
            </Text>
            <Text style={{color: "#ff0000", fontSize: 19, fontWeight: "400"}}> *</Text>
          </Text>

      <TextInput
          style={styles.input}
          ref={lastNameInputRef}
          onChangeText={onChangeLastName}
          value={lastName}
          autoCapitalize="words"
          placeholder="Tremblay"
          keyboardType="default"
          autoComplete="name"
          returnKeyType="next"
          onSubmitEditing={() => usernameInputRef.current?.focus()}
          placeholderTextColor={"#A1A1A1"}
          onFocus={() => {
  setTimeout(() => {
    emailInputRef.current?.measureLayout(
      scrollViewRef.current as any,
      (x, y) => {
        scrollViewRef.current?.scrollTo({ y: y - 250, animated: true });
      }
    );
  }, 100);
}}
        />

        

    <Text style={styles.textForm}>
          <Text >
            Nom d'utilisateur
          </Text>
          <Text style={{color: "#ff0000", fontSize: 19, fontWeight: "400"}}> *</Text>
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
              <Text >
                Numéro de matricule
              </Text>
              <Text style={{color: "#ff0000", fontSize: 19, fontWeight: "400"}}> *</Text>
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

      <Text style={isPassword ? styles.textForm : styles.textFormR}>
            <Text >
              Mot de passe
            </Text>
            <Text style={{color: "#ff0000", fontSize: 19, fontWeight: "400"}}> *</Text>
          </Text>
  <View>
      <TextInput
          style={isPassword ? styles.input : styles.inputR}
          ref={passwordInputRef}
          onChangeText={onChangePassword}
          onChange={(e) => validatePassword(e.nativeEvent.text)}
          value={password}
          placeholder="********"
          keyboardType="default"
          autoComplete="password"
          returnKeyType="next"
          onSubmitEditing={() => passwordConfInputRef.current?.focus()}
          placeholderTextColor={"#A1A1A1"}
          secureTextEntry={isVisible}
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
        <TouchableOpacity 
          style={styles.showPasswordButton}
          onPress={() => setIsVisible(!isVisible)}
        >
          <Ionicons 
            name={isVisible ? 'eye-off' : 'eye'} 
            size={24} 
            color="#A1A1A1" 
          />
        </TouchableOpacity>
        </View>

        <Text style={styles.validateText}>
          <Text >
            Le mot de passe doit contenir :
          </Text>
          {"\n"}
         <Text style={{color: isLengthValid ? "#00AA00" : "#FF0000"}}>- 6 characteres </Text>
         {"\n"}
         <Text style={{color : isUppercaseValid ? "#00AA00" : "#FF0000"}} >- 1 majuscule </Text>
         {"\n"}
          <Text style={{color : isNumberValid ? "#00AA00" : "#FF0000"}}>- 1 chiffre </Text>
          {"\n"}
          <Text style={{color : isSpecialCharValid ? "#00AA00" : "#FF0000"}}>- 1 caractère spécial (Exemple : !@#$%*&...)</Text>
          {"\n"}
        </Text>



        <Text style={isPassword ? styles.textForm : styles.textFormR}>
            <Text >
              Confirmer le mot de passe
            </Text>
            <Text style={{color: "#ff0000", fontSize: 19, fontWeight: "400"}}> *</Text>
          </Text>

      <View>
      <TextInput
          style={isPassword ? styles.input : styles.inputR}
          ref={passwordConfInputRef}
          onChangeText={onChangePasswordConf}
          value={passwordConf}
          placeholder="********"
          keyboardType="default"
          autoComplete="password"
          returnKeyType="done"
          placeholderTextColor={"#A1A1A1"}
          onSubmitEditing={() => {
            checkMatch(password, passwordConf);
          }}
          secureTextEntry={isVisible}
          onFocus={() => {
  setTimeout(() => {
    passwordConfInputRef.current?.measureLayout(
      scrollViewRef.current as any,
      (x, y) => {
        scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
      }
    );
  }, 100);
}}

        />

        {!isPassword && (
          <Text style={styles.validateTextR}>
            Les mots de passe ne correspondent pas.
          </Text>
        )}

        <TouchableOpacity 
          style={styles.showPasswordButton}
          onPress={() => setIsVisible(!isVisible)}
        >
          <Ionicons 
            name={isVisible ? 'eye-off' : 'eye'} 
            size={24} 
            color="#A1A1A1" 
          />
        </TouchableOpacity>
        </View>


      


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
  container: {
    flex: 1,
  },
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
  textFormR: {
    textAlign: "left" as const,
    paddingLeft: 30,
    color : "#FF0000",
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

  inputR: {
    height: 40,
    margin: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 15,
    borderColor: "#FF0000",
    
  },
  buttonView:{
    marginTop: -10,
    padding:20
  },
  validateText: {
    textAlign: "left" as const,
    paddingLeft: 30,
    color: "#A1A1A1",
  },
  validateTextR: {
    textAlign: "left" as const,
    paddingLeft: 30,
    color: "#FF0000",

  },
  showPasswordButton: {
    position: "absolute" as const,
    right: 30,
    top: 13,
    padding: 5
  }
  
}

