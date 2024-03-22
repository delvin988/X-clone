const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

const userCollection = database.collection("users");
const followCollection = database.collection("follows");

class Follow {
   static async follow(followingIdAndFollowerId) {
    const searchUser = await userCollection.findOne({
        _id: new ObjectId(followingIdAndFollowerId.followingId)
    })
    const followerIdCheck = followingIdAndFollowerId.followerId.toString() 
    const followingIdCheck = searchUser._id.toString()

    if(followerIdCheck == followingIdCheck) throw new Error("You can't follow yourself")
    const handleFollow = await followCollection.findOne({
        followerId: new ObjectId(followerIdCheck),
        followingId: new ObjectId (followingIdCheck)
    })
    if(handleFollow) throw new Error ("Already followed")

    const followUser = await followCollection.insertOne({
        followingId: new ObjectId(searchUser._id),
        followerId: followingIdAndFollowerId.followerId,
        createdAt: new Date(),
        updatedAt: new Date()
    })
    const searchFollow = await followCollection.findOne({
        _id: followUser.insertedId
    })
    return searchFollow
   }
}

module.exports = Follow;
