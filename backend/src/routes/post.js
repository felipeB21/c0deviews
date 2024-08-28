import { Router } from "express";
import { validateData } from "../middleware/validation.js";
import { messageValidation, postValidation } from "../schemas/post.js";
import {
  createComment,
  createPost,
  deletePost,
  getPosts,
  getPostSlug,
} from "../controller/post.js";
import { isAuth } from "../middleware/isAuth.js";
import { visitAuth } from "../middleware/visit.js";

const router = Router();

router.get("/", getPosts);
router.get("/:slug", visitAuth, getPostSlug);
router.post(
  "/comment/:slug",
  isAuth,
  validateData(messageValidation),
  createComment
);
router.post("/create", isAuth, validateData(postValidation), createPost);
router.delete("/delete/:slug", isAuth, deletePost);

export default router;
