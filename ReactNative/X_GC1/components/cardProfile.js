import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const CardProfile = ({ _id, followerDetail, followingDetail, name, username }) => {
  // Gambar profil sementara
  const profileImage = 'https://via.placeholder.com/150';

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image style={styles.profileImage} source={{ uri: profileImage }} />
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.username}>@{username}</Text>
        </View>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailTitle}>Followers:</Text>
        <View style={styles.detailContent}>
          {followerDetail.map((follower, index) => (
            <Text key={index} style={styles.detailItem}>{follower.username}</Text>
          ))}
        </View>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailTitle}>Following:</Text>
        <View style={styles.detailContent}>
          {followingDetail.map((following, index) => (
            <Text key={index} style={styles.detailItem}>{following.username}</Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  username: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 10,
  },
  detailContainer: {
    marginBottom: 10,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  detailContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 5,
    color: 'black',
  },
});

export default CardProfile;
