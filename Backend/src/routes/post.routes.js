import express from "express";
const router = express.Router();
import crudOperation from "../controllers/post.controller.js";
const crudOperationInstance = new crudOperation();

router.post("/post", (req, res) => crudOperationInstance.postData(req, res));
router.get("/post/all", (req, res) => crudOperationInstance.allPost(req, res));
router.put("/post/:id/edit", (req, res) =>
  crudOperationInstance.editPost(req, res)
);
router.delete("/post/:id", (req, res) =>
  crudOperationInstance.deletePost(req, res)
);

export default router;
