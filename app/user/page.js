import { SignIn } from "@clerk/nextjs";
const appearance = {
  elements: {
    footer: "hidden",
    footerAction__signIn: "hidden",
    footerAction__signUp: "hidden",
    logoBox: "hidden",
  },
};
export default function UserAuthPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <SignIn
        appearance={appearance} //{{ elements: { card: "bg-white/5 border border-white/10" } }}
        afterSignInUrl="/auth/callback"
        afterSignUpUrl="/auth/callback"
        
      />
    </div>
  );
}
