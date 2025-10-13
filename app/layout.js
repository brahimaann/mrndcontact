// app/layout.js (Server Component)
import "./globals.css";
import ClientLayout from "./ClientLayout";
import Providers from "./providers";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "./components/Footer";

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
            {/* If ClientLayout is a client component, keep it here; otherwise render {children} directly */}
            <ClientLayout>{children}
               <div className="ml-[6rem] mr-0 lg:mr-[22rem] px-6 md:px-10 relative ">
    <Footer />
  </div></ClientLayout>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
