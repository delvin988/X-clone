const Follow = require("../models/Follow");

const typeDefs = `#graphql
 
   type Follow {
        followingId: ID
        followerId: ID
        createdAt: String
        updatedAt: String
   }

   type Mutation{
      follow(id: ID) : Follow
   }
 `;

const resolvers = {
   Mutation: {
      follow: async (_, args, contextValue) => {
         try {
            const {id} = args
            // console.log(id);
            const info = contextValue.auth()
            const followingIdAndFollowerId = {
               followingId: id,
               followerId: info.id
            }
            const followUser = await Follow.follow(followingIdAndFollowerId)
            // console.log(followUser);
            return followUser
         } catch (error) {
            throw error
         }
      }
   },
};

module.exports = { typeDefs, resolvers };
