import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import CardProfile from '../components/cardProfile';

const GET_USER = gql`
 query Query($id: ID!) {
  userById(_id: $id) {
    followerDetail {
      username
    }
    followingDetail {
      username
    }
    name
    username
    _id
  }
}
`;

export default function Profile() {
  const navigation = useNavigation();
  const route = useRoute();
  const { _id } = route.params;
  const { loading, error, data, refetch } = useQuery(GET_USER, {
    variables: { id: _id }
  });
  if (loading) return <ActivityIndicator size="large" style={styles.loadingIndicator} />;
  if (error) return <Text style={[styles.errorText, { color: 'white' }]}>Error loading data...</Text>;

  const renderItem = ({ item }) => {
    return (
      <CardProfile
        _id={item._id}
        followerDetail={item.followerDetail}
        followingDetail={item.followingDetail}
        name={item.name}
        username={item.username}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: 'black' }]}>
      <View style={styles.container}>
        <FlatList
          data={[data.userById]}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
    color: 'white',
  },
});
