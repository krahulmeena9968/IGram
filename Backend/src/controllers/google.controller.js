import { User } from "../models/user.models.js";
import httpStatus from "http-status";

class googleController {
  renderAuthLink(req, res) {
    res.send('<h1><a href="/auth/google">Authenticate with Google</a></h1>');
  }

  googleLoginSuccess(req, res) {
    if (!req.user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Something went wrong" });
    }

    const user = req.user;
    // Additional logging as needed...
    res.send(user);
  }

  logoutUser(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).send("Logout failed.");
      }
      const htmlMessage = encodeURIComponent("<h1>Logout successfully</h1>");
      res.clearCookie("connect.sid"); // Ensure the session cookie is removed
      res.redirect("/");
    });
  }
}
export default googleController;
