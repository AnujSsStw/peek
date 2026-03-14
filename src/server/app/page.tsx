import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Dashboard } from "./dashboard";

export default async function RootPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/welcome");
  }

  return <Dashboard user={session.user} />;
}
