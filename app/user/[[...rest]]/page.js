'use client';

import { SignIn } from '@clerk/nextjs';

const appearance = {
  elements: {
    footer: 'hidden',
    footerAction__signIn: 'hidden',
    footerAction__signUp: 'hidden',
    logoBox: 'hidden',
  },
};

export default function UserAuthPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <SignIn
        path="/user"           // tell Clerk where this component is mounted
        routing="path"         // (default for Next.js, but explicit is nice)
        appearance={appearance}
        afterSignInUrl="/auth/callback"
        afterSignUpUrl="/auth/callback"
      />
    </div>
  );
}
