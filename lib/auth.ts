// lib/auth.ts
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const COOKIE = 'bf_admin';
const secret = new TextEncoder().encode(process.env.AUTH_JWT_SECRET!);

export async function setAdminSession(email: string) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);

  cookies().set({
    name: COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: true,
  });
}

export async function clearAdminSession() {
  cookies().set(COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', secure: true, maxAge: 0 });
}

export async function getAdmin() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { email: string };
  } catch {
    return null;
  }
}
