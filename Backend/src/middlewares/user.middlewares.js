import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import wrapAsync from "../utils/wrapAsync.utils.js";
import httpStatus from "http-status";

class userMiddleware {
  authMiddleware = wrapAsync(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.staus(httpStatus.UNAUTHORIZED).json({
        message: "You are UNAUTHORIZED to post! No token is avialable",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error("User not found");

    req.user = user; // Attach user to request
    next();
  });
}

export default userMiddleware;
