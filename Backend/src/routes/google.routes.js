import express from "express";
const router = express.Router();
import passport from "passport";
import googleController from "../controllers/google.controller.js";
const controllersInstance = new googleController();

// Optional: Home route for a simple auth link (if not handled by your frontend)
router.get("/", (req, res, next) => {
  controllersInstance.renderAuthLink(req, res);
});
// Start Google OAuth process
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// OAuth google callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth" }),
  (req, res) => {
    res.redirect("/home");
  }
);

// Protected route that shows the user details after login
router.get("/home", (req, res) =>
  controllersInstance.googleLoginSuccess(req, res)
);

// Logout route
router.get("/logout", (req, res) => controllersInstance.logoutUser(req, res));

export default router;
