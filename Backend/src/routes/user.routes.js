import express from "express";
const router = express.Router();
import userController from "../controllers/user.controllers.js";
const controllersInstance = new userController();

router.post("/signup", (req, res) => controllersInstance.register(req, res));
router.post("/login", (req, res) => controllersInstance.login(req, res));

export default router;
