import type { Metadata } from "next";
import { TRPCReactProvider } from "@/lib/trpc/provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peek — Your day, at a glance",
  description:
    "Peek turns your home screen into an intelligent daily dashboard. Calendar events, tasks, weather — all in one beautiful widget.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
