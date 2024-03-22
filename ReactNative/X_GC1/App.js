import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ApolloProvider } from '@apollo/client';
import Login from './pages/LoginScreen';
import Register from './pages/Register';
import HomePage from './pages/home';
import client from './config/apollo';
import Detail from './pages/Detail';
import { AuthContext } from './context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import { View, Text, Button } from 'react-native';
import LogOut from './pages/logOut';
import AddPostForm from './pages/addPost';
import SearchUser from './pages/searchUser';
import Profile from './pages/userProfile';

import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getToken() {
            try {
                let token = await SecureStore.getItemAsync("accessToken");
                if (token) setIsSignedIn(true);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        getToken();
    }, []);

    if (isLoading) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
            <ApolloProvider client={client}>
                <NavigationContainer>
                    <Stack.Navigator>
                        {isSignedIn ? (
                            <>
                                <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
                                <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
                                <Stack.Screen name="Detail" component={Detail} options={{ headerShown: false }} />
                                <Stack.Screen name="AddPost" component={AddPostForm} options={{ headerShown: false }} />

                            </>
                        ) : (
                            <>
                                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                            </>
                        )}
                    </Stack.Navigator>
                </NavigationContainer>
            </ApolloProvider>
        </AuthContext.Provider>
    );
};

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Search') {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (route.name === 'Logout') {
                        iconName = focused ? 'log-out' : 'log-out-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: 'black',
                inactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
            <Tab.Screen name="Search" component={SearchUser} options={{ headerShown: false }} />
            <Tab.Screen name="Logout" component={LogOut} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

export default App;
