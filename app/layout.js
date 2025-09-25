// app/layout.js (Server Component)
import "./globals.css";
import ClientLayout from "./ClientLayout";
import Providers from "./providers";

export const metadata = {
  title: "MRND",
  description: "Let's connect and collaborate!",
  icons: { icon: "/favicon.ico" },
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
        <Providers>
          {/* If ClientLayout is a client component, keep it here; otherwise render {children} directly */}
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
