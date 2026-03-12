import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
// import { auth } from "@/lib/auth";

// export const GET = auth.handler;
// export const POST = auth.handler;
