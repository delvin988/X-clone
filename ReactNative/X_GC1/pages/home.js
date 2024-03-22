import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text , TouchableOpacity} from 'react-native';
import Card from '../components/card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { gql, useQuery } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';


export const GET_POSTS = gql`
  query Posts {
    posts {
      _id
      author {
        name
      }
      content
      imgUrl
      likes {
      username
    }
    }
  }
`;

const HomePage = ({navigation}) => {
  const { loading, error, data } = useQuery(GET_POSTS);
  const [usernameLogin, setUsernameLogin] = useState('');

  if (loading) return <ActivityIndicator size="large" style={styles.loadingIndicator} />;
  if (error) return <Text style={styles.errorText}>Error loading data...</Text>;

  // useEffect(() => {
  //   const retrieveUsernameLogin = async () => {
  //     try {
  //       const username = await SecureStore.getItemAsync('username');
  //       setUsernameLogin(username);
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   };

  //   if (usernameLogin) {
  //     retrieveUsernameLogin();
  //   }
  // }, []);

  const renderItem = ({ item }) => (
    <Card
      _id={item._id}
      name={item.author.name}
      content={item.content}
      imgUrl={item.imgUrl}
      usernameLogin={usernameLogin}
      likes={item.likes.map(like => like.username)} 

    />
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: 'black' }]}>
      <View style={styles.container}>
        <FlatList
          data={data.posts}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
       <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddPost')}
        >
          <Feather name="plus" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1c9aef',
    borderRadius: 35,
    width: 53,
    height: 53,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
  },
});

export default HomePage;
