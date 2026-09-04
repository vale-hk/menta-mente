import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const COMUNAS = [
  "Santiago",
  "Maipú",
  "La Florida",
  "Puente Alto",
  "Ñuñoa",
  "Providencia",
  "Las Condes",
  "Peñalolén",
  "La Reina",
  "Recoleta",
  "San Miguel",
  "Quilicura",
  "Puente Alto",
  "Macul",
  "Huechuraba",
  "Estación Central",
];

const NOMBRES = [
  "María", "José", "Rosa", "Luis", "Carmen", "Pedro", "Ana", "Jorge", "Gladys", "Hernán",
  "Elena", "Raúl", "Sonia", "Manuel", "Teresa", "Óscar", "Ximena", "Sergio", "Marta", "Raquel",
  "Hugo", "Patricia", "Eduardo", "Silvia", "René", "Olga", "Víctor", "Alicia", "Fernando", "Iris",
  "Carlos", "Beatriz", "Rubén", "Nora", "Arturo", "Dora", "Mario", "Ester", "Alfredo", "Lucía",
  "Ramón", "Adriana", "Héctor", "Julia", "Guillermo", "Paz", "Samuel", "Isabel", "Nelson", "Claudia",
];

const APELLIDOS = [
  "Pérez", "González", "Muñoz", "Rojas", "Díaz", "Soto", "Contreras", "Silva", "Fuentes", "Vargas",
  "Araya", "Espinoza", "Morales", "Campos", "Tapia", "Figueroa", "Herrera", "Paredes", "Núñez", "Bravo",
];

const EJERCICIOS: Record<string, string[]> = {
  atencion: ["Encuentra la diferencia", "Letras objetivo", "Símbolos repetidos"],
  memoria: ["Recuerda la lista", "Parejas de palabras", "Historia corta"],
  "funciones-ejecutivas": ["Ordena los pasos", "Clasifica objetos", "Planifica el día"],
  lenguaje: ["Nombra la imagen", "Completa la frase", "Sinónimos y antónimos"],
};

/** Generador pseudoaleatorio determinista para datos reproducibles. */
function crearRandom(semilla: number) {
  let s = semilla;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/**
 * Genera 50 usuarios ficticios con actividad registrada en la base de datos.
 * Requiere un token de administración válido. Es idempotente: si los usuarios
 * demo ya existen, no crea duplicados.
 */
export const generarDatosDemo = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ token: z.string().max(300) }).parse(input))
  .handler(async ({ data }): Promise<{ ok: boolean; creados: number; mensaje: string }> => {
    const { validarTokenAdminServidor } = await import("./adminToken.server");
    if (!(await validarTokenAdminServidor(data.token))) {
      return { ok: false, creados: 0, mensaje: "No autorizado." };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rnd = crearRandom(20260904);

    let creados = 0;
    for (let i = 0; i < 50; i++) {
      const nombre = `${NOMBRES[i % NOMBRES.length]!} ${APELLIDOS[Math.floor(rnd() * APELLIDOS.length)]!}`;
      const telefono = `+5691000${String(1000 + i)}`; // rango reservado para demo
      const email = `${telefono.replace(/[^0-9]/g, "")}@telefono.menta.app`;
      const edad = 60 + Math.floor(rnd() * 29);
      const sexo = rnd() > 0.42 ? "Femenino" : "Masculino";
      const comuna = COMUNAS[Math.floor(rnd() * COMUNAS.length)]!;

      const { data: existente } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("telefono", telefono)
        .maybeSingle();

      let userId = existente?.id ?? null;
      if (!userId) {
        const { data: creado, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password: crypto.randomUUID() + crypto.randomUUID(),
          email_confirm: true,
          user_metadata: { nombre, telefono },
        });
        if (error || !creado.user) continue;
        userId = creado.user.id;
        creados++;
      }

      await supabaseAdmin.from("profiles").upsert({
        id: userId,
        nombre,
        telefono,
        edad,
        sexo,
        comuna,
      });

      // Entre 6 y 20 ejercicios por usuario en los últimos 60 días.
      const totalEjercicios = 6 + Math.floor(rnd() * 15);
      const logs = Array.from({ length: totalEjercicios }, () => {
        const categoria = Object.keys(EJERCICIOS)[Math.floor(rnd() * 4)]!;
        const nombreEjercicio =
          EJERCICIOS[categoria]![Math.floor(rnd() * EJERCICIOS[categoria]!.length)]!;
        const diasAtras = Math.floor(rnd() * 60);
        return {
          user_id: userId!,
          categoria,
          nombre_ejercicio: nombreEjercicio,
          puntaje: 20 + Math.floor(rnd() * 80),
          fecha_ejecucion: new Date(Date.now() - diasAtras * 86400000 - Math.floor(rnd() * 86400000)).toISOString(),
        };
      });
      await supabaseAdmin.from("activity_logs").insert(logs);
    }

    return {
      ok: true,
      creados,
      mensaje: `Se generaron ${creados} usuarios de demostración con su actividad.`,
    };
  });
