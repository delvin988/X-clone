import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Animated, Alert } from 'react-native';
import { useMutation, gql } from "@apollo/client";
import { AuthContext } from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      id
      username
    }
  }
`;

export default function Login({ navigation }) {
  const {isSignedIn, setIsSignedIn} = useContext(AuthContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handleLogin, { data, loading, error }] = useMutation(LOGIN);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  const handleSubmit = async () => {
    try {
      const result = await handleLogin({
        variables: {
          email: email,
          password: password
        }
      });
      await SecureStore.setItemAsync("accessToken", result.data.login.accessToken)
      await SecureStore.setItemAsync("id", result.data.login.id)
      await SecureStore.setItemAsync("username", result.data.login.username)
      setIsSignedIn(true)
      // navigation.navigate('Home');
    } catch (error) {
      Alert.alert(error.message)
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../assets/Twitter-X-White-Logo-PNG-removebg-preview.png")}
          />
        </View>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          placeholderTextColor="#fff"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#fff"
          secureTextEntry={true}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRegisterPress}>
          <Text style={styles.registerText}>Don't have an account? Register here</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '100',
    color: '#fff',
    backgroundColor: '#333',
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    width: '100',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
  },
  registerText: {
    color: '#fff',
  },
});
