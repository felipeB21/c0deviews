"use client";
import Image from "next/image";
import React from "react";

export default function GoogleBtn() {
  const handleGoogleAuth = async () => {
    window.open(`http://localhost:4000/auth/google`, "_self");
  };
  return (
    <button
      onClick={handleGoogleAuth}
      className="flex items-center justify-center gap-5 rounded-md p-2 border dark:border-neutral-700 border-neutral-300 dark:hover:bg-neutral-900 hover:bg-neutral-50"
    >
      <Image src={"/google.svg"} alt="Google" width={24} height={24} /> Sign in
      with google
    </button>
  );
}
