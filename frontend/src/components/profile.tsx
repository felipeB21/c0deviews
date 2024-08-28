"use client";
import { useParams } from "next/navigation";
import { getUserByUsername, getUser } from "@/app/(auth)/user.api";
import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Cake } from "lucide-react";
import { EditProfile } from "@/components/edit-profile";

interface User {
  id: string;
  username: string;
}

export default function ProfileComponent({
  initialUser,
}: {
  initialUser: User | null;
}) {
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (params?.username) {
        const { success, error, user } = await getUserByUsername({
          username: params.username as string,
        });

        if (success) {
          setUser(user.data);
          setLoading(false);
        } else {
          setError(error || "Failed to fetch user data");
          setLoading(false);
        }
      }
    };

    const fetchLoggedInUser = async () => {
      const { success, user } = await getUser();
      if (success) {
        setLoggedInUserId(user.id);
      }
    };

    fetchUser();
    fetchLoggedInUser();
  }, [params?.username]);

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="w-[42px] h-[42px] rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="w-[120px] h-[20px] rounded-full" />
          <Skeleton className="w-[190px] h-[12px] rounded-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[65dvh]">
        <p className="text-2xl font-medium">{error}</p>
      </div>
    );
  }

  const canEditProfile = user && loggedInUserId && user.id === loggedInUserId;

  return (
    <div>
      {showEditProfile && user && (
        <EditProfile
          open={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          currentUser={{ avatar: user.avatar, username: user.username }}
        />
      )}
      {user ? (
        <div className="flex items-center gap-4">
          <Image
            className="w-12 h-12 object-cover rounded-full"
            src={user.avatar || "/user.webp"}
            alt="user-avatar"
            width={100}
            height={100}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <p className="text-xl font-medium">{user.username}</p>
              {canEditProfile && (
                <button
                  className="flex items-center gap-3"
                  onClick={() => setShowEditProfile(true)}
                >
                  <Edit className="h-4 w-4 mt-0.5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm dark:text-neutral-400 text-neutral-500">
              <Cake className="h-4 w-4" />
              <p>
                Member since {format(new Date(user.createdAt), "MMMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>User not found</div>
      )}
    </div>
  );
}
