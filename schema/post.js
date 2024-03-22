const redis = require("../config/redis");
const Post = require("../models/Posts");
const User = require("../models/User");

const typeDefs = `#graphql

  type Post {
    _id: ID
    content: String
    imgUrl: String
    tags: [String]
    authorId: ID
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
    author: author
  }

  type author{
   name: String
  }

  type Comment {
    content: String
    username: String
    createdAt: String
    updatedAt: String

  }

  type Like {
    username: String
    createdAt: String
    updatedAt: String

  }

  type Query {
    posts: [Post]
    postById(_id: ID): Post

  }

  type Mutation {
    addPost(content: String, tags: [String], imgUrl: String) : Post
    addComment(id: ID, content: String) : Post
    addLike(id: ID) : Post
  }
`;

const resolvers = {
   Query: {
      posts: async (_, __, contextValue) => {
         try {
            const info = contextValue.auth();
            const postRedis = await redis.get("Posts:All");
            if (postRedis) {
               const redisPost = JSON.parse(postRedis);
               return redisPost;
            }
            const Posts = await Post.findAll();
            const Data = await redis.set("Posts:All", JSON.stringify(Posts));
            // console.log(postRedis, "><><><");
            return Posts;
         } catch (error) {
            throw error;
         }
      }, //posts didapat dari Query

      postById: async (_, args, contextValue) => {
         try {
            const info = contextValue.auth();
            const { _id } = args;
            const post = await Post.findById(_id);
            return post;
         } catch (error) {
            throw error;
         }
      },
   },

   Mutation: {
      addPost: async (_, args, contextValue) => {
         try {
            const info = contextValue.auth();
            const id = info.id;
            if (!id) throw new Error("authorId is required");
            const { content, tags, imgUrl } = args;
            if (!content) throw new Error("content is required");
            const post = await Post.create({ content, tags, imgUrl, authorId: id, comments: [], likes: [] });
            await redis.del("Posts:All");
            return post;
         } catch (error) {
            throw error;
         }
      },

      addComment: async (_, args, contextValue) => {
         try {
            const { content, id } = args;
            if (!content) throw new Error("content is required");
            const info = contextValue.auth();
            const idUser = info.id;
            const dataUser = await User.findById(idUser);
            if (!dataUser || !dataUser.username) throw new Error("username is required");
            const commentByUser = await Post.createComment({ content, username: dataUser.username }, id);
            const resultPost = await Post.findById(id);
            await redis.del("Posts:All");
            return resultPost;
         } catch (error) {
            throw error;
         }
      },
      addLike: async (_, args, contextValue) => {
         try {
            const { id } = args;
            const info = contextValue.auth();
            const userId = info.id;
            const dataUser = await User.findById(userId);

            if (!dataUser || !dataUser.username) throw new Error("username is required");

            const like = await Post.likes({ username: dataUser.username }, id);
            const resultLike = await Post.findById(id);
            await redis.del("Posts:All");
            return resultLike;
         } catch (error) {
            throw error;
         }
      },
   },
};

module.exports = { typeDefs, resolvers };
