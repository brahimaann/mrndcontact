// app/admin/layout.js
"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import HudSidebar from "../components/HudSidebar";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const isAdmin = useQuery(api.admin.isAdmin, isSignedIn ? {} : "skip");

  useEffect(() => {
    if (isSignedIn && isAdmin === false) router.replace("/");
  }, [isSignedIn, isAdmin, router]);

  if (!isSignedIn) return <div className="p-6">Please sign in…</div>;
  if (isAdmin === undefined) return <div className="p-6">Checking admin…</div>;
  if (isAdmin === false) return null;

  return <><  HudSidebar />{children}</>;
}
