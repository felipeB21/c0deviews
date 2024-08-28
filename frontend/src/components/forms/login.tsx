"use client";
import { loginUser } from "@/app/(auth)/user.api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ErrorDetail {
  message: string;
}

interface LoginUserResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: ErrorDetail[];
}

export default function LoginForm() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const res: LoginUserResponse = await loginUser(data);

    if (res.success) {
      toast.success(res.message || "Login successful");
      router.push("/");
    } else {
      toast.error(res.error || "An error occurred");

      if (res.details) {
        res.details.forEach((detail: ErrorDetail) => {
          toast.error(detail.message);
        });
      }
    }
  });
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label>Email</Label>
        <Input
          {...register("email")}
          type="email"
          placeholder="name@example.com"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Password</Label>
        <Input
          {...register("password")}
          type="password"
          placeholder="password"
        />
      </div>
      <Button>Log in</Button>
    </form>
  );
}
