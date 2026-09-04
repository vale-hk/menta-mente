import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { validarTokenAdminServidor } from "./admin.functions";

export type RegistroAdminDB = {
  id: string;
  usuario: string;
  edad: number | null;
  sexo: string | null;
  comuna: string | null;
  atencion: number | null;
  memoria: number | null;
  funciones: number | null;
  lenguaje: number | null;
  ultimaActividad: string | null;
};

const CATEGORIAS = {
  atencion: "atencion",
  memoria: "memoria",
  "funciones-ejecutivas": "funciones",
  lenguaje: "lenguaje",
} as const;

/** Entrega los registros reales de la base de datos para el panel de administración. */
export const obtenerRegistrosAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ token: z.string().max(300) }).parse(input))
  .handler(async ({ data }): Promise<{ ok: boolean; registros: RegistroAdminDB[] }> => {
    const valido = await validarTokenAdminServidor(data.token);
    if (!valido) return { ok: false, registros: [] };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [{ data: perfiles }, { data: logs }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, nombre, edad, sexo, comuna"),
      supabaseAdmin
        .from("activity_logs")
        .select("user_id, categoria, puntaje, fecha_ejecucion")
        .order("fecha_ejecucion", { ascending: false })
        .limit(5000),
    ]);

    const acumulado = new Map<
      string,
      { sumas: Record<string, { total: number; n: number }>; ultima: string | null }
    >();

    for (const log of logs ?? []) {
      const clave = CATEGORIAS[log.categoria as keyof typeof CATEGORIAS];
      if (!clave) continue;
      const actual = acumulado.get(log.user_id) ?? { sumas: {}, ultima: null };
      const celda = actual.sumas[clave] ?? { total: 0, n: 0 };
      celda.total += log.puntaje;
      celda.n += 1;
      actual.sumas[clave] = celda;
      if (!actual.ultima || log.fecha_ejecucion > actual.ultima) actual.ultima = log.fecha_ejecucion;
      acumulado.set(log.user_id, actual);
    }

    const prom = (v?: { total: number; n: number }) =>
      v && v.n > 0 ? Math.round(v.total / v.n) : null;

    const registros: RegistroAdminDB[] = (perfiles ?? []).map((p) => {
      const a = acumulado.get(p.id);
      return {
        id: p.id.slice(0, 8).toUpperCase(),
        usuario: p.nombre,
        edad: p.edad ?? null,
        sexo: p.sexo ?? null,
        comuna: p.comuna ?? null,
        atencion: prom(a?.sumas["atencion"]),
        memoria: prom(a?.sumas["memoria"]),
        funciones: prom(a?.sumas["funciones"]),
        lenguaje: prom(a?.sumas["lenguaje"]),
        ultimaActividad: a?.ultima ?? null,
      };
    });

    return { ok: true, registros };
  });
