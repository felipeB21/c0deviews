import { Router } from "express";
import { validateData } from "../middleware/validation.js";
import {
  userRegistration,
  userLogin,
  updateUserSchema,
} from "../schemas/user.js";
import passport from "passport";
import { isAuth } from "../middleware/isAuth.js";
import {
  login,
  logout,
  register,
  tokenData,
  getUserByUsername,
  updateUser,
} from "../controller/auth.js";
import { generateUserToken } from "../utils/token.js";

const router = Router();

router.use(passport.initialize());
router.use(passport.session());

router.post("/login", validateData(userLogin), login);
router.post("/register", validateData(userRegistration), register);
router.delete("/logout", logout);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/register",
  }),
  (req, res) => {
    const userToken = generateUserToken(req.user);

    res.cookie("accessToken", userToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:3000");
  }
);
router.get("/user", tokenData);
router.get("/profile/:username", getUserByUsername);
router.put("/update", isAuth, validateData(updateUserSchema), updateUser);

export default router;
