"use client";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { getPosts } from "./post.api";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { MessageSquare, Eye } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  visits: number;
  _count: Comments;
  title: string;
  author: Author;
  createdAt: string;
  comments: string[];
}

interface Author {
  id: string;
  username: string;
  avatar: string;
}

interface Comments {
  comments: number;
}

export default function Home() {
  const [data, setData] = useState<Post[] | undefined>(undefined);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await getPosts();

      if (res && res.success) {
        setData(res.data);
      } else {
        setError(res?.error || "No posts found");
      }
    };

    fetchPosts();
  }, []);

  return (
    <main>
      <div className="flex items-center justify-between mb-10">
        <h4 className="text-2xl font-medium">Top Questions</h4>
        <Link className={buttonVariants()} href={"/questions/ask"}>
          Ask Question
        </Link>
      </div>
      <Separator />
      <section>
        <ul>
          {data ? (
            data.map((post) => (
              <li key={post.id}>
                <div className="flex gap-10 px-2 py-6">
                  <div className="text-sm text-neutral-400">
                    <div className="flex items-center gap-2">
                      <p>{post._count.comments}</p>
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-2">
                      <p>{post.visits}</p>
                      <Eye className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      className="text-xl text-sky-500"
                      href={`/questions/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-2">
                      <Link
                        className="flex items-center gap-2"
                        href={`/profile/${post.author.username}`}
                      >
                        <Image
                          className="w-5 h-5 rounded-full object-cover"
                          src={post.author.avatar}
                          alt="avatar"
                          width={100}
                          height={100}
                        />
                        <p className="text-sm text-sky-400">
                          {post.author.username}
                        </p>
                      </Link>
                      <Link href={`/questions/${post.slug}`}>
                        <p className="text-sm dark:text-neutral-300 text-neutral-500">
                          Asked{" "}
                          {format(new Date(post.createdAt), "MMMM d, yyyy")}
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
                <Separator />
              </li>
            ))
          ) : (
            <p className="flex items-center justify-center min-h-[50dvh]">
              {error}
            </p>
          )}
        </ul>
      </section>
    </main>
  );
}
