import Link from "next/link";
import AlterSession from "./alter-session";
import { Input } from "./ui/input";

const NAV_LINKS = [
  { name: "Questions", href: "/questions" },
  { name: "AI Help", href: "/ai-help" },
  { name: "Community", href: "/community" },
  { name: "About", href: "/about" },
] as const;

export default function Header() {
  return (
    <header className="py-3 border-b dark:border-neutral-800">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-10">
        <div className="flex items-center gap-5">
          <Link className="text-xl font-medium" href={"/"}>
            c0deviews
          </Link>
          <nav>
            <ul className="flex items-center gap-5 ">
              {NAV_LINKS.map((links) => (
                <li key={links.name}>
                  <Link className="text-sm text-neutral-400" href={links.href}>
                    {links.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <Input className="w-[25dvw]" placeholder="Search..." />
        <div>
          <AlterSession />
        </div>
      </div>
    </header>
  );
}
