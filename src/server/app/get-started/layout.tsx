import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started",
  description:
    "Set up your Peek widget in under a minute. Connect Google Calendar, Todoist, and get an AI-powered daily dashboard on your Android home screen.",
  alternates: { canonical: "/get-started" },
};

export default function GetStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
