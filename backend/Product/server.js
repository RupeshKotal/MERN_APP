// const express = require('express');
// const cors = require('cors');
// const app = express();
// const mongoose = require("mongoose");

// const MONGO_URI = "mongodb://admin:password@mongodb:27017/ecommerce?authSource=admin";

// mongoose.connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//     .then(() => console.log("✅ MongoDB Connected Successfully"))
//     .catch(err => console.error("❌ MongoDB Connection Error:", err));

// require('dotenv').config();
// require('./config/db_conn');
// const port = process.env.PORT || 9000;

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));



// app.use("/products", require("./routes/productRouter"))
// app.use("/filter", require("./routes/filterRouter"))

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

const express = require('express');
const cors = require('cors');
require('dotenv').config();  // ✅ Load environment variables before anything else

const app = express();
const { mongoose, redisClient } = require('./config/db_conn'); // ✅ Ensure DB connection loads first

const port = process.env.PORT || 9000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/products", require("./routes/productRouter"));
app.use("/filter", require("./routes/filterRouter"));

// ✅ Graceful Shutdown Handling
process.on("SIGINT", async () => {
    console.log("\n⏳ Shutting down server...");

    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("✅ MongoDB Connection Closed");

    // Close Redis connection if enabled
    if (redisClient) {
        await redisClient.quit();
        console.log("✅ Redis Connection Closed");
    }

    process.exit(0);
});

// ✅ Global Error Handling
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start Server
app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});


