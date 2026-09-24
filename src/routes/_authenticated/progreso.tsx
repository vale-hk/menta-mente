import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { IntranetShell } from "@/components/IntranetShell";
import { LeyendaLogro } from "@/components/LeyendaLogro";
import { IconoCategoria } from "@/components/IconoCategoria";
import { obtenerProgreso } from "@/lib/progreso.functions";
import { categorias, type Categoria } from "@/data/ejercicios";

export const Route = createFileRoute("/_authenticated/progreso")({
  head: () => ({ meta: [
    { title: "Mi progreso en Menta — Historial y evolución" },
    { name: "description", content: "Revise sus puntajes por área, intentos anteriores y evolución anual en Menta." },
    { property: "og:title", content: "Mi progreso en Menta" },
    { property: "og:description", content: "Historial privado de puntajes y evolución anual." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Progreso,
});

type Registro = { id: string; categoria: string; nombre_ejercicio: string; ejercicio_id: string | null; puntaje: number; fecha_ejecucion: string };
const MAX_AREA = 70;

function fecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
}

function tono(pct: number) {
  if (pct <= 45) return "text-red-600";
  if (pct <= 75) return "text-yellow-500";
  if (pct <= 89) return "text-emerald-400";
  return "text-green-800 dark:text-green-400";
}

function resumenAreas(registros: Registro[]) {
  return categorias.map((categoria) => {
    const propios = registros.filter((r) => r.categoria === categoria.id);
    const ultimos = new Map<string, Registro>();
    propios.forEach((r) => { if (!ultimos.has(r.nombre_ejercicio)) ultimos.set(r.nombre_ejercicio, r); });
    const puntos = [...ultimos.values()].reduce((s, r) => s + r.puntaje, 0);
    return { ...categoria, puntos, pct: Math.min(100, Math.round((puntos / MAX_AREA) * 100)), intentos: propios.length };
  });
}

function Progreso() {
  const cargar = useServerFn(obtenerProgreso);
  const { data, isLoading } = useQuery({ queryKey: ["progreso"], queryFn: () => cargar() });
  const registros = (data?.registros ?? []) as Registro[];
  const areas = resumenAreas(registros);
  const puntos = areas.reduce((s, a) => s + a.puntos, 0);
  const realizadas = areas.filter((a) => a.intentos > 0).length;
  const pctGeneral = Math.round((puntos / (MAX_AREA * categorias.length)) * 100);

  const porFecha = new Map<string, Registro[]>();
  registros.forEach((r) => {
    const clave = r.fecha_ejecucion.slice(0, 10);
    porFecha.set(clave, [...(porFecha.get(clave) ?? []), r]);
  });
  const historial = [...porFecha.entries()].sort(([a], [b]) => b.localeCompare(a));

  const hoy = new Date();
  const meses = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - 11 + i, 1);
    const clave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const propios = registros.filter((r) => r.fecha_ejecucion.startsWith(clave));
    return {
      mes: new Intl.DateTimeFormat("es-CL", { month: "short" }).format(d),
      promedio: propios.length ? Math.round(propios.reduce((s, r) => s + r.puntaje, 0) / propios.length * 10) : 0,
    };
  });

  return <IntranetShell>
    <h1 className="font-serif text-3xl font-semibold text-primary">Mi progreso</h1>
    <p className="mt-2 text-muted-foreground">Sus resultados, intentos anteriores y evolución durante los últimos 12 meses.</p>

    <section className="surface-card mt-8 border-4 border-card-border p-6" aria-labelledby="resumen">
      <h2 id="resumen" className="font-serif text-2xl font-semibold text-primary">Resumen general</h2>
      <p className="mt-3 text-lg font-semibold">Rendimiento del día: {fecha(new Date().toISOString())}</p>
      <p className={`mt-1 text-4xl font-semibold ${tono(pctGeneral)}`}>{pctGeneral}% de logro</p>
      <p className="mt-1 text-lg">Puntaje obtenido <strong>{puntos}</strong> / Puntaje total esperado <strong>{MAX_AREA * categorias.length}</strong></p>
      <div className="mt-5 rounded-lg border-2 border-border p-4"><h3 className="mb-3 text-lg font-semibold">¿Qué significan los colores?</h3><LeyendaLogro /></div>
      {realizadas < categorias.length && <p role="status" className="mt-4 rounded-lg border-2 border-primary p-4 text-lg font-semibold">Complete todas las áreas para ver su progreso exacto ({realizadas} de 4 realizadas).</p>}
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {areas.map((a) => <li key={a.id} className="rounded-lg border-2 border-border p-4">
          <div className="flex items-center gap-3"><IconoCategoria categoria={a.id} className="size-11" /><span className="text-lg font-semibold">{a.titulo}</span></div>
          <p className={`mt-2 text-2xl font-bold ${tono(a.pct)}`}>{a.puntos}/{MAX_AREA} pts · {a.pct}%</p>
          <p className="text-sm text-muted-foreground">{a.intentos} {a.intentos === 1 ? "intento" : "intentos"}</p>
        </li>)}
      </ul>
    </section>

    <section className="mt-8" aria-labelledby="evolucion">
      <h2 id="evolucion" className="font-serif text-2xl font-semibold text-primary">Evolución anual</h2>
      <p className="mt-1 text-muted-foreground">Promedio mensual de logro. Al avanzar el año, los meses anteriores permanecen agrupados automáticamente.</p>
      <div className="mt-4 h-80 w-full rounded-lg border-2 border-border bg-card p-3" aria-label="Gráfico de evolución mensual">
        <ResponsiveContainer width="100%" height="100%"><BarChart data={meses} margin={{ top: 10, right: 8, bottom: 10, left: -12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.15} />
          <XAxis dataKey="mes" tick={{ fill: "currentColor", fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fill: "currentColor", fontSize: 12 }} />
          <Tooltip formatter={(v: number) => [`${v}%`, "Logro"]} />
          <Bar dataKey="promedio" fill="var(--color-brand)" radius={[4, 4, 0, 0]} />
        </BarChart></ResponsiveContainer>
      </div>
    </section>

    <section className="mt-8" aria-labelledby="historial">
      <h2 id="historial" className="font-serif text-2xl font-semibold text-primary">Historial de intentos</h2>
      {isLoading && <p className="mt-4">Cargando su historial…</p>}
      {!isLoading && historial.length === 0 && <p className="mt-4 rounded-lg border-2 border-border p-5">Aún no hay intentos registrados.</p>}
      <div className="mt-4 grid gap-4">
        {historial.map(([dia, intentos]) => {
          const delDia = resumenAreas(intentos);
          const ptsDia = delDia.reduce((s, a) => s + a.puntos, 0);
          const pctDia = Math.min(100, Math.round((ptsDia / (MAX_AREA * categorias.length)) * 100));
          return <article key={dia} className="surface-card p-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <div><p className="text-sm font-semibold text-muted-foreground">Rendimiento del día</p><h3 className="font-serif text-xl font-semibold">{fecha(`${dia}T12:00:00`)}</h3></div>
              <div className="text-right"><span className={`block text-xl font-bold ${tono(pctDia)}`}>{pctDia}% general</span><span className="text-sm">{ptsDia} / {MAX_AREA * categorias.length} pts esperados</span></div>
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {delDia.map((a) => <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-border py-2">
                <span className="flex items-center gap-2"><IconoCategoria categoria={a.id} className="size-6" />{a.titulo}</span><span className={`font-bold ${a.intentos ? tono(a.pct) : "text-muted-foreground"}`}>{a.intentos ? `${a.puntos}/${MAX_AREA} · ${a.pct}%` : "Sin realizar · 0%"}</span>
              </li>)}
            </ul>
          </article>;
        })}
      </div>
    </section>
  </IntranetShell>;
}