export interface TRPCUser {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
}

export interface TRPCSession {
  user: TRPCUser;
}

export interface TRPCContext {
  headers: Headers;
  session: TRPCSession | null;
}
