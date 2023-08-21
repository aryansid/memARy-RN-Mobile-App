import React, {useState} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, Image, View, Button} from "react-native";
import {auth} from "../firebase"
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from "firebase/auth";

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // const navigation = useNavigation()

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(user => {
  //     if (user) {
  //       console.log('User authenticated:', user.email);
  //       navigation.replace("Home");
  //     } else {
  //       console.log('No user authenticated');
  //     }
  //   });
  
  //   return unsubscribe;
  // }, []);
  

  const handleSignUp = () => {
    const trimmedEmail = email.trim();
    createUserWithEmailAndPassword(auth, trimmedEmail, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with: ', user.email);
      })
      .catch(error => alert(error.message))
  }

  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
      })
      .catch(error => alert(error.message))
  }

  return (
    <View style={styles.background}>
      <Text style={styles.logo}>memARy</Text>
      <Text style={styles.header}>Preserving Moments, One Click at a Time.</Text>

      <TextInput
        style={styles.textInput}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.textInput}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.forgotPassword}>
        <TouchableOpacity>
          <Text style={styles.label}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default LoginScreen

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f6f6',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
    marginBottom: 24,
  },
  header: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 24,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: '#000',
  },
  link: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  buttonContainer: {
    paddingHorizontal: 16, 
    marginBottom: 12, 
  }, 
  signInButton: {
    borderRadius: 25,
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  signUpButton: {
    borderRadius: 25,
    backgroundColor: '#30D5C8', // Turquoise color
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});