"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deletePost, getPostSlug } from "@/app/(pages)/post.api";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { toast } from "sonner";
import { getUser } from "@/app/(auth)/user.api";
import NotFound from "@/app/(pages)/not-found";
import { Highlight, themes } from "prism-react-renderer";
import { useTheme } from "next-themes";
import { Trash2, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  slug: string;
  title: string;
  body: string;
  authorId: string;
  createdAt: string;
  author: Author | null;
  comments: string[];
}

interface Author {
  id: string;
  username: string;
  avatar: string;
}

const isCodeSnippet = (content: string): boolean => {
  const codeKeywords = [
    "function",
    "const",
    "let",
    "var",
    "if",
    "for",
    "while",
    "class",
    "import",
    "export",
  ];
  const lines = content.split("\n");
  return (
    lines.length > 1 &&
    codeKeywords.some((keyword) => content.includes(keyword))
  );
};

export default function PostComponent({
  initialPost,
}: {
  initialPost: Post | null;
}) {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [data, setData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [currentTheme, setCurrentTheme] = useState(themes.ultramin);

  useEffect(() => {
    const fetchPost = async () => {
      if (params.slug) {
        const res = await getPostSlug({ slug: params.slug as string });

        if (res && res.success) {
          setData(res.data);
        } else {
          setData(null);
        }
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      const res = await getUser();
      setUser(res.user);
    };

    fetchPost();
    fetchUser();
  }, [params]);

  useEffect(() => {
    if (theme === "dark" || theme === "system") {
      setCurrentTheme(themes.duotoneDark);
    } else {
      setCurrentTheme(themes.duotoneLight);
    }
  }, [theme]);

  const handleDelete = async () => {
    if (user && data?.authorId === user.id) {
      const res = await deletePost({ slug: params.slug as string });

      if (res && res.success) {
        toast.success("Post deleted successfully");
        router.push("/");
      } else {
        toast.error(res?.msg || res?.msg.error || "Failed to delete post");
      }
    } else {
      toast.error("You are not authorized to delete this post");
    }
  };

  if (loading) return <Skeleton className="w-4 h-4" />;

  if (!data || !data.author) return <NotFound />;

  const formattedDate = data.createdAt
    ? format(new Date(data.createdAt), "MMMM d, yyyy")
    : "Date not available";

  const renderContent = (body: string) => {
    if (isCodeSnippet(body)) {
      return (
        <Highlight theme={currentTheme} code={body} language="javascript">
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} p-4 rounded-md overflow-auto`}
              style={style}
            >
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line });
                return (
                  <div key={i} {...lineProps}>
                    {line.map((token, key) => {
                      const tokenProps = getTokenProps({ token });
                      return <span key={key} {...tokenProps} />;
                    })}
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      );
    } else {
      const escapedBody = body.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return <p dangerouslySetInnerHTML={{ __html: escapedBody }} />;
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-medium">{data.title}</h1>

        <div className="mt-2 mb-3 flex items-center justify-between">
          <div className="text-sm text-neutral-400 flex items-center gap-5">
            <p>Asked {formattedDate}</p>
            <p>
              Posted by{" "}
              <Link
                className="text-sky-400 hover:underline"
                href={`/profile/${data.author.username}`}
              >
                {data.author.username}
              </Link>
            </p>
          </div>
          {user && data.authorId === user.id && (
            <div className="flex items-center gap-1">
              <button>
                <Edit className="w-9 h-9 text-green-400 p-2 rounded-full dark:hover:bg-neutral-800/60 hover:bg-neutral-200/60" />
              </button>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Trash2 className="w-9 h-9 text-red-400 p-2 rounded-full dark:hover:bg-neutral-800/60 hover:bg-neutral-200/60" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete this post?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your post.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction asChild>
                      <Button onClick={handleDelete}>Delete</Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
        <Separator />
        <div className="mt-4">
          <article className="rounded-md dark:bg-neutral-800/80 bg-neutral-200 border dark:border-neutral-700 p-4 overflow-auto">
            {renderContent(data.body)}
          </article>
        </div>
      </div>
    </div>
  );
}
