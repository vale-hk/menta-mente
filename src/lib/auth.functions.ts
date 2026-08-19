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

const solicitarSchema = z.object({ nombre: nombreSchema, telefono: telefonoSchema });
const verificarSchema = z.object({
  telefono: telefonoSchema,
  pin: z.string().trim().regex(/^[0-9]{6}$/, "El PIN tiene 6 dígitos"),
});

function normalizarTelefono(t: string) {
  const limpio = t.replace(/[^0-9+]/g, "");
  return limpio.startsWith("+") ? limpio : `+${limpio}`;
}

async function hashPin(pin: string, telefono: string) {
  const data = new TextEncoder().encode(`${telefono}:${pin}:menta`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function emailDeTelefono(telefono: string) {
  return `${telefono.replace(/[^0-9]/g, "")}@telefono.menta.app`;
}

/** Genera un PIN de 6 dígitos y lo guarda cifrado (hash). En desarrollo se devuelve para simular el SMS. */
export const solicitarPin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => solicitarSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const telefono = normalizarTelefono(data.telefono);

    // Límite de envíos: máximo 5 códigos por teléfono en 15 minutos.
    const desde = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("otp_codes")
      .select("id", { count: "exact", head: true })
      .eq("telefono", telefono)
      .gte("created_at", desde);
    if ((count ?? 0) >= 5) {
      throw new Error("Demasiados intentos. Espere unos minutos antes de pedir otro código.");
    }

    const pin = String(crypto.getRandomValues(new Uint32Array(1))[0]! % 1000000).padStart(6, "0");
    const code_hash = await hashPin(pin, telefono);

    const { error } = await supabaseAdmin.from("otp_codes").insert({
      telefono,
      nombre: data.nombre.trim(),
      code_hash,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });
    if (error) throw new Error("No se pudo generar el código. Intente nuevamente.");

    // En producción aquí se envía el SMS. En este entorno se simula mostrando el código.
    return { enviado: true, telefono, pinDemo: pin };
  });

/** Verifica el PIN, crea el usuario si no existe y devuelve credenciales de un solo uso. */
export const verificarPin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => verificarSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const telefono = normalizarTelefono(data.telefono);

    const { data: registro } = await supabaseAdmin
      .from("otp_codes")
      .select("id, nombre, code_hash, intentos, expires_at, consumido")
      .eq("telefono", telefono)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!registro || registro.consumido || new Date(registro.expires_at) < new Date()) {
      throw new Error("El código expiró. Solicite uno nuevo.");
    }
    if (registro.intentos >= 5) {
      throw new Error("Demasiados intentos fallidos. Solicite un código nuevo.");
    }

    const hash = await hashPin(data.pin, telefono);
    if (hash !== registro.code_hash) {
      await supabaseAdmin
        .from("otp_codes")
        .update({ intentos: registro.intentos + 1 })
        .eq("id", registro.id);
      throw new Error("El código no coincide. Revise los 6 dígitos.");
    }

    await supabaseAdmin.from("otp_codes").update({ consumido: true }).eq("id", registro.id);

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
        user_metadata: { nombre: registro.nombre, telefono },
      });
      if (errCrear || !creado.user) throw new Error("No se pudo crear la cuenta.");
      userId = creado.user.id;
      await supabaseAdmin
        .from("profiles")
        .insert({ id: userId, nombre: registro.nombre, telefono });
    } else {
      const { error: errPass } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password,
      });
      if (errPass) throw new Error("No se pudo iniciar la sesión.");
      await supabaseAdmin.from("profiles").update({ nombre: registro.nombre }).eq("id", userId);
    }

    return { email, password, nombre: registro.nombre };
  });
