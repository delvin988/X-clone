import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet, SafeAreaView } from 'react-native';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import CardUser from '../components/cardSearchUser';
import * as SecureStore from 'expo-secure-store';

export const SEARCH_USER = gql`
 query Query($username: String!) {
  userByUsername(username: $username) {
    _id
    name
    username
    email
    followingDetail {
      username
    }
    followerDetail {
      username
    }
  }
}
`;


const SearchUser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchUser, { loading, error, data }] = useLazyQuery(SEARCH_USER);
  const [idLogin, setIdLogin] = useState('');
  const [followingDetail, setFollowingDetail] = useState([]);

  useEffect(() => {
    const retrieveIdLogin = async () => {
      try {
        const id = await SecureStore.getItemAsync('id');
        setIdLogin(id);
        console.log("kosong",idLogin, "<<<<");
      } catch (error) {
        console.log(error.message);
      }
    };

    if (idLogin == "") {
      retrieveIdLogin();
    }
  }, []);


  const handleSearch = () => {
    searchUser({ variables: { username: searchQuery } });
  };

  const renderItem = ({ item }) => <CardUser user={item} idLogin={idLogin} followingDetail={followingDetail}/>;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: 'black' }]}>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="white"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleSearch}
          >
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {data && data.userByUsername && (
        <FlatList
          data={data.userByUsername}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    marginTop: 40,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'white',
    marginRight: 10,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'black',
  },
});

export default SearchUser;
