
const { MongoClient, ServerApiVersion } = require('mongodb');
//connection uri v 2.2.12
const uri = "mongodb://delvin98:yus30101998@ac-9uz5lm7-shard-00-00.dj8xhjj.mongodb.net:27017,ac-9uz5lm7-shard-00-01.dj8xhjj.mongodb.net:27017,ac-9uz5lm7-shard-00-02.dj8xhjj.mongodb.net:27017/?ssl=true&replicaSet=atlas-sbouxu-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const database = client.db('X_GC1');


module.exports = { database }