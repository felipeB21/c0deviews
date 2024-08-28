"use client";
import { updateUser as updateUserApi } from "@/app/(auth)/user.api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditProfileProps {
  open: boolean;
  onClose: () => void;
  currentUser: {
    avatar: string;
    username: string;
  } | null;
}

export function EditProfile({ open, onClose, currentUser }: EditProfileProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newAvatar, setNewAvatar] = useState<string | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newAvatarUrl = URL.createObjectURL(file);
      setNewAvatar(newAvatarUrl);
    }
  };

  const performUpdateUser = async (
    username: string,
    avatarUrl: string | null
  ) => {
    try {
      const data = await updateUserApi({
        username,
        avatar: avatarUrl,
      });

      if (data.success) {
        toast.success("User updated successfully!");
        window.location.reload();
      } else {
        if (data.details && Array.isArray(data.details)) {
          data.details.forEach((detail) => {
            let errorMessage = "";

            if (typeof detail === "object" && detail !== null) {
              errorMessage = detail.message || JSON.stringify(detail);
            } else {
              errorMessage = String(detail);
            }

            toast.error(`Update failed: ${errorMessage}`);
          });
        } else {
          toast.error(`Update failed: ${data.error}`);
        }
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user. Please try again.");
    }
  };

  const handleUpdateUser = async () => {
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;

    let avatarUrl = currentUser?.avatar;

    if (newAvatar && fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();

      reader.onloadend = async () => {
        avatarUrl = reader.result as string;
        await performUpdateUser(
          username || (currentUser?.username as string),
          avatarUrl
        );
      };

      reader.readAsDataURL(file);
    } else {
      await performUpdateUser(
        username || (currentUser?.username as string),
        avatarUrl as string
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you’re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatar" className="text-right">
              Avatar
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <div onClick={handleAvatarClick} className="cursor-pointer">
                {newAvatar ? (
                  <Image
                    src={newAvatar}
                    alt="new-avatar"
                    className="w-12 h-12 object-cover rounded-full"
                    width={100}
                    height={100}
                  />
                ) : (
                  <Image
                    src={currentUser?.avatar || "/user.webp"}
                    alt="current-avatar"
                    className="w-12 h-12 object-cover rounded-full"
                    width={100}
                    height={100}
                  />
                )}
              </div>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue={currentUser?.username || ""}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpdateUser}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
