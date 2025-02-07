// const mongoose = require('mongoose');
// const redis = require('redis');
// require('dotenv').config();

// const redisClient = redis.createClient();

// // Promisify Redis functions for async/await usage
// // const getAsync = promisify(redisClient.get).bind(redisClient);
// // const setAsync = promisify(redisClient.set).bind(redisClient);

// const mongo_username = process.env.MONGO_USERNAME;
// const mongo_password = process.env.MONGO_PASSWORD;
// const mongo_cluster = process.env.MONGO_CLUSTER;
// const mongo_database = process.env.MONGO_DBNAME;


// mongoose.connect(`mongodb+srv://${mongo_username}:${mongo_password}@${mongo_cluster}/${mongo_database}?retryWrites=true&w=majority`
// , { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => console.log(`Connected to: ${mongoose.connection.name}`))
// .catch(err => console.log(err));



// // async function getDataFromDatabase(id) {
// //     // Check if the data is already cached
// //     const cachedData = await getAsync(id);
// //     if (cachedData) {
// //       console.log('Fetching data from cache');
// //       return JSON.parse(cachedData);
// //     }
  
// //     // If not cached, fetch data from the database
// //     console.log('Fetching data from the database');
// //     const data = await MyModel.findById(id).exec();
  
// //     // Cache the fetched data
// //     await setAsync(id, JSON.stringify(data));
  
// //     return data;
// //   }



// //   async function main() {
// //     const data1 = await getDataFromDatabase();
// //     console.log(data1);
  
// //     // Fetch the same data again to demonstrate caching
// //     const data2 = await getDataFromDatabase();
// //     console.log(data2);
// //   }
  
// //   main().catch(console.error);


// // mongoose.connect(`mongodb://localhost:27017`
// // , { useNewUrlParser: true, useUnifiedTopology: true })
// // .then(() => console.log(`Connected to: DB`))
// // .catch(err => console.log(err));


// module.exports = mongoose;


const mongoose = require("mongoose");
const redis = require("redis");
require("dotenv").config();

// ✅ Ensure MongoDB Environment Variables Exist
const mongo_username = process.env.MONGO_USERNAME || "admin";
const mongo_password = process.env.MONGO_PASSWORD || "password";
const mongo_cluster = process.env.MONGO_CLUSTER || "mongodb"; // ✅ Default to `mongodb` for Docker
const mongo_database = process.env.MONGO_DBNAME || "ecommerce";
const mongo_port = process.env.MONGO_PORT || "27017";

// ✅ Automatically Choose the Correct MongoDB URI
let MONGO_URI;
if (mongo_cluster.includes("mongodb.net")) {
  // ✅ MongoDB Atlas (Cloud)
  MONGO_URI = `mongodb+srv://${mongo_username}:${mongo_password}@${mongo_cluster}/${mongo_database}?retryWrites=true&w=majority`;
} else {
  // ✅ Local or Docker MongoDB
  MONGO_URI = `mongodb://${mongo_username}:${mongo_password}@${mongo_cluster}:${mongo_port}/${mongo_database}?authSource=admin`;
}

// ✅ Log Connection URI for Debugging
console.log("🔍 Connecting to MongoDB with URI:", MONGO_URI);

// ✅ MongoDB Connection with Retry Logic
async function connectMongoDB(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`);
      } else {
        console.log("⚠️ Mongoose already connected.");
      }
      return;
    } catch (err) {
      console.error(`❌ MongoDB Connection Attempt ${i + 1} Failed:`, err);
      if (i < retries - 1) {
        console.log(`⏳ Retrying MongoDB connection in ${delay / 1000} seconds...`);
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
  console.error("🚨 MongoDB connection failed after multiple attempts.");
  process.exit(1); // Exit if MongoDB fails after retries
}

// ✅ Call MongoDB Connection Function
connectMongoDB();

// ✅ Redis Connection Handling (Optional)
const useRedis = process.env.USE_REDIS === "true";
let redisClient;

if (useRedis) {
  redisClient = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || 6379
    }
  });

  async function connectRedis() {
    try {
      await redisClient.connect();
      console.log("✅ Redis Connected Successfully");
    } catch (err) {
      console.error("❌ Redis Connection Error:", err);
    }
  }

  connectRedis();
} else {
  console.log("⚠️ Redis is disabled. Set USE_REDIS=true in .env to enable.");
}

// ✅ Export Mongoose & Redis Client
module.exports = {
  mongoose,
  redisClient: useRedis ? redisClient : null
};

