import React, { useContext } from 'react';
import { View, Button } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';

const LogOut = () => {
    const { setIsSignedIn } = useContext(AuthContext);

    async function handleSignOut () {
        try {
            await SecureStore.deleteItemAsync("accessToken")
            setIsSignedIn(false);
            
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Logout" onPress={() => {handleSignOut()}} />
        </View>
    );
};

export default LogOut;
