import LoginForm from "@/components/forms/login";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import GoogleBtn from "@/components/google-btn";

export default function LoginPage() {
  return (
    <div className="xl:w-[20dvw] w-[25dvw] flex flex-col gap-10">
      <h5 className="text-3xl font-medium">Sign in</h5>
      <LoginForm />
      <Separator />
      <GoogleBtn />
      <Link className="text-sm text-sky-400 hover:underline" href={"/register"}>
        You don`t have an account? Sign up
      </Link>
    </div>
  );
}
