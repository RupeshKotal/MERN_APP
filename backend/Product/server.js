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
require('./config/db_conn'); // ✅ Use the existing MongoDB connection in db_conn.js

const port = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/products", require("./routes/productRouter"));
app.use("/filter", require("./routes/filterRouter"));

app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});

