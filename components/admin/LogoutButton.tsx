'use client';
export default function LogoutButton() {
  const logout = async () => {
    await fetch("/admin/login", { method: "DELETE" });
    window.location.href = "/admin/login";
  };
  return <button onClick={logout} className="text-sm text-gray-600 hover:underline">Logout</button>;
}
