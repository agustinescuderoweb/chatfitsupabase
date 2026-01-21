"use client";

import { useEffect, useState } from "react";

interface Insight {
  nombre: string;
  edad: string;
  genero: string;
  objetivo: string;
  nivel: string;
  disponibilidad: string;
  lugar: string;
  whatsapp: string;
  email: string;
  created_at: string;
  lead_temp?: string;
}

export default function InsightsPanel() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const fetchInsights = async () => {
    try {
      const res = await fetch("/api/insights");
      const json = await res.json();

      setInsights(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error(err);
      setInsights([]);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const getRowColor = (lead_temp: string) => {
    switch (lead_temp?.toLowerCase()) {
      case "caliente":
        return "bg-red-100";
      case "tibio":
        return "bg-yellow-100";
      case "frío":
        return "bg-green-100";
      default:
        return "";
    }
  };

  const normalizeObjetivo = (obj: string = "") => {
    const text = obj.toLowerCase();
    if (text.includes("delgado") || text.includes("bajar") || text.includes("peso"))
      return "adelgazar";
    if (text.includes("fuerte") || text.includes("masa") || text.includes("músculo"))
      return "ganar masa";
    if (text.includes("tono") || text.includes("tonificar"))
      return "tonificar";
    return "otro";
  };

  const filteredInsights =
    filter === "all"
      ? insights
      : insights.filter((i) => normalizeObjetivo(i.objetivo) === filter);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Potenciales Clientes</h2>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="font-semibold text-gray-700">Filtrar por objetivo:</label>

        <select
          className="border border-gray-300 p-2 rounded-lg shadow-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="adelgazar">Adelgazar</option>
          <option value="tonificar">Tonificar</option>
          <option value="ganar masa">Ganar masa</option>
        </select>
      </div>

      <div className="overflow-x-auto shadow-md rounded-xl border border-gray-200">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="px-3 py-2 border">Nombre</th>
              <th className="px-3 py-2 border">Edad</th>
              <th className="px-3 py-2 border">Objetivo</th>
              <th className="px-3 py-2 border">Nivel</th>
              <th className="px-3 py-2 border">Disponibilidad</th>
              <th className="px-3 py-2 border">Fecha</th>
              <th className="px-3 py-2 border">WhatsApp</th>
              <th className="px-3 py-2 border">Email</th>
              <th className="px-3 py-2 border">Contacto</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {filteredInsights.map((i, index) => (
              <tr
                key={index}
                className={`${getRowColor(i.lead_temp ?? "")} odd:bg-gray-50 hover:bg-blue-50 transition`}
              >
                <td className="px-3 py-2 border">{i.nombre}</td>
                <td className="px-3 py-2 border">{i.edad}</td>
                <td className="px-3 py-2 border">{i.objetivo}</td>
                <td className="px-3 py-2 border">{i.nivel}</td>
                <td className="px-3 py-2 border">{i.disponibilidad}</td>
                <td className="px-3 py-2 border">{new Date(i.created_at).toLocaleString()}</td>
                <td className="px-3 py-2 border">{i.whatsapp}</td>
                <td className="px-3 py-2 border">{i.email}</td>
                <td className="px-3 py-2 border text-center">
                  <a
                    href={`https://wa.me/${i.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Hola ${i.nombre}! 👋 Quiero contactarte sobre tu objetivo de ${i.objetivo}.`
                    )}`}
                    target="_blank"
                    className="inline-block bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg shadow-sm transition font-medium"
                  >
                    WhatsApp
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
