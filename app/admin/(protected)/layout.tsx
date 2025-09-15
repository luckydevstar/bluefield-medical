import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminShell from "@/components/admin/AdminShell";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.adminId) {
    redirect("/admin/login"); // safe now; login is in (auth) group
  }
  return <AdminShell>{children}</AdminShell>;
}
