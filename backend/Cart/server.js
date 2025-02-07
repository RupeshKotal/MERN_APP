// const express = require('express');
// const cors = require('cors');
// const app = express();


// require('dotenv').config();
// require('./config/db_conn');
// const port = process.env.PORT || 9003;

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));




// app.use("/cart", require("./routes/cartRouter"))

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });


const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const { mongoose, redisClient } = require("./config/db_conn"); // ✅ Ensure DB connection loads first

const port = process.env.PORT || 9003;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/cart", require("./routes/cartRouter"));

// ✅ Graceful Shutdown Handling
process.on("SIGINT", async () => {
    console.log("\n⏳ Shutting down cart service...");

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
    console.log(`✅ Cart service running on port ${port}`);
});

