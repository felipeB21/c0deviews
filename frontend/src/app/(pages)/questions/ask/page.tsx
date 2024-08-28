"use client";
import { getUser } from "@/app/(auth)/user.api";
import PostForm from "@/components/forms/post";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AskQuestionPage() {
  const router = useRouter();

  useEffect(() => {
    const isAuth = async () => {
      const { success } = await getUser();
      if (!success) {
        router.push("/login");
      }
    };

    isAuth();
  }, [router]);

  return (
    <div>
      <div>
        <h5 className="text-2xl font-medium">Ask a public question</h5>
        <div>
          <PostForm />
        </div>
      </div>
    </div>
  );
}
