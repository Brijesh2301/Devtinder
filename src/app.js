// server.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();

// Use environment variable in production
const PORT = process.env.PORT || 3000;

// IMPORTANT: In production use your real domain
const FRONTEND_ORIGIN =
  process.env.NODE_ENV === "production"
    ? "https://devtinder24.online"
    : "http://localhost:5173";

app.use(cookieParser());
app.use(express.json());

// CORS Configuration
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// Optional preflight logger
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
    // 🔐 IMPORTANT CHANGE HERE
    app.listen(PORT, "127.0.0.1", () => {
      console.log(`Server running securely on http://127.0.0.1:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to DB", err);
  });