const Redis = require("ioredis");
const redis = new Redis({
        port:process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
        db:process.env.REDIS_DB
});

module.exports = redis