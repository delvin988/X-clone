const redis = require("../config/redis");
const { hashPass, comparePass } = require("../helper/bcrypt");
const { userToken } = require("../helper/jwt");
const User = require("../models/User");

const typeDefs = `#graphql

  type User {
    _id: ID
    name: String
    username: String
    email: String
    followingDetail: [followingDetail]
    followerDetail: [followerDetail]
  }
  type followingDetail{
   username: String
  }
  type followerDetail{
   username: String
  }
  type Token {
    accessToken: String
    id: ID
    username: String
  }

  type Query {
    users: [User]
    userById(_id: ID!): User
    userByUsername(username: String!): [User]
  }

  type Mutation {
    register(name: String, username: String, email: String, password: String) : User
    login(email: String!, password: String!): Token
  }
`;

const resolvers = {
   Query: {
      users: async (_, __, contextValue) => {
         try {
            const info = contextValue.auth();
            const userRedis =await redis.get("User:All")
            if(userRedis){
               const redisUser = JSON.parse(userRedis)
               return redisUser
            }
            const Users = await User.findAll();
            const Data = await redis.set("User:All", JSON.stringify(Users))
            return Users;
         } catch (error) {
            console.log(error);
            throw error;
         }
      },
      userById: async (_, args, contextValue) => {
         try {
            const info = contextValue.auth();
            const { _id } = args;
            const Users = await User.findById(_id);
            return Users;
         } catch (error) {
            throw error;
         }
      },
      userByUsername: async (_, args, contextValue) => {
         try {
            const info = contextValue.auth();
            const { username } = args;
            const users = await User.findByUsername(username);
            return users;
         } catch (error) {
            throw error;
         }
      },
   },
   Mutation: {
      login: async (_, args) => {
         try {
            const { email, password } = args;
            const user = await User.findByEmail(email);
            if (!user) {
               throw new Error("email/password invalid");
            }
            const validated = comparePass(password, user.password);
            if (!validated) {
               throw new Error("email/password invalid");
            }
            const token = {
               accessToken: userToken({
                  id: user._id,
                  email: user.email,
               }),
               id: user._id,
               username: user.username
            };
            return token;
         } catch (error) {
            console.log(error);
            throw error;
         }
      },

      register: async (_, args) => {
         try {
            const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const { name, username, password, email } = args;
            if (!username) throw new Error("username is required");
            const existingUsername = await User.findUsernameValidation(username);
            if (existingUsername) throw new Error("Username already exist");
            if (!email) throw new Error("email is required");
            const existingEmail = await User.findByEmail(email);
            if (existingEmail) throw new Error("Email already exists");
            if (!EMAIL_REGEX.test(email)) throw new Error("Invalid email format");
            if (!password) throw new Error("password is required");
            if (password.length < 5) throw new Error("Password must be at least 5 characters long");
            const hashedPass = hashPass(password);
            const Users = await User.create({ name, username, password: hashedPass, email });
            await redis.del("User:All");
            return Users;
         } catch (error) {
            throw error;
         }
      },
   },
};

module.exports = { typeDefs, resolvers };
