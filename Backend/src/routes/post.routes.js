import express from "express";
const router = express.Router();
import crudOperation from "../controllers/post.controller.js";
const crudOperationInstance = new crudOperation();
import userMiddleware from "../middlewares/user.middlewares.js";
const userMiddlewareInstance = new userMiddleware();

router.post(
  "/post",
  userMiddlewareInstance.authMiddleware,
  crudOperationInstance.postData
);
router.get("/post/all", (req, res, next) =>
  crudOperationInstance.allPost(req, res, next)
);
router.put("/post/:id/edit", (req, res, next) =>
  crudOperationInstance.editPost(req, res, next)
);
router.delete("/post/:id", (req, res, next) =>
  crudOperationInstance.deletePost(req, res, next)
);

export default router;
