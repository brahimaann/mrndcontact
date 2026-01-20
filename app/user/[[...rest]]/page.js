'use client';

import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const appearance = {
  elements: {
    footer: 'hidden',
    footerAction__signIn: 'hidden',
    footerAction__signUp: 'hidden',
    logoBox: 'hidden',
  },
};

export default function UserAuthPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-black">
      {/* Back button - fixed position to ensure it's always visible */}
      <button
        onClick={() => router.back()}
        className="flex items-center justify-center w-10 h-10 bg-black border border-white/40 hover:bg-white hover:text-black transition rounded"
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 99999,
        }}
        aria-label="Go back"
      >
        <span className="text-lg">←</span>
      </button>
      
      <div className="w-full max-w-md">
        <SignIn
          path="/user"           // tell Clerk where this component is mounted
          routing="path"         // (default for Next.js, but explicit is nice)
          appearance={appearance}
          afterSignInUrl="/auth/callback"
          afterSignUpUrl="/auth/callback"
        />
      </div>
    </div>
  );
}
