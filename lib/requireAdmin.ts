// lib/requireAdmin.ts
import { getSession } from './session';

export type AdminGuard =
  | { ok: true; adminId: string; username?: string }
  | { ok: false; status: 401 | 403 };

export async function requireAdmin(): Promise<AdminGuard> {
  const session = await getSession();
  // We only need to know if an admin session exists.
  // You set session.adminId/username in POST /admin/login
  if (!session.adminId) return { ok: false, status: 401 };
  return { ok: true, adminId: session.adminId, username: session.username };
}

/** Optional: tiny wrapper to reduce boilerplate in routes */
export function withAdmin<T extends (args: any) => any>(
  handler: (ctx: { adminId: string; username?: string }) => ReturnType<T>
) {
  return async () => {
    const g = await requireAdmin();
    if (!g.ok) {
      // Return plain object; your route can convert to NextResponse if needed
      return { __unauthorized: true, status: g.status } as const;
    }
    return handler({ adminId: g.adminId, username: g.username });
  };
}
