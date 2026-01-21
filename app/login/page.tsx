"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // 👇 Se agrega el tipo correcto para TypeScript
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // VALIDAR USUARIO Y CONTRASEÑA (ejemplo simple)
    if (user === "admin" && password === "1234") {
      
      // 🔥 ACA SE GUARDA LA COOKIE 🔥
      document.cookie = "auth_token=logueado; path=/; max-age=86400";

      // Redirigir a /admin
      router.push("/admin");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Iniciar sesión</h2>

        <input
          className="border p-2 w-full mb-3"
          type="text"
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Ingresar
        </button>
      </form>
    </div>
  );
}
