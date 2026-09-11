import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { IntranetShell } from "@/components/IntranetShell";
import { obtenerProgreso } from "@/lib/progreso.functions";
import { categorias } from "@/data/ejercicios";


export const Route = createFileRoute("/_authenticated/progreso")({
  head: () => ({
    meta: [
      { title: "Mi progreso en Menta — Intranet personal" },
      {
        name: "description",
        content:
          "Revise sus ejercicios realizados por categoría, sus puntajes, la fecha del último intento y su nivel de progreso general en Menta.",
      },
      { property: "og:title", content: "Mi progreso en Menta" },
      {
        property: "og:description",
        content: "Panel privado con puntajes, fechas y nivel de progreso general.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Progreso,
});

type Registro = {
  id: string;
  categoria: string;
  nombre_ejercicio: string;
  ejercicio_id: string | null;
  puntaje: number;
  fecha_ejecucion: string;
};

function fecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function mensajeAnimo(total: number, ultimaSemana: number, promedio: number) {
  if (total === 0)
    return "Comience cuando quiera: cada ejercicio que realice quedará guardado aquí para acompañar su avance.";
  if (ultimaSemana >= 3)
    return `¡Excelente trabajo! Ha ejercitado su mente ${ultimaSemana} veces esta semana. ¡Siga así!`;
  if (promedio >= 8)
    return "¡Muy buenos resultados! Su precisión es alta. Un ejercicio más y su semana queda redonda.";
  if (ultimaSemana > 0)
    return "¡Buen ritmo! Ya practicó esta semana. Una sesión breve al día hace una gran diferencia.";
  return "Nos alegra verle de vuelta. Retome con un ejercicio corto: lo importante es la constancia.";
}

const PUNTOS_POR_AREA = 15;

function colorPorcentaje(pct: number) {
  if (pct <= 45) return "text-red-600";
  if (pct <= 75) return "text-yellow-500";
  if (pct <= 89) return "text-emerald-400";
  return "text-primary";
}

const alientos = [
  "¡Excelente esfuerzo, siga fortaleciendo su mente!",
  "Cada ejercicio cuenta: va muy bien.",
  "¡Buen trabajo! Su constancia se nota.",
  "Su mente agradece este rato de práctica.",
];

function Progreso() {
  const cargarProgreso = useServerFn(obtenerProgreso);

  const { data, isLoading } = useQuery({
    queryKey: ["progreso"],
    queryFn: () => cargarProgreso(),
  });

  const registros: Registro[] = (data?.registros ?? []) as Registro[];
  const total = registros.length;
  const promedio = total ? registros.reduce((s, r) => s + r.puntaje, 0) / total : 0;
  const hace7 = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const ultimaSemana = registros.filter((r) => new Date(r.fecha_ejecucion).getTime() >= hace7).length;

  const porArea = categorias.map((c) => {
    const propios = registros.filter((r) => r.categoria === c.id);
    const prom = propios.length ? propios.reduce((s, r) => s + r.puntaje, 0) / propios.length : 0;
    const pct = Math.round(prom * 10);
    return {
      ...c,
      propios,
      prom,
      pct,
      puntos: Math.round((pct / 100) * PUNTOS_POR_AREA),
      realizada: propios.length > 0,
    };
  });

  const puntosTotales = porArea.reduce((s, a) => s + a.puntos, 0);
  const areasCompletas = porArea.filter((a) => a.realizada).length;
  const nivel = Math.round((puntosTotales / (PUNTOS_POR_AREA * 4)) * 100);

  const avisado = useRef(false);
  useEffect(() => {
    if (isLoading || avisado.current || total === 0) return;
    avisado.current = true;
    toast.success(alientos[Math.floor(Math.random() * alientos.length)], { duration: 6000 });
  }, [isLoading, total]);

  return (
    <IntranetShell>
      <h1 className="font-serif text-3xl font-semibold text-primary">
        Hola{data?.nombre ? `, ${data.nombre}` : ""}
      </h1>
      <p className="mt-2 text-muted-foreground">
        Este es su espacio privado. Solo usted puede ver estos registros.
      </p>


        <section className="surface-card mt-8 border-4 border-brand p-6" aria-labelledby="nivel">
          <h2 id="nivel" className="font-serif text-2xl font-semibold text-primary">
            Resumen general
          </h2>
          <p className="mt-3 text-5xl font-semibold text-primary">
            {puntosTotales}/{PUNTOS_POR_AREA * 4} puntos totales
          </p>
          <div
            className="mt-4 h-4 w-full overflow-hidden rounded-full border-2 border-border"
            role="progressbar"
            aria-valuenow={nivel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Nivel de progreso general"
          >
            <div className="h-full bg-primary" style={{ width: `${nivel}%` }} />
          </div>
          {areasCompletas < 4 && (
            <p role="status" className="mt-4 rounded-lg border-2 border-primary p-4 text-lg font-semibold">
              Complete todas las áreas para ver su progreso exacto ({areasCompletas} de 4
              realizadas).
            </p>
          )}
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {porArea.map((a) => (
              <li key={a.id} className="rounded-lg border-2 border-border p-4 text-lg">
                <span className="font-semibold">{a.titulo}</span>{" "}
                <span className={`font-bold ${colorPorcentaje(a.pct)}`}>
                  {a.realizada ? `${a.pct}%` : "sin datos"}
                </span>
                <span className="block text-base text-muted-foreground">
                  {a.puntos} de {PUNTOS_POR_AREA} puntos
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-lg">{mensajeAnimo(total, ultimaSemana, promedio)}</p>
          <p className="mt-2 text-muted-foreground">
            {total} {total === 1 ? "ejercicio registrado" : "ejercicios registrados"} · promedio{" "}
            {promedio.toFixed(1)} de 10 puntos
          </p>
        </section>

        {isLoading && <p className="mt-8 text-lg">Cargando su progreso…</p>}

        <div className="mt-8 grid gap-6">
          {categorias.map((c) => {
            const propios = registros.filter((r) => r.categoria === c.id);
            const porEjercicio = new Map<string, Registro>();
            for (const r of propios) {
              if (!porEjercicio.has(r.nombre_ejercicio)) porEjercicio.set(r.nombre_ejercicio, r);
            }
            const prom = propios.length
              ? propios.reduce((s, r) => s + r.puntaje, 0) / propios.length
              : 0;
            return (
              <section key={c.id} className="surface-card p-6" aria-labelledby={`cat-${c.id}`}>
                <h2 id={`cat-${c.id}`} className="font-serif text-2xl font-semibold">
                  {c.titulo}
                </h2>
                <p className="mt-1 text-muted-foreground">
                  {propios.length
                    ? `${propios.length} realizaciones · promedio ${prom.toFixed(1)} de 10`
                    : "Aún no hay ejercicios registrados en esta área."}
                </p>
                {porEjercicio.size > 0 && (
                  <ul className="mt-4 grid gap-3">
                    {[...porEjercicio.values()].map((r) => (
                      <li key={r.id} className="rounded-lg border-2 border-border p-4 text-lg">
                        <span className="font-semibold">{r.nombre_ejercicio}</span> — {r.puntaje} pts
                        <span className="block text-base text-muted-foreground">
                          Última realización: {fecha(r.fecha_ejecucion)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
      </div>
    </IntranetShell>
  );

}
