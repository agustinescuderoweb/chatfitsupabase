import OpenAI from "openai";
import { supabaseServer } from "@/lib/supabaseServer";

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
- Preguntar uno por uno
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
    const jsonMatch = reply.match(/{[\s\S]*}/);

    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);

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
          Object.entries(parsed).filter(([key]) =>
            allowedKeys.includes(key)
          )
        );

        // --- INSERT EN SUPABASE ---
        const { data, error } = await supabaseServer
          .from("leads_fitbot")
          .insert([filteredInsight])
          .select();

        if (error) {
          console.error("Supabase error:", error);
        } else {
          console.log("Lead guardado:", data);
        }

      } catch (jsonError) {
        console.error("Error parseando JSON:", jsonError);
      }
    }

    return new Response(
      JSON.stringify({ reply }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error general:", error);

    return new Response(
      JSON.stringify({ error: "Error procesando el mensaje" }),
      { status: 500 }
    );
  }
}
