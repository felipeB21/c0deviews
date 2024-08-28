import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function visitAuth(req, res, next) {
  const token = req.cookies.accessToken;
  const { slug } = req.params;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (slug && req.user?.id) {
      try {
        await prisma.post.update({
          where: { slug },
          data: {
            visits: {
              increment: 1,
            },
          },
        });
      } catch (updateError) {
        console.error("Error updating post visits:", updateError);
      }
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    next();
  }
}
