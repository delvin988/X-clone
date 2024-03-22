import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import CardDetail from '../components/cardDetail';

const GET_DETAIL = gql`
  query Query($id: ID!) {
    postById(_id: $id) {
      _id
      content
      imgUrl
      tags
      comments {
        content
        username
      }
      likes {
        username
      }
      author {
        name
      }
    }
  }
`;

const COMMENT = gql`
  mutation Mutation($addCommentId: ID, $content: String) {
    addComment(id: $addCommentId, content: $content) {
      comments {
        content
        username
        createdAt
        updatedAt
      }
    }
  }
`

export default function Detail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { _id } = route.params;
  const { loading, error, data, refetch } = useQuery(GET_DETAIL, {
    variables: { id: _id }
  });
  const [content, setCommentContent] = useState('');
  const [addNewComment] = useMutation(COMMENT, {
    refetchQueries: [GET_DETAIL]
  })

  if (loading) return <ActivityIndicator size="large" style={styles.loadingIndicator} />;
  if (error) return <Text style={[styles.errorText, { color: 'white' }]}>Error loading data...</Text>;

  const renderItem = ({ item }) => {
    return (
      <CardDetail
        _id={item._id}
        name={item.author.name}
        content={item.content}
        imgUrl={item.imgUrl}
        tags={item.tags}
        comments={item.comments}
      />
    );
  };

  async function handleSubmitComment() {
    try {
      const result = await addNewComment({
        variables:{
          addCommentId: _id,
          content
        }
      });
      setCommentContent('');
      console.log(result);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: 'black' }]}>
      <View style={styles.container}>
        <FlatList
          data={[data.postById]}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
        <View style={styles.commentContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor="#999"
            value={content}
            onChangeText={setCommentContent}
          />
          <TouchableOpacity onPress={handleSubmitComment} style={[styles.commentButton, styles.commentButtonWhite]}>
            <Text style={[styles.commentButtonText, styles.commentButtonTextBlack]}>Comment</Text>
          </TouchableOpacity>
        </View>
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
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    color: 'white',
    backgroundColor: '#333',
  },
  commentButton: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  commentButtonWhite: {
    backgroundColor: 'white',
  },
  commentButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentButtonTextBlack: {
    color: 'black',
  },
});

