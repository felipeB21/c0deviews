import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthHero() {
  return (
    <div className="relative w-full h-auto rounded-l-xl">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10"></div>

      <Image
        className="w-full h-screen object-cover brightness-50 "
        src={"/auth_img.webp"}
        alt="img"
        priority
        width={1920}
        height={1080}
      />

      <div className="absolute inset-0 flex flex-col justify-between text-white p-4 z-20">
        <Link href={"/"} className="text-3xl font-bold mb-4 drop-shadow-lg">
          c0deviews
        </Link>
        <div className="drop-shadow-lg">
          <p className="text-lg italic mb-2">
            “This website has helped me solve complex coding problems and
            improve my workflow, allowing me to code faster and with more
            confidence.”
          </p>

          <span className="text-sm font-semibold">Felipe Bolgar</span>
        </div>
      </div>
    </div>
  );
}
