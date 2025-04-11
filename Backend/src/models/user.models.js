import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  identifier: {
    type: String,
    required: true,
    uniqud: true,
    Validate: {},
    validator: (value) => {
      // email regix
      const isEmail = /\S+@\S+\.\S+/.test(value);
      // mobile no. regix (returning 10 digit mobile no.)
      const isPhone = /^\d{10}$/.test(value);
      return isPhone || isEmail;
    },
    message: (props) => {
      `${props.value} is not a valid email or phone no`;
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export { User };
