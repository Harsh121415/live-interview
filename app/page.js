"use client";
import { useUserStore } from "@/context/useUser";
import { RedirectToSignIn, useSession } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "@/lib/utils";

export default function Home() {
  const { isSignedIn, isLoaded } = useSession();
  const { user, setUser } = useUserStore((state) => state);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure Clerk user is in DB
    fetchUserProfile(setUser, setLoading).catch(() => {
      // Error handling is done in the utility function
    });
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchUserProfile(setUser);
    }
  }, [isLoaded, isSignedIn]);

  if (!isSignedIn) {
    redirect("/sign-in");
  }
  return <>{isSignedIn && <RedirectToSignIn />}</>;
}
