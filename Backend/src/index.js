import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import userRoute from "./routes/user.routes.js";
import googleRoute from "./routes/google.routes.js";
import postRoutes from "./routes/post.routes.js";
import passport from "passport";
import session from "express-session";

import "./config/google.passport.js";

import { Database } from "./config/db.config.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware configuration
app.use(
  session({
    secret: "IGramSecret", // change to a secure secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URL;

// login and signup
app.use("/", googleRoute);
app.use("/api/v1/users", userRoute);
app.use("/have", postRoutes);

// Connecting with database and creating object
const db = new Database(uri);
db.connect();

// Connecting with server
server.listen(PORT, () => {
  console.log(`Server is running on port PORT ${PORT}`);
});
