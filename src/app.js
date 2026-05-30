require('dotenv').config();

require('./utils/cronjob');

// server.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database"); // Ensure the database is connected
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;


const allowedOrigins = [
  "http://15.206.222.88",
  "https://div-tinder-web.vercel.app",
  "http://localhost:5173"
];

app.use(cookieParser());
app.use(express.json());
 
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
const paymentRouter = require("./routes/payment");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

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