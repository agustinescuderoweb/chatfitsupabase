"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // borrar la cookie
    document.cookie = "auth_token=; Max-Age=0; path=/";
    // redirigir al login
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
    >
      Cerrar sesión
    </button>
  );
}
