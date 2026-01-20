// app/layout.js (Server Component)
import "./globals.css";
import ClientLayout from "./ClientLayout";
import Providers from "./providers";
import { ClerkProvider } from "@clerk/nextjs";
import ConditionalFooter from "./components/ConditionalFooter";
import { Suspense } from "react";
import Loading from "./loading";

export const metadata = {
  title: "MRND",
  description: "Culture lives here",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body suppressHydrationWarning>
        <ClerkProvider>
          <Providers>
            <Suspense fallback={<Loading />}>
              {/* If ClientLayout is a client component, keep it here; otherwise render {children} directly */}
              <ClientLayout>
                <Suspense fallback={<Loading />}>
                  {children}
                </Suspense>
                <ConditionalFooter />
              </ClientLayout>
            </Suspense>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
