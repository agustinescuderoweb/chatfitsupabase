import { getSupabaseServer } from "@/lib/supabaseServer";

// ------------------ GET ------------------
export async function GET() {
  try {
    const supabase = getSupabaseServer();

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

// ------------------ POST ------------------
export async function POST(req) {
  try {
    const supabase = getSupabaseServer();
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
            nombre: nombre ?? null,
            edad: edad ?? null,
            genero: genero ?? null,
            objetivo: objetivo ?? null,
            nivel: nivel ?? null,
            disponibilidad: disponibilidad ?? null,
            lugar: lugar ?? null,
            whatsapp: whatsapp ?? null,
            email: email ?? null,
          },
        ],
        {
          onConflict: "whatsapp",
        }
      );

    if (error) throw error;

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
