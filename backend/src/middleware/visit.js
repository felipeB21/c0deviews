import jwt from "jsonwebtoken";

export async function visitAuth(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.session.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    next();
  }
}
