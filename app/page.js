// app/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "123456") {
      router.push("/contact?view=logo");
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <main className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
      {/* Left: Password form */}
      <section className="flex items-center justify-center bg-black text-white p-8">
        <form
          onSubmit={handlePasswordSubmit}
          className="w-full max-w-sm flex flex-col gap-4"
        >
          <h1 className="text-xl font-bold text-center">Enter Password</h1>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-3/4 md:w-1/2 self-center px-4 py-3 border-2 border-white bg-black text-white text-center rounded focus:outline-none focus:ring-2 focus:ring-white"
            required
          />

          <button
            type="submit"
            className="w-3/4 md:w-1/2 self-center py-3 bg-white text-black font-semibold rounded hover:bg-black hover:text-white hover:border hover:border-white transition"
          >
            Submit
          </button>

          <p className="text-xs text-neutral-300 text-center">
            Use the password you received to review your page.
          </p>
        </form>
      </section>

      {/* Right: Contact button */}
      <section className="flex items-center justify-center bg-white text-black p-8">
        <div className="w-full max-w-sm flex flex-col items-center gap-4">
          <h2 className="text-lg font-semibold text-center">
            Need to reach us?
          </h2>

          <Link
            href="/contact"
            className="w-full py-3 bg-black text-white text-center rounded hover:opacity-90 transition"
          >
            Go to Contact Page
          </Link>

          <p className="text-xs text-neutral-500 text-center">
            This takes you to the contact form.
          </p>
        </div>
      </section>
    </main>
  );
}
