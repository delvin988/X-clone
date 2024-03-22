import { gql, useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Animated } from 'react-native';

const REGISTER = gql`
mutation Mutation($name: String, $username: String, $email: String, $password: String) {
  register(name: $name, username: $username, email: $email, password: $password) {
    email
    name
    username
  }
}
`

export default function Register({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [addUser] = useMutation(REGISTER)

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  async function handleRegister() {
    try {
      const result = await addUser({
        variables:{
          email, name ,username, password
        }
      })
      navigation.navigate('Login')
      console.log(result);
    } catch (error) {
      console.log(error.message);
    }

  };

  const handleLoginNavigation = () => {
    navigation.navigate('Login');
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
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Name"
          placeholderTextColor="#fff"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Username"
          placeholderTextColor="#fff"
          value={username}
          onChangeText={setUsername}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          placeholderTextColor="#fff"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#fff"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLoginNavigation}>
          <Text style={styles.registerText}>Already have an account? Login here</Text>
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
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
  },
  registerText: {
    marginTop: 10,
    color: '#fff',
  },
});
