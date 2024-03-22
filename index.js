if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const {typeDefs: userTypeDefs, resolvers: userResolvers} = require ("./schema/user")
const {typeDefs: postTypeDefs, resolvers: postResolvers} = require ("./schema/post")
const {typeDefs: followTypeDefs, resolvers: followResolvers} = require ("./schema/follow");
const { verifyToken } = require("./helper/jwt");
const { ObjectId } = require("mongodb");
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
   typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
   resolvers: [userResolvers, postResolvers, followResolvers],
   introspection: true,
   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],

});
(async () => {
  await server.start();
  
  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        return {
          auth: () => {
            const auth = req.headers.authorization;
    
            if (!auth) throw new Error("Authentication Failed");
    
            const token = auth.split(" ")[1];
            const decoded = verifyToken(token);
            decoded.id = new ObjectId(String(decoded.id));
            return decoded;
          },
        };
      },
    }),
  );
  
  await new Promise((resolve) => httpServer.listen({ port: process.env.PORT || 3000 }, resolve));
  
  console.log(`🚀 Server ready at http://localhost:3000/`);
})()

// startStandaloneServer(server, {
//   listen: { port: process.env.PORT || 3000 },
//   context: async ({ req }) => {
//     return {
//       auth: () => {
//         const auth = req.headers.authorization;

//         if (!auth) throw new Error("Authentication Failed");

//         const token = auth.split(" ")[1];
//         const decoded = verifyToken(token);
//         decoded.id = new ObjectId(String(decoded.id));
//         return decoded;
//       },
//     };
//   },
// }).then(({ url }) => {
//   console.log(`🚀  Server ready at: ${url}`);
// });
  