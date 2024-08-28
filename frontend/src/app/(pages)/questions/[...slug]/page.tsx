"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPostSlug } from "../../post.api";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface Post {
  id: string;
  slug: string;
  title: string;
  body: string;
  authorId: string;
  createdAt: string;
  _count: number;
  author: Author;
  comments: string[];
}

interface Author {
  id: string;
  username: string;
  avatar: string;
}

export default function SlugPage() {
  const params = useParams();
  const [data, setData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      if (params.slug) {
        const res = await getPostSlug({ slug: params.slug as string });

        if (res && res.success) {
          setData(res.data);
          setLoading(false);
        } else {
          setMsg(res.error as string);
          setLoading(false);
        }
      }
    };

    fetchPost();
  }, [params]);

  if (msg) return <p>{msg}</p>;

  if (loading) return <Skeleton className="w-4 h-4" />;

  const formattedDate = data?.createdAt
    ? format(new Date(data.createdAt), "MMMM d, yyyy")
    : "Date not available";

  return (
    <div>
      <div>
        <h3 className="text-2xl font-medium">{data?.title}</h3>
        <div className="mt-2 mb-4 text-sm text-neutral-400 flex items-center gap-5">
          <p>Asked {formattedDate}</p>
          <p>
            Posted by{" "}
            <Link
              className="text-sky-400 hover:underline"
              href={`/profile/${data?.author.username}`}
            >
              {data?.author.username}
            </Link>
          </p>
        </div>
        <Separator />
        <div className="mt-4">{data?.body}</div>
      </div>
    </div>
  );
}
