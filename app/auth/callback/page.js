"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  const data = useQuery(api.identifiers.checkMe, isSignedIn ? {} : "skip");

  useEffect(() => {
    if (!isSignedIn) return;
    if (!data) return;

    if (!data.allowed) {
      // Not on allowlist → sign out & go home
      signOut().finally(() => router.replace("/"));
      return;
    }
    if (data.allowed && !data.hasProfile) {
      router.replace("/setup");
      return;
    }
    router.replace("/");
  }, [data, isSignedIn, router, signOut]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-sm text-white/70">Checking access…</p>
    </div>
  );
}
