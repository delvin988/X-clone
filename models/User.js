const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

class User {
   static async findAll() {
      const userCollection = database.collection("users");

      const options = {
         sort: { name: 1 },
         projection: { password: 0 },
      };
      const usersCollection = await userCollection.find({}, options).toArray();
      return usersCollection;
   }

   static async findById(_id) {
      const userCollection = database.collection("users");
      const agg = 
      [
         {
           '$match': {
             '_id': new ObjectId(_id)
           }
         }, {
           '$lookup': {
             'from': 'follows', 
             'localField': '_id', 
             'foreignField': 'followerId', 
             'as': 'following'
           }
         }, {
           '$lookup': {
             'from': 'users', 
             'localField': 'following.followingId', 
             'foreignField': '_id', 
             'as': 'followingDetail'
           }
         }, {
           '$project': {
             'followingDetail._id': 0, 
             'followingDetail.password': 0, 
             'followingDetail.name': 0, 
             'followingDetail.email': 0
           }
         }, {
           '$lookup': {
             'from': 'follows', 
             'localField': '_id', 
             'foreignField': 'followingId', 
             'as': 'followers'
           }
         }, {
           '$lookup': {
             'from': 'users', 
             'localField': 'followers.followerId', 
             'foreignField': '_id', 
             'as': 'followerDetail'
           }
         }, {
           '$project': {
             'followerDetail._id': 0, 
             'followerDetail.password': 0, 
             'followerDetail.name': 0, 
             'followerDetail.email': 0
           }
         }
       ]
      const usersCollection = await userCollection.aggregate(agg).toArray()
      return usersCollection[0];
   }

   static async create(newUser) {
      const userCollection = database.collection("users");
      const result = await userCollection.insertOne(newUser);
      delete newUser.password
      const resultUser = {
         _id: result.insertedId,
         ...newUser
      }
      // console.log(resultUser);
      return resultUser
   }

   static async findUsernameValidation(username){
      const userCollection = database.collection("users");
      const searchUser = await userCollection.findOne({
         username: username
      })
      return searchUser
   }

   static async findByUsername(username) {
      const userCollection = database.collection("users");
      const regex = new RegExp('^' + username, 'i');
      const usersCollection = await userCollection.find({
         username: regex,
      }).toArray();
      return usersCollection;
   }

   static async findByEmail(email){
      const userCollection = database.collection("users");
      const usersCollection = await userCollection.findOne({
         email: email
      })
      return usersCollection
   }
}

module.exports = User;
