"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect old /cities route to /projects/cities
export default function CitiesRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/projects/cities");
  }, [router]);

  return null;
}
