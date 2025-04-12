import { User } from "../models/user.models.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import crypto from "crypto";
import wrapAsync from "../utils/wrapAsync.utils.js";
import jwt from "jsonwebtoken";

class userController {
  login = wrapAsync(async (req, res, next) => {
    let { identifier, password, username } = req.body;

    if (!identifier) {
      identifier = username;
    }

    if (!identifier || !password) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Please provide input first" });
    }

    const user = await User.findOne({
      $or: [{ identifier: identifier }, { username: identifier }],
    });

    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Did not found any user" });
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      // let token = crypto.randomBytes(20).toString("hex");
      const token = jwt.sign(
        { id: user._id }, // payload
        process.env.JWT_SECRET, // secret
        { expiresIn: "1h" } // optional expiration
      );
      user.token = token;
      await user.save();
      return res.status(httpStatus.OK).json({ token });
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "User doesn't exists" });
    }
  });

  register = wrapAsync(async (req, res, next) => {
    const { name, username, identifier, password } = req.body;

    if (!name || !username || !identifier || !password) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Provide input fields!" });
    }

    try {
      const existingUser = await User.findOne({
        $or: [{ identifier }, { username }],
      });

      if (existingUser) {
        return res
          .status(httpStatus.CONFLICT)
          .json({ message: "User already exist" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name: name,
        username: username,
        identifier: identifier,
        password: hashedPassword,
      });

      return res
        .status(httpStatus.CREATED)
        .json({ message: "User created", User: newUser });
    } catch (error) {
      return res.status(500).json({ message: `Something went wrong ${error}` });
    }
  });
}
export default userController;
