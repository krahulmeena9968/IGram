import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();
import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

class PassportConfig {
  static initialize() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "http://localhost:3000/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName;

          User.findOne({ email })
            .then(async (existingUser) => {
              if (existingUser) {
                return done(null, existingUser);
              } else {
                // Generate a base username from name
                let baseUsername = name.toLowerCase().replace(/\s+/g, "");
                let username = baseUsername;
                let count = 1;

                // Ensure username is unique
                while (await User.findOne({ username })) {
                  username = `${baseUsername}${count++}`;
                }

                // Create a random password and hash it
                const randomPassword = crypto.randomBytes(8).toString("hex");
                const hashedPassword = await bcrypt.hash(randomPassword, 10);

                const newUser = await User.create({
                  name: name,
                  identifier: email,
                  username: username,
                  password: hashedPassword,
                });

                return done(null, newUser);
              }
            })
            .catch((err) => {
              console.error("Error during Google auth user creation", err);
              return done(err, null);
            });
        }
      )
    );
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));
  }
}

// Execute the configuration immediately
PassportConfig.initialize();
export default PassportConfig;
