import RegisterForm from "@/components/forms/register";
import GoogleBtn from "@/components/google-btn";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="xl:w-[20dvw] w-[25dvw] flex flex-col gap-10">
      <h5 className="text-3xl font-medium">Sign up</h5>
      <RegisterForm />
      <Separator />
      <GoogleBtn />
      <Link className="text-sm text-sky-400 hover:underline" href={"/login"}>
        Alredy have an account? Sign in
      </Link>
    </div>
  );
}
