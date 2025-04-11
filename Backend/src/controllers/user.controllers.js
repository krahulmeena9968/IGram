import { User } from "../models/user.models.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import crypto from "crypto";

class userController {
  async login(req, res) {
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
      let token = crypto.randomBytes(20).toString("hex");
      user.token = token;
      await user.save();
      return res.status(httpStatus.OK).json({ token });
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "User doesn't exists" });
    }
  }

  async register(req, res) {
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
  }
}
export default userController;
