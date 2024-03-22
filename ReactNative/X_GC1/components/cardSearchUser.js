import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';

const FOLLOW = gql`
  mutation Mutation($followId: ID) {
    follow(id: $followId) {
      followerId
      followingId
    }
  }
`;

const FOLLOWING = gql`
  query Query($id: ID!) {
    userById(_id: $id) {
      followerDetail {
        username
      }
      followingDetail {
        username
      }
    }
  }
`;

const CardUser = ({ user, idLogin }) => {
  const [followId, setFollowId] = useState('');
  const [followed, setFollowed] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigation = useNavigation();
  const [follow] = useMutation(FOLLOW);
  const{_id} = user

  const handleProfile = () => {
    navigation.navigate('Profile',  {_id} );
  };

  const {loading, error, data, refetch} = useQuery(FOLLOWING, {
    variables: {
        id: idLogin
    },
    onCompleted: (data) => {
        if (data && data.userById) {
          setFollowed(data.userById.followingDetail);
          setIsFollowing(data.userById.followingDetail.some(item => item.username === user.username));
        }
      },
  })
  async function handleFollow() {
    try {
      const result = await follow({
        variables: {
          followId: user._id
        },
      });
      setFollowId(user._id);
      setIsFollowing(true);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <TouchableHighlight onPress={handleProfile} underlayColor="transparent">
        <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.profileImage} />
        </TouchableHighlight>
        <View style={styles.userInfo}>
        <TouchableHighlight onPress={handleProfile} underlayColor="transparent">
          <Text style={styles.name}>{user.name}</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={handleProfile} underlayColor="transparent">
          <Text style={styles.username}>@{user.username}</Text>
          </TouchableHighlight>
        </View>
        {isFollowing ? (
          <TouchableOpacity style={styles.followButton} disabled={true}>
            <Text style={styles.followButtonText}>Following</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: "black",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    paddingVertical: 2,
    paddingHorizontal: 10,
    margin: 0,
    borderRadius: 0,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  username: {
    color: "white",
    marginBottom: 5,
  },
  followButton: {
    backgroundColor: "black",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  followButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CardUser;
