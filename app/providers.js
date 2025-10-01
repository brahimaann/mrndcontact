"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

const clerkAppearance = {
  variables: {
    colorPrimary: "#ffffff",
    colorBackground: "transparent",
    colorInputBackground: "#000000",
    colorInputBorder: "rgba(255,255,255,0.2)",
    colorText: "#ffffff",
    colorTextSecondary: "rgba(255,255,255,0.7)",
    borderRadius: "12px",
    fontSize: "14px",
  },
  elements: {
    // Container card
    card: "bg-white/5 border border-white/10 rounded-2xl shadow-none backdrop-blur",
    headerTitle: "text-2xl font-semibold tracking-wide",
    headerSubtitle: "text-white/70",
    logoBox: "hidden", // hide Clerk logo

    // Tabs (“Sign in / Sign up”)
    tabs: "border-b border-white/10",
    tabsTrigger: "data-[state=active]:text-black data-[state=active]:bg-white rounded-lg",

    // Fields
    formFieldLabel: "text-sm text-white/80 font-medium",
    formFieldInput:
      "bg-black text-white placeholder-white/40 border border-white/20 rounded-xl focus:outline-none focus:ring-0 focus:border-white px-3 py-2 font-mono",
    formFieldInputShowPasswordButton: "text-white/70 hover:text-white",

    // Primary button
    formButtonPrimary:
      "bg-white text-black border border-white rounded-xl hover:bg-black hover:text-white transition",

    // Social buttons (if you ever enable them)
    socialButtons: "gap-3",
    socialButtonsBlockButton:
      "bg-black text-white border border-white/20 rounded-xl hover:bg-white hover:text-black",

    // Divider
    dividerLine: "bg-white/10",
    dividerText: "text-white/60",

    // Footer
    footer: "text-center",
    footerAction__signIn: "text-white/70",
    footerAction__signUp: "text-white/70",
    footerActionLink: "text-white underline underline-offset-4 hover:opacity-80",

    // Phone code + select
    phoneInput: "bg-black",
    formFieldInputContainer: "gap-2",
    otpCodeFieldInput:
      "bg-black text-white border border-white/20 rounded-xl font-mono tracking-widest",
    footer: "hidden",  
    // Error text
    formFieldError: "text-red-400",
    alert: "bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl",
  },
};
export default function Providers({ children }) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
