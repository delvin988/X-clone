const { database } = require("../config/mongodb");
const { ObjectId } = require("mongodb");

class Post {
   static async findAll() {
      const postCollection = database.collection("posts");

      const options = {
         sort: { createdAt: -1 },
      };
      // const postsCollection = await postCollection.find({}, options).toArray();
      const agg = [
         {
            $lookup: {
               from: "users",
               localField: "authorId",
               foreignField: "_id",
               as: "author",
            },
         },
         {
            $unwind: {
               path: "$author",
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $project: {
               "author._id": 0,
               "author.username": 0,
               "author.password": 0,
               "author.email": 0,
            },
         },
      ];
      const postsCollection = await postCollection.aggregate(agg).toArray();
      return postsCollection;
   }

   static async findById(_id) {
      const postCollection = database.collection("posts");
      console.log(_id);
      const agg = [
         {
            $match: {
               _id: new ObjectId(_id),
            },
         },
         {
            $lookup: {
               from: "users",
               localField: "authorId",
               foreignField: "_id",
               as: "author",
            },
         },
         {
            $unwind: {
               path: "$author",
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $project: {
               "author._id": 0,
               "author.username": 0,
               "author.password": 0,
               "author.email": 0,
            },
         },
      ];
      const postCollections = await postCollection.aggregate(agg).toArray();
      // console.log(postCollections);
      return postCollections[0];
   }

   static async create(newPost) {
      const postCollection = database.collection("posts");
      const newAddPost = {
         ...newPost,
         createdAt: new Date(),
         updatedAt: new Date(),
      };
      const result = await postCollection.insertOne(newAddPost);
      const resultPost = {
         _id: result.insertedId,
         ...newAddPost,
      };
      return resultPost;
   }

   static async createComment(comment, id) {
      const postCollection = database.collection("posts");

      const searchPost = await postCollection.findOne({
         _id: new ObjectId(id),
      });

      if (!searchPost) {
         throw new Error("Post not found");
      }

      const newComment = {
         ...comment,
         createdAt: new Date(),
         updatedAt: new Date(),
      };

      const result = await postCollection.updateOne({ _id: new ObjectId(id) }, { $push: { comments: newComment } });
      const updatedPost = await postCollection.findOne({
         _id: new ObjectId(id),
      });
      return updatedPost;
   }

   static async likes(likes, id) {
      const postCollection = database.collection("posts");
      const searchPost = await postCollection.findOne({
         _id: new ObjectId(id),
      });

      if (!searchPost) {
         throw new Error("Post not found");
      }

      const isLiked = searchPost.likes.map((el) => el.username).includes(likes.username);
      if (isLiked) throw new Error("Post already liked");

      const newLike = {
         ...likes,
         createdAt: new Date(),
         updatedAt: new Date(),
      };

      const result = await postCollection.updateOne({ _id: new ObjectId(id) }, { $push: { likes: newLike } });

      const updatedPost = await postCollection.findOne({
         _id: new ObjectId(id),
      });
      return updatedPost;
   }
}

module.exports = Post;
