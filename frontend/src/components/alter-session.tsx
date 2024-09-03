"use client";
import { getUser, logoutUser } from "@/app/(auth)/user.api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonVariants } from "./ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  CreditCard,
  LogOut,
  Settings,
  User,
  Moon,
  Sun,
  Monitor,
  Settings2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditProfile } from "./edit-profile";

export default function AlterSession() {
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { success, user } = await getUser();

      if (success) {
        setLoading(false);
        setUser(user);
      } else {
        setLoading(false);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { success } = await logoutUser();

    if (success) {
      setUser(null);
      router.push("/");
    }
  };

  const renderIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="mr-2 h-4 w-4" />;
      case "light":
        return <Sun className="mr-2 h-4 w-4" />;
      case "system":
        return <Monitor className="mr-2 h-4 w-4" />;
      default:
        return <Sun className="mr-2 h-4 w-4" />;
    }
  };

  if (loading) {
    return <Skeleton className="w-[32px] h-[32px] rounded-full" />;
  }

  return (
    <div>
      <EditProfile
        open={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        currentUser={user}
      />
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {user.avatar ? (
              <Image
                className="w-8 h-8 object-cover rounded-full"
                src={user.avatar}
                alt="User Avatar"
                width={100}
                height={100}
              />
            ) : (
              <Image
                className="w-8 h-8 object-cover rounded-full"
                src="/user.webp"
                alt="Default Avatar"
                width={100}
                height={100}
              />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  className="cursor-default"
                  href={`/profile/${user.username}`}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        {renderIcon()}
                        <span>Theme</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="w-48">
                          <DropdownMenuRadioGroup
                            value={theme}
                            onValueChange={setTheme}
                          >
                            <DropdownMenuRadioItem value="light">
                              <Sun className="mr-2 h-4 w-4" />
                              Light
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark">
                              <Moon className="mr-2 h-4 w-4" />
                              Dark
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="system">
                              <Monitor className="mr-2 h-4 w-4" />
                              System
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem onClick={() => setShowEditProfile(true)}>
                      <Settings2 className="mr-2 h-4 w-4" />
                      <span>Edit profile</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-5">
          <Link href={"/register"} className="text-sm font-medium">
            Sign up
          </Link>
          <Link href={"/login"} className={buttonVariants()}>
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}
