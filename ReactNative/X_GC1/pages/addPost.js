import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useMutation, gql} from "@apollo/client"
import { GET_POSTS } from './home';

const ADD_POST = gql`
mutation Mutation($content: String, $tags: [String], $imgUrl: String) {
  addPost(content: $content, tags: $tags, imgUrl: $imgUrl) {
    content
    tags
    imgUrl
  }
}
`
const AddPostForm = ({navigation}) => {
  const [content, setPostContent] = useState('');
  const [tags, setTags] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const [addNewPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_POSTS]
  })

async function handleSubmit() {
  try {
    const result = await addNewPost({
      variables:{
     content, tags, imgUrl}
    })
    setPostContent('')
    setTags('')
    setImgUrl('')
    navigation.navigate('Home');
    } catch (error) {
    console.log(error.message);
  }
}

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholderTextColor="white"
          placeholder="What's on your mind?"
          multiline
          value={content}
          onChangeText={setPostContent}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="white"
          placeholder="Tags"
          value={tags}
          onChangeText={setTags}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="white"
          placeholder="Image URL"
          value={imgUrl}
          onChangeText={setImgUrl}
        />
      <Button title="Post" onPress={handleSubmit} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  form: {
    padding: 20,
  },
  input: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    color: 'white', // Text color
  },
});

export default AddPostForm;
