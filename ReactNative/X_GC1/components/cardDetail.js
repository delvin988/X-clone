import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const CardDetail = ({ name, content, imgUrl, tags, comments }) => {
  const profileImage = 'https://via.placeholder.com/150';

  return (
    <View style={styles.card}>
      <Image style={styles.profileImage} source={{ uri: profileImage }} />
      <View style={styles.content}>
        <Text style={[styles.name, styles.textColor]}>{name}</Text>
        <Text style={[styles.tweet, styles.textColor]}>{content}</Text>
        {imgUrl && <Image style={styles.img} source={{ uri: imgUrl }} />}
        <View style={styles.tagsContainer}>
          <Text style={[styles.tags, styles.textColorTags]}>Tags: {tags}</Text>
        </View>
        <View style={styles.commentsContainer}>
          {comments.map((comment, index) => (
            <View key={index} style={styles.comment}>
              <View style={styles.commentHeader}>
                <Image style={styles.commentProfileImage} source={{ uri:profileImage }} />
                <Text style={styles.commentUsername}>Commented by: {comment.username}</Text>
              </View>
              <View style={styles.commentContent}>
                <Text style={styles.commentText}>{comment.content}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'black',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tweet: {
    fontSize: 16,
    marginBottom: 5,
  },
  img: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  tagsContainer: {
    marginTop: 10,
  },
  tags: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 5,
  },
  commentsContainer: {
    marginTop: 10,
  },
  comment: {
    backgroundColor: '#222',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  commentProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentUsername: {
    color: '#666',
    marginRight: 10,
  },
  commentContent: {
    marginBottom: 5,
  },
  commentText: {
    color: '#fff',
  },
  textColor: {
    color: 'white',
  },
  textColorTags: {
    color: 'black'
  },
});

export default CardDetail;
