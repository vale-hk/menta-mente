import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const telefonoSchema = z
  .string()
  .trim()
  .min(8, "El teléfono debe tener al menos 8 dígitos")
  .max(20, "El teléfono es demasiado largo")
  .regex(/^[+]?[0-9\s-]+$/, "Use solo números");

const nombreSchema = z
  .string()
  .trim()
  .min(3, "Escriba su nombre completo")
  .max(80, "El nombre es demasiado largo");

const ingresarSchema = z.object({
  nombre: nombreSchema,
  telefono: telefonoSchema,
  pin: z.string().trim().regex(/^[0-9]{4}$/, "El PIN tiene 4 dígitos"),
});

/** PIN de acceso compartido para toda la aplicación (sin envío de SMS). */
const PIN_ACCESO = "5432";

function normalizarTelefono(t: string) {
  const limpio = t.replace(/[^0-9+]/g, "");
  return limpio.startsWith("+") ? limpio : `+${limpio}`;
}

function emailDeTelefono(telefono: string) {
  return `${telefono.replace(/[^0-9]/g, "")}@telefono.menta.app`;
}

/** Verifica el PIN de acceso, crea la cuenta si no existe y devuelve credenciales de un solo uso. */
export const ingresar = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ingresarSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.pin !== PIN_ACCESO) {
      throw new Error("El PIN no es correcto. Revise los 4 dígitos.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const telefono = normalizarTelefono(data.telefono);
    const nombre = data.nombre.trim();
    const email = emailDeTelefono(telefono);
    const password = crypto.randomUUID() + crypto.randomUUID();

    const { data: perfilExistente } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("telefono", telefono)
      .maybeSingle();

    let userId = perfilExistente?.id ?? null;

    if (!userId) {
      const { data: creado, error: errCrear } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { nombre, telefono },
      });
      if (errCrear || !creado.user) throw new Error("No se pudo crear la cuenta.");
      userId = creado.user.id;
      await supabaseAdmin.from("profiles").insert({ id: userId, nombre, telefono });
    } else {
      const { error: errPass } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password,
      });
      if (errPass) throw new Error("No se pudo iniciar la sesión.");
      await supabaseAdmin.from("profiles").update({ nombre }).eq("id", userId);
    }

    return { email, password, nombre };
  });
