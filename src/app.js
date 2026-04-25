require('dotenv').config();

require('./utils/cronjob');

// server.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database"); // Ensure the database is connected
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

// FRONTEND ORIGIN — change if your React runs on a different port
// const FRONTEND_ORIGIN = "http://15.206.222.88";
const allowedOrigins = [
  "http://15.206.222.88",
  "https://your-app-name.vercel.app"
];


app.use(cookieParser());
app.use(express.json());

// CORS: allow your frontend origin and credentials (cookies)
// Must be placed BEFORE your routes
// app.use(
//   cors({
//     origin: [FRONTEND_ORIGIN,"http://localhost:5173"],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//   }),
// );


app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));


// optional: simple logger for CORS preflight debugging
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    console.log(
      "Preflight (OPTIONS) for",
      req.path,
      "from",
      req.header("origin"),
    );
  }
  next();
});

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    // console.log("Database connected successfully");
 app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://15.206.222.88:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to DB", err);
  });
