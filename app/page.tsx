"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import clara from "@/public/clara.png"

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mensaje inicial de bienvenida
    setMessages([
      {
        role: "assistant",
        content:
          "👋 ¡Hola! Soy Clara, tu asesora fitness. ¿Qué te gustaría mejorar de tu salud física? 💪",
      },
    ]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    const data = await res.json();
    setMessages([...updatedMessages, { role: "assistant", content: data.reply }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      {/* Encabezado con avatar */}
      <div className="flex flex-col items-center mb-4">
        <Image
          src={clara} // ← Cambia esto por tu imagen real
          alt="Clara"
          width={80}
          height={80}
          className="rounded-full border-2 border-green-500 shadow-lg"
        />
        <h1 className="text-xl font-semibold mt-2 text-green-400">Clara, Asesora Fitness</h1>
        <p className="text-sm text-gray-400">Tu acompañante para lograr tus metas 💚</p>
      </div>

      {/* Contenedor del chat */}
      <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="h-96 overflow-y-auto space-y-2 mb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg ${
                msg.role === "assistant"
                  ? "bg-gray-700 text-green-300 self-start"
                  : "bg-blue-700 text-white self-end"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <div className="flex">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 p-2 rounded-l bg-gray-700 outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-r transition"
          >
            {loading ? "..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
