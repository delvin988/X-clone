import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableHighlight, Alert } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Link, useNavigation } from "@react-navigation/native";
import { gql, useMutation } from "@apollo/client";

const LIKE = gql`
   mutation Mutation($addLikeId: ID) {
      addLike(id: $addLikeId) {
         likes {
            username
         }
      }
   }
`;

const Card = ({ _id, name, content, imgUrl}) => {
   const profileImage = "https://via.placeholder.com/150";
   const navigation = useNavigation();
   const [like] = useMutation(LIKE);
   const [isLiked, setIsLiked] = useState(false);

  //  useEffect(() => {
  //   const isLikedByUser = likes.some(like => like.username === usernameLogin);
  //   setIsLiked(isLikedByUser);
  // }, [likes, usernameLogin]);
  
   const handleImagePress = () => {
      navigation.navigate("Detail", { _id });
   };

   async function handleLike() {
      try {
         await like({
            variables: {
               addLikeId: _id
            }
         });
         setIsLiked(true);
      } catch (error) {
        Alert.alert(error.message)
         console.log(error);
      }
   }

   return (
      <View style={[styles.card, styles.cardBackground]}>
         <Image style={styles.profileImage} source={{ uri: profileImage }} />
         <View style={styles.content}>
            <Text style={[styles.name, styles.textColor]}>{name}</Text>
            <Text style={[styles.username, styles.textColor]}>@{name}</Text>
            <TouchableHighlight onPress={handleImagePress} underlayColor="transparent">
               <Text style={[styles.tweet, styles.textColor]}>{content}</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={handleImagePress} underlayColor="transparent">
               <Image style={styles.img} source={{ uri: imgUrl }} />
            </TouchableHighlight>
            <View style={styles.iconContainer}>
            <TouchableHighlight onPress={handleImagePress} underlayColor="transparent">
               <View style={styles.icon}>
                  <EvilIcons name="comment" size={24} color="white" />
                  <Text style={[styles.iconText, styles.textColor]}>Comment</Text>
               </View>
               </TouchableHighlight>
               <TouchableHighlight onPress={handleLike} underlayColor="transparent">
                  <View style={styles.icon}>
                     {isLiked ? (
                        <AntDesign name="heart" size={17} color="white" />
                     ) : (
                        <EvilIcons name="heart" size={24} color="white" />
                     )}
                     <Text style={[styles.iconText, styles.textColor]}>Like</Text>
                  </View>
               </TouchableHighlight>
               <TouchableHighlight onPress={handleImagePress} underlayColor="transparent">
               <View style={styles.icon}>
                  <EvilIcons name="eye" size={24} color="white" />
                  <Text style={[styles.iconText, styles.textColor]}>View</Text>
               </View>
               </TouchableHighlight>
            </View>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   card: {
      flexDirection: "row",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
   },
   cardBackground: {
      backgroundColor: "black",
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
      fontWeight: "bold",
      marginBottom: 5,
   },
   username: {
      color: "#666",
      marginBottom: 5,
   },
   tweet: {
      fontSize: 16,
   },
   img: {
      width: "100%",
      height: 200,
      marginTop: 10,
      borderRadius: 10,
   },
   iconContainer: {
      flexDirection: "row",
   },
   icon: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 10,
   },
   iconText: {
      marginLeft: 5,
   },
   textColor: {
      color: "white",
   },
});

export default Card;
