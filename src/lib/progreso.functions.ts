import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const registroSchema = z.object({
  categoria: z.enum(["atencion", "memoria", "ejecutivas", "lenguaje"]),
  nombre_ejercicio: z.string().trim().min(1).max(160),
  ejercicio_id: z.string().trim().min(1).max(80),
  puntaje: z.number().int().min(0).max(100),
});

export const registrarActividad = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => registroSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("activity_logs").insert({
      user_id: context.userId,
      categoria: data.categoria,
      nombre_ejercicio: data.nombre_ejercicio,
      ejercicio_id: data.ejercicio_id,
      puntaje: data.puntaje,
    });
    if (error) throw new Error("No se pudo guardar el avance.");
    return { ok: true };
  });

export const obtenerProgreso = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: perfil }, { data: logs }] = await Promise.all([
      context.supabase.from("profiles").select("nombre, telefono").eq("id", context.userId).maybeSingle(),
      context.supabase
        .from("activity_logs")
        .select("id, categoria, nombre_ejercicio, ejercicio_id, puntaje, fecha_ejecucion")
        .order("fecha_ejecucion", { ascending: false })
        .limit(500),
    ]);

    return {
      nombre: perfil?.nombre ?? "",
      telefono: perfil?.telefono ?? "",
      registros: logs ?? [],
    };
  });
