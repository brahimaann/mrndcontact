"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on magazine pages
  if (pathname?.startsWith("/magazine")) {
    return null;
  }
  
  return (
    <div className="ml-[6rem] max-[550px]:ml-0 mr-0 lg:mr-[22rem] px-6 md:px-10 relative mt-auto max-[550px]:mt-auto max-[550px]:pt-8">
      <Footer />
    </div>
  );
}
