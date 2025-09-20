// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./db/config");
// const path = require("path");
// // const mongoSanitize = require("express-mongo-sanitize");
// const mongoSanitize = require("@exortek/express-mongo-sanitize");
// dotenv.config();
// connectDB();

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// // using mongo-sanitize middlware to prevent NoSQL Injection
// app.use(mongoSanitize());
// // API Routes
// app.get('/health', (req,res)=> res.status(200).send('OK'));

// app.use("/api/submissions", require("./routes/submissionRoutes"));
// app.use("/api/admin", require("./routes/adminRoutes"));

// // Serve uploaded files
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, ()=> console.log(`Listening on ${PORT}`));

// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./db/config");
// const path = require("path");
// const mongoSanitize = require("@exortek/express-mongo-sanitize");

// dotenv.config();

// connectDB().catch(err => {
//   console.error("DB connection error:", err);
// });
// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(mongoSanitize());

// app.get('/health', (req,res)=> res.status(200).send('OK'));

// app.use("/api/submissions", require("./routes/submissionRoutes"));
// app.use("/api/admin", require("./routes/adminRoutes"));

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// module.exports = app;

// app.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const mongoSanitize = require("@exortek/express-mongo-sanitize");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(mongoSanitize());

app.get('/health', (req,res)=> res.status(200).send('OK'));

app.use("/api/submissions", require("./routes/submissionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

module.exports = app;
