import express from "express";
import postRouter from "../src/routes/post.js";
import authRouter from "../src/routes/auth.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import "../src/controller/passport.js";
import session from "express-session";

const app = express();
dotenv.config();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use("/auth", authRouter);
app.use("/post", postRouter);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
