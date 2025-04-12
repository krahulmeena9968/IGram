import express from "express";
const router = express.Router();
import userController from "../controllers/user.controllers.js";
const controllersInstance = new userController();

router.post("/signup", (req, res, next) =>
  controllersInstance.register(req, res, next)
);
router.post("/login", (req, res, next) =>
  controllersInstance.login(req, res, next)
);

export default router;
