import jwt from "jsonwebtoken";

export function isAuth(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
}
