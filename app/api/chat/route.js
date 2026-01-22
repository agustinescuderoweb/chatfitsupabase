import OpenAI from "openai";
import { getSupabaseServer } from "@/lib/supabaseServer";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

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
- Siempre generar JSON con los datos
          `,
        },
        ...messages,
      ],
    });

    const reply = completion.choices[0].message.content;

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

        const supabase = getSupabaseServer(); // ✅ ACÁ

        const { error } = await supabase
          .from("leads_fitbot")
          .upsert([filteredInsight], {
            onConflict: "whatsapp",
          });

        if (error) {
          console.error("Supabase error:", error);
        }
      } catch (jsonError) {
        console.error("Error parseando JSON:", jsonError);
      }
    }

    return Response.json({ reply });

  } catch (error) {
    console.error("Error general:", error);
    return Response.json(
      { error: "Error procesando el mensaje" },
      { status: 500 }
    );
  }
}
