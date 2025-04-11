import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import userRoute from "./routes/user.routes.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URL;

app.use("/api/v1/users", userRoute);

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB is connected successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
  });

server.listen(PORT, () => {
  console.log(`Server is running on port PORT ${PORT}`);
});
