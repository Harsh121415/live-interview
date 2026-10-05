// components/Navbar.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SignedIn, SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
export default async function Navbar() {
  const user = await currentUser();
  return (
    <header className="flex w-full justify-between bg-white rounded-md items-center p-4 border-b shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">Welcome back, {user.firstName}</h2>
        <p className="text-sm text-muted-foreground">
          AI-Driven Interviews, Hassle-Free Hiring
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Bell className="w-5 h-5" />

        <Popover>
          <PopoverTrigger asChild>
            <Avatar className={"cursor-pointer"}>
              <AvatarImage src="/avatar.png" />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className=" w-[200px] mr-8 space-y-2 ">
            <SignedIn>
              <div className=" w-full flex items-center px-2 h-[35px] rounded-md bg-gray-50  ">
                {user.firstName} {` `} {user.lastName}{" "}
              </div>
            </SignedIn>
            <SignOutButton>
              <Button
                className={
                  " w-full cursor-pointer  bg-gray-50 text-black hover:text-red-500 hover:bg-gray-200 outline-0 border-0 "
                }
              >
                Log out
              </Button>
            </SignOutButton>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
