import { createPost } from "@/app/(pages)/post.api";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";

interface ErrorDetail {
  message: string;
}

interface PostResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: ErrorDetail[];
}

export default function PostForm() {
  const [errors, setErrors] = useState("");
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (post) => {
    const res: PostResponse = (await createPost(post)) || {
      success: false,
      error: "No response from server",
    };

    if (res.success) {
      toast.success(res.message || "Post created");
    } else {
      setErrors(res.error || "An error occurred");
      if (res.details) {
        res.details.forEach((detail: ErrorDetail) => {
          setErrors(detail.message);
        });
      }
    }
  });

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col gap-5 mt-10">
        <Label className="text-xl">Title</Label>
        <Input
          {...register("title")}
          type="text"
          placeholder="e.g. How can I implement a public API into my JavaScript project?"
        />
        <div>
          <Label className="text-xl">
            What are the details of your question/problem?
          </Label>
          <p className="pt-1 text-sm text-neutral-400 underline">
            Note: if you paste code, it will be automatically formatted as code.
          </p>
        </div>
        <Textarea
          {...register("body")}
          placeholder="Introduce the problem and expand on what you put in the title. Minimum 20 characters."
        />
        <Button>Submit</Button>
        {errors && (
          <div className="bg-red-500/90 p-4 mt-4 rounded-md">
            <p className="text-sm">{errors}</p>
          </div>
        )}
      </form>
    </>
  );
}
