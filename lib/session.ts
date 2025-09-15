import { getIronSession } from "iron-session";
import type { SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface AdminSession {
  adminId?: string;
  username?: string;
}

const sessionOptions: SessionOptions = {
  cookieName: "bluefield_admin",
  password: process.env.SESSION_SECRET!, // set strong secret in .env
  cookieOptions: { secure: process.env.NODE_ENV === "production" },
};

export function getSession() {
  return getIronSession<AdminSession>(cookies(), sessionOptions);
}
