"use client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { createUser } from "@/app/(auth)/user.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ErrorDetail {
  message: string;
}

interface CreateUserResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: ErrorDetail[];
}

export default function RegisterForm() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const res: CreateUserResponse = await createUser(data);

    if (res.success) {
      toast.success(res.message);
      router.push("/");
    } else {
      toast.error(res.error);
      res.details?.forEach((detail: ErrorDetail) => {
        toast.error(detail.message);
      });
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
        <Label>Username</Label>
        <Input {...register("username")} type="text" placeholder="username" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Password</Label>
        <Input
          {...register("password")}
          type="password"
          placeholder="password"
        />
      </div>
      <Button>Register</Button>
    </form>
  );
}
