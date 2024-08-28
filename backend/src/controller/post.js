import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

export const createPost = async (req, res) => {
  const { title, body } = req.body;
  const authorId = req.user?.id;

  try {
    const slug = slugify(title, { lower: true });

    const existingTitlePost = await prisma.post.findFirst({
      where: { title },
    });

    if (existingTitlePost) {
      return res
        .status(400)
        .json({ error: "A post with this title already exists." });
    }

    const existingSlugPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingSlugPost) {
      return res
        .status(400)
        .json({ error: "A post with this slug already exists." });
    }

    const newPost = await prisma.post.create({
      data: {
        slug,
        title,
        body,
        authorId,
        createdAt,
      },
    });

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        body: true,
        visits: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (posts.length === 0) {
      return res.status(204).json({ msg: "No posts" });
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPostSlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const findPost = await prisma.post.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        body: true,
        _count: true,
        visits: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        comments: {
          select: {
            id: true,
            comment: true,
            author: {
              select: {
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!findPost) {
      return res.status(404).json({ msg: "Post not found" });
    }

    return res.status(200).json(findPost);
  } catch (error) {
    console.error("Error retrieving post:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createComment = async (req, res) => {
  const { slug } = req.params;
  const { comment } = req.body;
  const authorId = req.user?.id;

  try {
    const findPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (!findPost) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const newComment = await prisma.comment.create({
      data: {
        comment,
        postId: findPost.id,
        authorId,
      },
    });

    return res.status(201).json({
      message: "Comment created successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
