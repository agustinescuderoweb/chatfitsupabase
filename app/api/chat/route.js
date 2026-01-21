import OpenAI from "openai";
import { supabase } from "@/lib/supabaseClient";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // --- CHAT GPT ---
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Eres FitBot, un asistente virtual para un entrenador personal.
Tu misión es:
- Conversar de manera amigable
- Preguntar qué quiere lograr y para qué
- Luego pedir permiso para hacer preguntas
- Obtener: nombre, edad, género, objetivo, nivel, días disponibles, lugar, WhatsApp, email
- Pregunta uno por uno
- Confirmar datos
- Al finalizar, avisar que un profesional se contactará
- Siempre generar JSON con los datos, por ejemplo:
{"nombre":"", "edad":0, "genero":"", "objetivo":"", "nivel":"", "disponibilidad":"", "lugar":"", "whatsapp":"", "email":""}
- Si solo te saludan, respondé corto.
        `,
        },
        ...messages,
      ],
    });

    const reply = completion.choices[0].message.content;

    // --- EXTRACCIÓN JSON ---
    const insightMatch = reply.match(/{[\s\S]*}/);

    if (insightMatch) {
      try {
        const insight = JSON.parse(insightMatch[0]);

        const allowedKeys = [
          "nombre",
          "edad",
          "genero",
          "objetivo",
          "nivel",
          "disponibilidad",
          "lugar",
          "whatsapp",
          "email",
        ];

        const filteredInsight = Object.fromEntries(
          Object.entries(insight).filter(([k]) => allowedKeys.includes(k))
        );

       // --------------🔥 INSERT EN SUPABASE --------------
      const { data, error } = await supabase
          .from("leads_fitbot")
          .insert([filteredInsight]);

        if (error) {
           console.error("Supabase ERROR:", error);
        } else {
           console.log("Datos guardados en Supabase:", data);
        }
        // ------------------------------------------------


      } catch (e) {
        console.error("Error al procesar JSON:", e);
      }
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error general:", error);
    return new Response(
      JSON.stringify({ error: "Error procesando el mensaje" }),
      { status: 500 }
    );
  }
}
