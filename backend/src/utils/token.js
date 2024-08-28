import jwt from "jsonwebtoken";

export function generateUserToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}
