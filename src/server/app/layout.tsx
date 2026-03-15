import type { Metadata } from "next";
import { TRPCReactProvider } from "@/lib/trpc/provider";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://peek-snowy.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Peek — Your day, at a glance",
    template: "%s | Peek",
  },
  description:
    "Peek turns your home screen into an intelligent daily dashboard. Calendar events, tasks, weather — all in one beautiful widget powered by AI.",
  keywords: [
    "android widget",
    "daily dashboard",
    "calendar widget",
    "todoist widget",
    "weather widget",
    "AI widget",
    "home screen widget",
    "productivity",
    "peek app",
  ],
  authors: [{ name: "Peek" }],
  creator: "Peek",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Peek",
    title: "Peek — Your day, at a glance",
    description:
      "Peek turns your home screen into an intelligent daily dashboard. Calendar events, tasks, weather — all in one beautiful widget powered by AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Peek — Your day, at a glance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peek — Your day, at a glance",
    description:
      "Peek turns your home screen into an intelligent daily dashboard. Calendar events, tasks, weather — all in one beautiful widget powered by AI.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
