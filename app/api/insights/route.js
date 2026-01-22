import { createClient } from "@supabase/supabase-js";

// ------------------ SUPABASE CLIENT ------------------
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ------------------ GET (Leer datos) ------------------
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("leads_fitbot")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return Response.json({ ok: true, data });

  } catch (err) {
    return Response.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}

// ------------------ POST (Agregar / Upsert datos) ------------------
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      nombre,
      edad,
      genero,
      objetivo,
      nivel,
      disponibilidad,
      lugar,
      whatsapp,
      email,
    } = body;

    // Validación mínima
    if (!email && !whatsapp) {
      return Response.json(
        { ok: false, error: "Email o WhatsApp requerido" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("leads_fitbot")
      .upsert(
        [
          {
            nombre: nombre || null,
            edad: edad || null,
            genero: genero || null,
            objetivo: objetivo || null,
            nivel: nivel || null,
            disponibilidad: disponibilidad || null,
            lugar: lugar || null,
            whatsapp: whatsapp || null,
            email: email || null,
          },
        ],
        {
          onConflict: "email",
        }
      );

    if (error) throw error;

    return Response.json({ ok: true });

  } catch (error) {
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
