import Image from "next/image";
import { redirect } from "next/navigation";
import { auth, getSession } from "@/lib/auth";
import { headers } from "next/headers";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <AuthShowcase />
    </div>
  );
}

export async function AuthShowcase() {
  const session = await getSession();

  if (!session) {
    return (
      <form>
        <button
          formAction={async () => {
            "use server";
            const res = await auth.api.signInSocial({
              body: {
                provider: "google",
                callbackURL: "/",
              },
            });
            if (!res.url) {
              throw new Error("No URL returned from signInSocial");
            }
            redirect(res.url);
          }}
        >
          Sign in with Google
        </button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {session.user.name}</span>
      </p>

      <form>
        <button
          formAction={async () => {
            "use server";
            await auth.api.signOut({
              headers: await headers(),
            });
            redirect("/");
          }}
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
