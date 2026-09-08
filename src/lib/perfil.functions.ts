import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const perfilSchema = z.object({
  nombre: z.string().trim().min(3, "Escriba su nombre y apellido").max(80),
  telefono: z
    .string()
    .trim()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .max(20)
    .regex(/^[+]?[0-9\s-]+$/, "Use solo números"),
  sexo: z.enum(["Femenino", "Masculino", "Prefiero no decirlo"]),
  edad: z.number().int().min(18, "Edad mínima 18 años").max(110, "Revise la edad"),
  comuna: z.string().trim().min(2, "Indique su comuna").max(60),
});

export const obtenerPerfil = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("profiles")
      .select("nombre, telefono, sexo, edad, comuna")
      .eq("id", context.userId)
      .maybeSingle();

    const completo = Boolean(data?.nombre && data?.telefono && data?.sexo && data?.edad && data?.comuna);

    return {
      nombre: data?.nombre ?? "",
      telefono: data?.telefono ?? "",
      sexo: data?.sexo ?? "",
      edad: data?.edad ?? null,
      comuna: data?.comuna ?? "",
      completo,
    };
  });

export const guardarPerfil = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => perfilSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .upsert(
        {
          id: context.userId,
          nombre: data.nombre,
          telefono: data.telefono,
          sexo: data.sexo,
          edad: data.edad,
          comuna: data.comuna,
        },
        { onConflict: "id" },
      );
    if (error) throw new Error("No pudimos guardar sus datos. Intente nuevamente.");
    return { ok: true };
  });
