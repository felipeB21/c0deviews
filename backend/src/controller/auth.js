import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userEmail = await prisma.user.findUnique({
      where: { email },
    });

    const userName = await prisma.user.findUnique({
      where: { username },
    });

    if (userEmail) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    if (userName) {
      return res.status(400).json({ msg: "Username already in use" });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    await prisma.user.update({
      where: { id: newUser.id },
      data: { accessToken, refreshToken },
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      msg: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        avatar: newUser.avatar,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { accessToken, refreshToken },
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const user = req.user;
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: null },
      });
    }

    res.status(200).json({ msg: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const tokenData = async (req, res) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const findUser = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        avatar: true,
        createdAt: true,
        posts: {
          select: {
            id: true,
            title: true,
            slug: true,
            body: true,
            comments: true,
            _count: true,
          },
        },
      },
    });

    if (!findUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({ data: findUser });
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (req, res) => {
  const id = req.user.id;
  const { username, avatar } = req.body;

  try {
    if (!id) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const findUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!findUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    let avatarUrl = avatar;

    if (avatar && avatar.startsWith("data:image/")) {
      const uploadResponse = await cloudinary.uploader.upload(avatar, {
        folder: "user_avatars",
      });

      avatarUrl = uploadResponse.secure_url;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username: username || findUser.username, // Actualiza el username solo si se proporciona uno nuevo
        avatar: avatarUrl || findUser.avatar, // Actualiza el avatar solo si se proporciona uno nuevo
      },
    });

    return res.status(200).json({ msg: "User updated", data: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "An error occurred",
      details: error.details || "An unknown error occurred",
    });
  }
};
